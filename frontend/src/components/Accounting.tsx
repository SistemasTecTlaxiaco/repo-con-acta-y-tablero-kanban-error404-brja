import React from 'react';

interface Transaction {
  id: string;
  type: "loan" | "payment" | "fee" | "bonus" | "investment";
  amount: number;
  date: Date;
  description: string;
  status: "completed" | "pending" | "failed";
  category?: string;
}

interface Receipt {
  id: string;
  loanId: string;
  amount: number;
  date: Date;
  type: string;
  description: string;
  satCode?: string;
}

interface AccountingProps {
  transactions: Transaction[];
  receipts: Receipt[];
}

const Accounting: React.FC<AccountingProps> = ({ transactions, receipts }) => {
  const incomeTransactions = transactions.filter(t => 
    t.type === 'payment' && t.status === 'completed'
  );
  const expenseTransactions = transactions.filter(t => 
    t.type === 'loan' && t.status === 'completed'
  );

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="accounting">
      <div className="section-header">
        <h1>Contabilidad</h1>
        <p>Gestión financiera y control de ingresos/egresos</p>
      </div>

      <div className="accounting-overview">
        <div className="accounting-card income">
          <h3>💰 Ingresos</h3>
          <div className="amount">+${totalIncome.toLocaleString()}</div>
          <span>{incomeTransactions.length} transacciones</span>
        </div>

        <div className="accounting-card expenses">
          <h3>💸 Egresos</h3>
          <div className="amount">-${totalExpenses.toLocaleString()}</div>
          <span>{expenseTransactions.length} transacciones</span>
        </div>

        <div className="accounting-card balance">
          <h3>⚖️ Balance</h3>
          <div className={`amount ${balance >= 0 ? 'positive' : 'negative'}`}>
            {balance >= 0 ? '+' : '-'}${Math.abs(balance).toLocaleString()}
          </div>
          <span>Resultado neto</span>
        </div>
      </div>

      <div className="accounting-sections">
        <div className="accounting-section">
          <h3>📥 Ingresos Recientes</h3>
          <div className="transaction-list">
            {incomeTransactions.slice(0, 5).map(transaction => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-icon">💳</div>
                <div className="transaction-info">
                  <span className="description">{transaction.description}</span>
                  <span className="date">
                    {new Date(transaction.date).toLocaleDateString('es-MX')}
                  </span>
                </div>
                <div className="transaction-amount positive">
                  +${transaction.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="accounting-section">
          <h3>📤 Egresos Recientes</h3>
          <div className="transaction-list">
            {expenseTransactions.slice(0, 5).map(transaction => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-icon">💰</div>
                <div className="transaction-info">
                  <span className="description">{transaction.description}</span>
                  <span className="date">
                    {new Date(transaction.date).toLocaleDateString('es-MX')}
                  </span>
                </div>
                <div className="transaction-amount negative">
                  -${transaction.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="accounting-actions">
        <button className="btn-primary">📋 Estado de Cuenta</button>
        <button className="btn-secondary">🧾 Comprobantes Fiscales</button>
        <button className="btn-secondary">📊 Reporte SAT</button>
      </div>
    </div>
  );
};

export default Accounting;