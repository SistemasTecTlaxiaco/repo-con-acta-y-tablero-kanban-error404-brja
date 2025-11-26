// walletLocal.ts - VERSIÓN REAL CON STELLAR TESTNET
import { Keypair, Networks } from '@stellar/stellar-sdk';

export interface Wallet {
  publicKey: string;
  secret: string;
  keypair: Keypair;
  network: string;
}

export function generateWallet(): Wallet {
  // Generar un keypair REAL de Stellar
  const keypair = Keypair.random();
  
  const wallet: Wallet = {
    publicKey: keypair.publicKey(),
    secret: keypair.secret(),
    keypair: keypair,
    network: Networks.TESTNET
  };

  // Guardar en localStorage
  localStorage.setItem('stellar_wallet', JSON.stringify({
    publicKey: wallet.publicKey,
    secret: wallet.secret,
    network: wallet.network
  }));

  console.log('💰 Wallet creada:', wallet.publicKey);
  return wallet;
}

export function getStoredWallet(): Wallet | null {
  try {
    const stored = localStorage.getItem('stellar_wallet');
    if (stored) {
      const walletData = JSON.parse(stored);
      const keypair = Keypair.fromSecret(walletData.secret);
      
      return {
        publicKey: keypair.publicKey(),
        secret: keypair.secret(),
        keypair: keypair,
        network: walletData.network || Networks.TESTNET
      };
    }
    return null;
  } catch (error) {
    console.error('Error loading wallet:', error);
    return null;
  }
}

export async function fundTestnetAccount(publicKey: string): Promise<boolean> {
  try {
    console.log('💰 Fondendo cuenta en Testnet:', publicKey);
    const response = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
    
    if (response.ok) {
      console.log('✅ Cuenta fundada exitosamente en Testnet');
      return true;
    } else {
      console.error('❌ Error fondendo cuenta:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('❌ Error fondendo cuenta:', error);
    return false;
  }
}

export function clearWallet(): void {
  localStorage.removeItem('stellar_wallet');
}