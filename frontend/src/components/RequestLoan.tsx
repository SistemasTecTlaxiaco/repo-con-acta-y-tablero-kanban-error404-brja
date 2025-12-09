import React, { useState } from "react";

interface RequestLoanProps {
  onNewLoan: (loan: any) => void;
  loading?: boolean;
}

export default function RequestLoan({ onNewLoan, loading }: RequestLoanProps) {
  const [amount, setAmount] = useState<number>(1000);
  const [purpose, setPurpose] = useState<string>("");
  const [interest, setInterest] = useState<number>(5);
  const [success, setSuccess] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const loan = {
      id: `loan_${Date.now()}`,
      amount: amount,
      purpose: purpose || "Préstamo Personal",
      interestRate: interest,
      status: 'pending',
      paid: false,
      remaining: amount,
      date: new Date(),
      dueDate: new Date(Date.now() + 15552000000), // 6 meses
    };
    
    onNewLoan(loan);
    setAmount(1000);
    setPurpose("");
    setInterest(5);
    setSuccess("¡Solicitud de préstamo enviada a Testnet!");
    setTimeout(() => setSuccess(""), 5000);
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">Solicitar Préstamo</h2>
        <div className="testnet-badge">🔗 Stellar Testnet</div>
      </div>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Propósito del Préstamo</label>
            <input 
              type="text" 
              value={purpose}
              placeholder="Ej: Libros, Matrícula, Equipo..."
              onChange={e => setPurpose(e.target.value)}
              required 
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">Monto</label>
            <input 
              type="number" 
              value={amount} 
              min={500} 
              max={50000} 
              onChange={e => setAmount(Number(e.target.value))} 
              required 
            />
            <span className="input-hint">Mínimo: $500 - Máximo: $50,000</span>
          </div>
          
          <div className="input-group">
            <label className="input-label">Tasa de Interés (%)</label>
            <input 
              type="number" 
              value={interest} 
              min={1} 
              max={20} 
              step="0.1"
              onChange={e => setInterest(Number(e.target.value))} 
              required 
            />
            <span className="input-hint">Tasa preferencial para estudiantes</span>
          </div>
          
          <button 
            className="button-primary" 
            type="submit"
            disabled={loading}
          >
            {loading ? "⏳ Enviando a Testnet..." : "📝 Solicitar Préstamo"}
          </button>
        </form>
        
        {success && (
          <div className="success-message">
            <div className="success-icon">✅</div>
            <div>
              <strong>{success}</strong>
              <p>Tu solicitud está siendo procesada en Stellar Testnet</p>
            </div>
          </div>
        )}
        
        <div className="testnet-info-card">
          <h4>🔗 Información de Testnet</h4>
          <p>Tu solicitud se guardará en Stellar Testnet de forma segura y transparente.</p>
          <ul>
            <li>✅ Transacción verificable</li>
            <li>🔒 Datos en blockchain</li>
            <li>⏱️ Procesamiento rápido</li>
          </ul>
        </div>
      </div>
    </div>
  );
}