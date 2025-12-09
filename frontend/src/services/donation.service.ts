// import api from './api';
import { Operation, Asset, TransactionBuilder, Account } from '@stellar/stellar-sdk';
import { getAddress } from '@stellar/freighter-api';
import { isConnected, signTransaction, ensureTestnetNetwork } from './freighter.service';

interface Donation {
  _id: string;
  type: string;
  amount: string;
  from: {
    _id: string;
    username: string;
    walletAddress: string;
  };
  to: {
    _id: string;
    username: string;
    walletAddress: string;
  };
  project: {
    _id: string;
    title: string;
  };
  status: string;
  txHash: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'logitec_donations';

class DonationService {
  private donations: Donation[] = [];

  constructor() {
    this.loadDonations();
  }

  private loadDonations() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.donations = JSON.parse(stored);
      } else {
        this.donations = [];
      }
    } catch (e) {
      console.error('Error loading donations', e);
      this.donations = [];
    }
  }

  private saveDonations() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.donations));
    } catch (e) {
      console.error('Error saving donations', e);
    }
  }

  // Realizar una donación a un proyecto - AHORA FIRMADO CON FREIGHTER
  async makeDonation(_projectId: string, amount: string, toAddress: string): Promise<any> {
    try {
      console.log('=== INICIANDO DONACIÓN ===');

      // Asegurar que Freighter está en Testnet
      console.log('[makeDonation] 🌐 Ensuring Freighter is on Testnet...');
      await ensureTestnetNetwork();
      console.log('[makeDonation] ✅ Freighter network ensured');

      // Verificar que Freighter está conectado
      const connected = await isConnected();
      if (!connected) {
        throw new Error('Freighter wallet no está conectada');
      }

      // Obtener dirección del usuario
      const addressResult = await getAddress();
      if (addressResult.error) {
        throw new Error(`Error getting address: ${addressResult.error.message}`);
      }
      const userAddress = addressResult.address!;
      console.log('[makeDonation] User address:', userAddress);

      // Obtener sequence number de Horizon - pero NO usar la Account que devuelve
      const horizonUrl = 'https://horizon-testnet.stellar.org';
      let sequenceNumber: string;
      try {
        // Usar fetch directo a Horizon en lugar de Horizon.Server
        const accountResponse = await fetch(`${horizonUrl}/accounts/${userAddress}`);
        if (!accountResponse.ok) {
          throw new Error(`Failed to load account: ${accountResponse.status}`);
        }
        const accountData = await accountResponse.json();
        sequenceNumber = accountData.sequence;
        console.log('[makeDonation] Sequence number from Horizon:', sequenceNumber);
      } catch (error) {
        console.warn('[makeDonation] Could not load account, using default sequence');
        sequenceNumber = '1';
      }

      // CRÍTICO: Crear Account COMPLETAMENTE NUEVA sin ninguna contaminación
      const testAccount = new Account(userAddress, sequenceNumber);
      console.log('[makeDonation] Account created:', { address: userAddress, sequence: sequenceNumber });

      // DEBUGGING: Verificar qué network passphrase se usa
      console.log('[makeDonation] About to create TransactionBuilder with passphrase from Networks constant');
      console.log('[makeDonation] Account object:', testAccount);

      // Construir transacción EXPLÍCITAMENTE con TESTNET
      // NOTA: Usar passphrase TRUNCADO que Freighter v5.35.4 reporta internamente
      // para evitar conflictos de validación
      const testnetPassphrase = 'Test SDF Network ; September 2015';
      console.log('[makeDonation] Using TESTNET passphrase (as Freighter reports):', testnetPassphrase);

      const builder = new TransactionBuilder(testAccount, {
        fee: '100',
        networkPassphrase: testnetPassphrase
      });

      console.log('[makeDonation] TransactionBuilder created');

      // Log del builder para verificar internamente
      console.log('[makeDonation] Builder internal state:', {
        baseFee: '100',
        passphrase: testnetPassphrase
      });

      const transaction = builder
        .addOperation(
          Operation.payment({
            destination: toAddress,
            asset: Asset.native(),
            amount: amount
          })
        )
        .setTimeout(300)  // 5 minutes timeout instead of 30 seconds
        .build();

      console.log('[makeDonation] ✅ Transaction built');
      console.log('[makeDonation] Transaction object:', transaction);
      console.log('[makeDonation] Transaction class:', transaction.constructor.name);
      console.log('[makeDonation] Has toXDR:', typeof transaction.toXDR);

      // The transaction should already be a TransactionEnvelope
      // But let's verify it has the network passphrase embedded
      if (transaction.networkPassphrase) {
        console.log('[makeDonation] ✅ Transaction has embedded network passphrase:', transaction.networkPassphrase);
      }

      const txXdr = transaction.toXDR();
      console.log('[makeDonation] XDR length:', txXdr.length);

      // DEBUG: Verificar el network hash en el XDR
      try {
        // Usar CryptoJS o la API de Web Crypto para calcular SHA-256 del passphrase
        const encoder = new TextEncoder();
        const data = encoder.encode(testnetPassphrase);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        console.log('[makeDonation] Expected TESTNET network hash (SHA-256):', hashHex);
        console.log('[makeDonation] Using passphrase:', testnetPassphrase);

        // Decodificar el XDR para ver qué network hash tiene
        const xdrBytes = atob(txXdr);
        // El XDR tiene estructura: discriminante(4) + networkHash(32) + ...
        // Pero debemos saltarnos algunos bytes
        console.log('[makeDonation] XDR decoded length:', xdrBytes.length);
        console.log('[makeDonation] First 100 bytes of XDR (hex):',
          Array.from(xdrBytes).slice(0, 100).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(''));

      } catch (e) {
        console.warn('[makeDonation] Could not calculate/decode network hash:', e);
      }

      console.log('[makeDonation] XDR first 200 chars:', txXdr.substring(0, 200));

      // Firmar con Freighter
      console.log('[makeDonation] 📱 Signing with Freighter...');
      const signedTxXdr = await signTransaction(transaction);
      console.log('[makeDonation] ✅ Signature received');

      // Enviar a Horizon usando fetch directo (NO Horizon.Server que podría tener MAINNET)
      console.log('[makeDonation] 🚀 Submitting to Horizon...');
      const submitResponse = await fetch(`${horizonUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `tx=${encodeURIComponent(signedTxXdr)}`
      });

      if (!submitResponse.ok) {
        const errorData = await submitResponse.text();
        throw new Error(`Horizon submission failed: ${submitResponse.status} - ${errorData}`);
      }

      const txResult = await submitResponse.json();
      console.log('[makeDonation] ✅ Transaction submitted! Hash:', txResult.hash);

      // Persistir transacción localmente
      const newDonation: Donation = {
        _id: 'tx-' + Date.now(),
        type: 'donation',
        amount: amount,
        from: {
          _id: 'user-' + userAddress.slice(0, 5),
          username: 'Me',
          walletAddress: userAddress
        },
        to: {
          _id: 'project-' + _projectId,
          username: 'Project',
          walletAddress: toAddress
        },
        project: {
          _id: _projectId,
          title: 'Project Loan'
        },
        status: 'completed',
        txHash: txResult.hash,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.donations.unshift(newDonation);
      this.saveDonations();

      console.log('[makeDonation] ✅ Success!');
      return {
        txHash: txResult.hash,
        status: 'completed'
      };
    } catch (error) {
      console.error('[makeDonation] ❌ Error:', error);
      throw error;
    }
  }

  // Obtener las transacciones del usuario actual
  async getMyTransactions(): Promise<{
    made: Donation[];
    received: Donation[];
  }> {
    try {
      this.loadDonations();
      const addressResult = await getAddress();
      if (addressResult.error || !addressResult.address) return { made: [], received: [] };

      const userAddress = addressResult.address;

      const made = this.donations.filter(d => d.from.walletAddress === userAddress);
      const received = this.donations.filter(d => d.to.walletAddress === userAddress);

      return { made, received };
    } catch (error) {
      console.error('Error fetching my transactions:', error);
      return { made: [], received: [] };
    }
  }

  // Obtener donaciones recibidas por un usuario
  async getDonationsReceived(_userId: string): Promise<{
    transactions: Donation[];
    totalReceived: string;
    count: number;
  }> {
    try {
      this.loadDonations();
      const addressResult = await getAddress();
      if (addressResult.error || !addressResult.address) {
        return { transactions: [], totalReceived: '0', count: 0 };
      }
      const userAddress = addressResult.address;

      const received = this.donations.filter(d => d.to.walletAddress === userAddress);
      const total = received.reduce((sum, d) => sum + parseFloat(d.amount), 0);

      return { transactions: received, totalReceived: String(total), count: received.length };
    } catch (error) {
      console.error('Error fetching donations received:', error);
      return { transactions: [], totalReceived: '0', count: 0 };
    }
  }

  // Obtener donaciones realizadas por un usuario
  async getDonationsMade(_userId: string): Promise<{
    transactions: Donation[];
    totalDonated: string;
    count: number;
  }> {
    try {
      this.loadDonations();
      const addressResult = await getAddress();
      if (addressResult.error || !addressResult.address) {
        return { transactions: [], totalDonated: '0', count: 0 };
      }
      const userAddress = addressResult.address;

      const made = this.donations.filter(d => d.from.walletAddress === userAddress);
      const total = made.reduce((sum, d) => sum + parseFloat(d.amount), 0);

      return { transactions: made, totalDonated: String(total), count: made.length };
    } catch (error) {
      console.error('Error fetching donations made:', error);
      return { transactions: [], totalDonated: '0', count: 0 };
    }
  }
}

export const donationService = new DonationService();
