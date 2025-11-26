import React, { useState } from 'react';

export default function ReferralSystem() {
  const [referralCode, setReferralCode] = useState('STUDENT2024');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div className="referral-system">
      <h3>🎁 Sistema de Referidos</h3>
      <p>Invita amigos y gana beneficios</p>
      
      <div className="referral-card">
        <h4>Tu Código de Referido</h4>
        <div className="code-container">
          <code>{referralCode}</code>
          <button 
            onClick={copyToClipboard}
            className={`copy-btn ${copied ? 'copied' : ''}`}
          >
            {copied ? '✅ Copiado' : '📋 Copiar'}
          </button>
        </div>
        
        <div className="referral-stats">
          <div className="stat">
            <span className="number">5</span>
            <span className="label">Personas Invitadas</span>
          </div>
          <div className="stat">
            <span className="number">$250</span>
            <span className="label">Bonificación Total</span>
          </div>
        </div>
        
        <div className="benefits">
          <h5>Beneficios por Referir:</h5>
          <ul>
            <li>✅ $50 de descuento en tu próximo préstamo</li>
            <li>✅ Tasa de interés reducida 0.5%</li>
            <li>✅ Prioridad en aprobación</li>
            <li>✅ Asesoría personalizada gratis</li>
          </ul>
        </div>
      </div>
    </div>
  );
}