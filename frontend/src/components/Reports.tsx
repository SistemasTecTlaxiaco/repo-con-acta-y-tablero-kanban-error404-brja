import React from 'react';

interface Loan {
  id: string;
  purpose: string;
  amount: number;
  date: Date;
  dueDate: Date;
  interestRate: number;
  status: "active" | "paid" | "overdue" | "pending";
  paid: boolean;
  remaining: number;
  branch?: string;
}

interface Transaction {
  id: string;
  type: "loan" | "payment" | "fee" | "bonus" | "investment";
  amount: number;
  date: Date;
  description: string;
  status: "completed" | "pending" | "failed";
  category?: string;
}

interface ReportsProps {
  loans: Loan[];
  transactions: Transaction[];
}

const Reports: React.FC<ReportsProps> = ({ loans, transactions }) => {
  const totalLoans = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const activeLoans = loans.filter(loan => loan.status === 'active');
  const paidLoans = loans.filter(loan => loan.status === 'paid');
  const totalPaid = paidLoans.reduce((sum, loan) => sum + loan.amount, 0);
  
  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter(t => t.status === 'completed').length;

  const loanStatusData = [
    { status: 'Activos', count: activeLoans.length, color: '#00ff88' },
    { status: 'Pagados', count: paidLoans.length, color: '#00aaff' },
    { status: 'Pendientes', count: loans.filter(l => l.status === 'pending').length, color: '#ffaa00' },
    { status: 'Vencidos', count: loans.filter(l => l.status === 'overdue').length, color: '#ff4444' }
  ];

  return (
    <div className="reports">
      <div className="section-header">
        <h1>Reportes y Análisis</h1>
        <p>Métricas y estadísticas de tu actividad financiera</p>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <h3>📊 Resumen General</h3>
          <div className="metric">
            <span className="metric-label">Total en Préstamos</span>
            <span className="metric-value">${totalLoans.toLocaleString()}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Préstamos Activos</span>
            <span className="metric-value">{activeLoans.length}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Total Pagado</span>
            <span className="metric-value">${totalPaid.toLocaleString()}</span>
          </div>
        </div>

        <div className="report-card">
          <h3>💳 Actividad Transaccional</h3>
          <div className="metric">
            <span className="metric-label">Total Transacciones</span>
            <span className="metric-value">{totalTransactions}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Completadas</span>
            <span className="metric-value">{completedTransactions}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Tasa de Éxito</span>
            <span className="metric-value">
              {totalTransactions > 0 ? ((completedTransactions / totalTransactions) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>

        <div className="report-card">
          <h3>📈 Estado de Préstamos</h3>
          {loanStatusData.map((item, index) => (
            <div key={index} className="status-item">
              <div className="status-indicator" style={{ backgroundColor: item.color }}></div>
              <span className="status-label">{item.status}</span>
              <span className="status-count">{item.count}</span>
            </div>
          ))}
        </div>

        <div className="report-card">
          <h3>🎯 Préstamos por Propósito</h3>
          {loans.slice(0, 5).map((loan, index) => (
            <div key={loan.id} className="purpose-item">
              <span className="purpose-name">{loan.purpose}</span>
              <span className="purpose-amount">${loan.amount}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="reports-actions">
        <button className="btn-primary">📥 Exportar Reporte PDF</button>
        <button className="btn-secondary">📊 Generar Gráficas</button>
        <button className="btn-secondary">🔄 Actualizar Datos</button>
      </div>

      {loans.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No hay datos para reportes</h3>
          <p>Los reportes se generarán automáticamente cuando tengas actividad</p>
        </div>
      )}
    </div>
  );
};

export default Reports;