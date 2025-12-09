// src/components/TestnetVerifier.tsx
import { useState } from 'react';
import { useTestnetStorage } from './hooks/useTestnetStorage';

export const TestnetVerifier = () => {
  const [publicKey, setPublicKey] = useState('');
  const [verificationData, setVerificationData] = useState<any>(null);

  const verifyTestnetAccount = async () => {
    if (!publicKey) return;

    try {
      // Verificar cuenta
      const accountResponse = await fetch(
        `https://horizon-testnet.stellar.org/accounts/${publicKey}`
      );
      
      if (accountResponse.status === 404) {
        setVerificationData({ error: 'Cuenta no encontrada en Testnet' });
        return;
      }

      const accountData = await accountResponse.json();
      
      // Verificar transacciones
      const txResponse = await fetch(
        `https://horizon-testnet.stellar.org/accounts/${publicKey}/transactions?limit=5`
      );
      const txData = await txResponse.json();

      // Verificar data entries
      const dataResponse = await fetch(
        `https://horizon-testnet.stellar.org/accounts/${publicKey}/data`
      );
      const dataEntries = await dataResponse.json();

      setVerificationData({
        account: accountData,
        transactions: txData,
        dataEntries: dataEntries
      });

    } catch (error) {
      console.error('Error verificando:', error);
      setVerificationData({ error: 'Error al verificar cuenta' });
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid blue', margin: '10px' }}>
      <h3>🌐 Verificador Testnet</h3>
      
      <div>
        <input
          type="text"
          placeholder="Public Key (GD...)"
          value={publicKey}
          onChange={(e) => setPublicKey(e.target.value)}
          style={{ width: '400px', marginRight: '10px' }}
        />
        <button onClick={verifyTestnetAccount}>Verificar en Testnet</button>
      </div>

      {verificationData && (
        <div style={{ marginTop: '20px' }}>
          <h4>Resultados:</h4>
          <pre>{JSON.stringify(verificationData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};