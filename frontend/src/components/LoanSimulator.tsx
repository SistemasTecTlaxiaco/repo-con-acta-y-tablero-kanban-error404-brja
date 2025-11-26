import React, { useState } from "react";

export default function LoanSimulator() {
  const [amount, setAmount] = useState(1000);
  const [months, setMonths] = useState(12);
  const interestRate = 5; // % anual

  const total = amount + (amount * interestRate * months / 12 / 100);

  return (
    <div className="section">
      <h2 className="section-title">Simulador de Préstamo</h2>
      <div className="input-group">
        <label className="input-label">Monto</label>
        <input type="number" value={amount} min={500} max={50000} onChange={e => setAmount(Number(e.target.value))} />
      </div>
      <div className="input-group">
        <label className="input-label">Meses</label>
        <input type="number" value={months} min={1} max={36} onChange={e => setMonths(Number(e.target.value))} />
      </div>
      <div className="card">
        <p><b>Total a pagar:</b> ${total.toFixed(2)}</p>
        <p><b>Interés aplicado:</b> {interestRate}% anual</p>
      </div>
    </div>
  );
}