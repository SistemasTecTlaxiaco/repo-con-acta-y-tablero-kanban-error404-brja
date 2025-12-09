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

interface InvestmentPortfolioProps {
  transactions: Transaction[];
}

const InvestmentPortfolio: React.FC<InvestmentPortfolioProps> = ({ transactions }) => {
  const investmentTransactions = transactions.filter(t => t.type === 'investment');
  
  const totalInvested = investmentTransactions
    .filter(t => t.status === 'completed')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const estimatedReturns = totalInvested * 0.08; // 8% de retorno estimado
  const portfolioValue = totalInvested + estimatedReturns;

  return (
    <div className="investment-portfolio">
      <div className="section-header">
        <h1>Portafolio de Inversiones</h1>
        <p>Gestiona y monitorea tus inversiones</p>
      </div>

      <div className="portfolio-overview">
        <div className="portfolio-card">
          <h3>Valor del Portafolio</h3>
          <div className="portfolio-value">${portfolioValue.toFixed(2)}</div>
          <div className="portfolio-change">+8% este mes</div>
        </div>

        <div className="portfolio-card">
          <h3>Total Invertido</h3>
          <div className="invested-amount">${totalInvested.toFixed(2)}</div>
          <div className="investment-count">{investmentTransactions.length} inversiones</div>
        </div>

        <div className="portfolio-card">
          <h3>Ganancias Estimadas</h3>
          <div className="returns-amount">+${estimatedReturns.toFixed(2)}</div>
          <div className="returns-percentage">+8%</div>
        </div>
      </div>

      <div className="investments-list">
        <h3>Mis Inversiones</h3>
        {investmentTransactions.map((investment) => (
          <div key={investment.id} className="investment-item">
            <div className="investment-icon">📈</div>
            <div className="investment-details">
              <h4>{investment.description}</h4>
              <span className="investment-date">
                {new Date(investment.date).toLocaleDateString('es-MX')}
              </span>
            </div>
            <div className="investment-amount">
              <span>${investment.amount}</span>
              <span 
                className={`investment-status ${investment.status}`}
              >
                {investment.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {investmentTransactions.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📈</div>
          <h3>No tienes inversiones</h3>
          <p>Comienza a invertir para hacer crecer tu dinero</p>
          <button className="btn-primary">Comenzar a Invertir</button>
        </div>
      )}
    </div>
  );
};

export default InvestmentPortfolio;