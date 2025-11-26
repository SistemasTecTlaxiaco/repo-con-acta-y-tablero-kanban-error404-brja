import React, { useState } from 'react';

const LoanCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState(1000);
  const [interestRate, setInterestRate] = useState(5);
  const [loanTerm, setLoanTerm] = useState(6);
  const [calculationType, setCalculationType] = useState<'monthly' | 'total'>('monthly');

  const calculatePayment = () => {
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm;
    
    if (calculationType === 'monthly') {
      if (monthlyRate === 0) {
        return loanAmount / numberOfPayments;
      }
      const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      return monthlyPayment;
    } else {
      return loanAmount * (1 + (interestRate / 100 * (loanTerm / 12)));
    }
  };

  const monthlyPayment = calculatePayment();
  const totalPayment = calculationType === 'monthly' ? monthlyPayment * loanTerm : monthlyPayment;
  const totalInterest = totalPayment - loanAmount;

  return (
    <div className="loan-calculator">
      <div className="section-header">
        <h1>Calculadora Financiera</h1>
        <p>Simula diferentes escenarios para tu préstamo</p>
      </div>

      <div className="calculator-container">
        <div className="calculator-inputs">
          <div className="input-group">
            <label htmlFor="loanAmount">Monto del Préstamo</label>
            <div className="input-with-symbol">
              <span className="currency-symbol">$</span>
              <input
                type="range"
                id="loanAmount"
                min="100"
                max="10000"
                step="100"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
              />
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="number-input"
              />
            </div>
            <div className="input-range-labels">
              <span>$100</span>
              <span>$10,000</span>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="interestRate">Tasa de Interés Anual</label>
            <div className="input-with-symbol">
              <input
                type="range"
                id="interestRate"
                min="1"
                max="20"
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="number-input"
              />
              <span className="percentage-symbol">%</span>
            </div>
            <div className="input-range-labels">
              <span>1%</span>
              <span>20%</span>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="loanTerm">Plazo del Préstamo</label>
            <div className="input-with-symbol">
              <input
                type="range"
                id="loanTerm"
                min="1"
                max="24"
                step="1"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
              />
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="number-input"
              />
              <span className="term-symbol">meses</span>
            </div>
            <div className="input-range-labels">
              <span>1 mes</span>
              <span>24 meses</span>
            </div>
          </div>

          <div className="calculation-type">
            <label>Tipo de Cálculo:</label>
            <div className="toggle-buttons">
              <button
                className={calculationType === 'monthly' ? 'active' : ''}
                onClick={() => setCalculationType('monthly')}
              >
                Pago Mensual
              </button>
              <button
                className={calculationType === 'total' ? 'active' : ''}
                onClick={() => setCalculationType('total')}
              >
                Total a Pagar
              </button>
            </div>
          </div>
        </div>

        <div className="calculator-results">
          <div className="result-card">
            <h3>Resultado del Cálculo</h3>
            <div className="result-item">
              <span className="result-label">
                {calculationType === 'monthly' ? 'Pago Mensual:' : 'Total a Pagar:'}
              </span>
              <span className="result-value">
                ${calculationType === 'monthly' ? monthlyPayment.toFixed(2) : totalPayment.toFixed(2)}
              </span>
            </div>
            
            <div className="result-item">
              <span className="result-label">Interés Total:</span>
              <span className="result-value">${totalInterest.toFixed(2)}</span>
            </div>
            
            <div className="result-item">
              <span className="result-label">Monto Solicitado:</span>
              <span className="result-value">${loanAmount}</span>
            </div>

            {calculationType === 'monthly' && (
              <div className="payment-breakdown">
                <h4>Desglose de Pagos</h4>
                {Array.from({ length: loanTerm }, (_, i) => (
                  <div key={i} className="payment-item">
                    <span>Mes {i + 1}</span>
                    <span>${monthlyPayment.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;