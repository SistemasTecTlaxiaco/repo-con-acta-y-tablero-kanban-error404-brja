import React, { useState } from "react";
import { connectWallet } from "./walletAdapter";

export default function WalletConnect({ onConnect }: { onConnect?: (address: string) => void }) {
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setError(null);
    try {
      const pubKey = await connectWallet();
      setAddress(pubKey);
      if (onConnect) onConnect(pubKey);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="section">
      <h2 className="section-title">Tu Wallet Stellar</h2>
      <p>Conecta tu wallet para operar con préstamos y ver tu dirección pública.</p>
      <button className="button-primary" onClick={handleConnect}>
        {address ? "Wallet Conectada" : "Conectar Wallet"}
      </button>
      {address && (
        <div className="card" style={{ marginTop: 20 }}>
          <p><b>Dirección pública:</b></p>
          <p style={{ wordBreak: "break-all", color: "#00eaff", fontSize: "1.1rem" }}>{address}</p>
        </div>
      )}
      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}
    </div>
  );
}