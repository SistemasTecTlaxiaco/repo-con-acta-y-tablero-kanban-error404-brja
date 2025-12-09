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

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'loan': return '💰';
      case 'payment': return '💳';
      case 'investment': return '📈';
      case 'bonus': return '🎁';
      default: return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#00ff88';
      case 'pending': return '#ffaa00';
      case 'failed': return '#ff4444';
      default: return '#888';
    }
  };

  return (
    <div className="transaction-history">
      <div className="section-header">
        <h1>Historial de Transacciones</h1>
        <p>Registro completo de todas tus operaciones financieras</p>
      </div>

      <div className="transactions-grid">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="transaction-card">
            <div className="transaction-icon">
              {getTransactionIcon(transaction.type)}
            </div>
            
            <div className="transaction-details">
              <h3>{transaction.description}</h3>
              <div className="transaction-meta">
                <span className="transaction-date">{formatDate(transaction.date)}</span>
                <span 
                  className="transaction-status"
                  style={{ color: getStatusColor(transaction.status) }}
                >
                  {transaction.status}
                </span>
              </div>
            </div>

            <div className="transaction-amount">
              <span className={`amount ${transaction.type === 'payment' ? 'negative' : 'positive'}`}>
                {transaction.type === 'payment' ? '-' : '+'}${transaction.amount}
              </span>
              <span className="transaction-type">{transaction.type}</span>
            </div>
          </div>
        ))}
      </div>

      {transactions.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No hay transacciones registradas</h3>
          <p>Tu historial de transacciones aparecerá aquí</p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;