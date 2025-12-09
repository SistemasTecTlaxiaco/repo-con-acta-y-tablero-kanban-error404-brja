import React from "react";

interface MyLoansProps {
  loans: any[];
  onPay: (id: string) => void;
  onApprove?: (id: string) => void;
  loading?: boolean;
}

export default function MyLoans({ loans, onPay, onApprove, loading }: MyLoansProps) {
  const formatDate = (date: any) => {
    if (!date) return 'No especificada';
    if (date instanceof Date) return date.toLocaleDateString('es-MX');
    try {
      return new Date(date).toLocaleDateString('es-MX');
    } catch {
      return String(date);
    }
  };

  const getStatusInfo = (loan: any) => {
    if (loan.paid) return { text: "✅ Pagado", color: "#00ff88", class: "paid" };
    if (loan.status === 'pending') return { text: "⏳ Pendiente", color: "#ffaa00", class: "pending" };
    if (loan.status === 'active') return { text: "💰 Activo", color: "#00aaff", class: "active" };
    if (loan.status === 'overdue') return { text: "⚠️ Vencido", color: "#ff4444", class: "overdue" };
    return { text: "📋 Pendiente", color: "#888", class: "pending" };
  };

  // Separar préstamos por estado
  const pendingLoans = loans.filter(loan => loan.status === 'pending');
  const activeLoans = loans.filter(loan => loan.status === 'active' && !loan.paid);
  const paidLoans = loans.filter(loan => loan.paid || loan.status === 'paid');

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">Mis Préstamos</h2>
        <div className="testnet-badge">🔗 Datos desde Testnet</div>
      </div>
      
      {loans.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💰</div>
          <h3>No tienes préstamos</h3>
          <p>Solicita tu primer préstamo para comenzar</p>
          <button 
            className="button-primary"
            onClick={() => window.dispatchEvent(new CustomEvent('sectionChange', { detail: 'request' }))}
          >
            💸 Solicitar Primer Préstamo
          </button>
        </div>
      ) : (
        <div className="loans-container">
          {/* Préstamos Pendientes de Aprobación */}
          {pendingLoans.length > 0 && (
            <div className="loan-section">
              <h3>⏳ Préstamos Pendientes ({pendingLoans.length})</h3>
              <div className="loans-grid">
                {pendingLoans.map(loan => {
                  const statusInfo = getStatusInfo(loan);
                  return (
                    <div className={`card loan-card ${statusInfo.class}`} key={loan.id}>
                      <div className="loan-header">
                        <h4>{loan.purpose || "Préstamo Personal"}</h4>
                        <span className={`status-badge ${statusInfo.class}`}>
                          {statusInfo.text}
                        </span>
                      </div>
                      <div className="loan-details">
                        <p><b>Monto:</b> ${loan.amount?.toLocaleString() || loan.principal || 0}</p>
                        <p><b>Interés:</b> {loan.interestRate || loan.interest || 0}%</p>
                        <p><b>Fecha solicitud:</b> {formatDate(loan.date)}</p>
                        <p><b>ID:</b> <code>{loan.id}</code></p>
                      </div>
                      {onApprove && (
                        <button 
                          className="button-primary" 
                          onClick={() => onApprove(loan.id)}
                          disabled={loading}
                        >
                          {loading ? "⏳ Procesando..." : "✅ Aprobar Préstamo"}
                        </button>
                      )}
                      <div className="testnet-info">
                        <small>🔗 Guardado en Testnet</small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Préstamos Activos */}
          {activeLoans.length > 0 && (
            <div className="loan-section">
              <h3>💰 Préstamos Activos ({activeLoans.length})</h3>
              <div className="loans-grid">
                {activeLoans.map(loan => {
                  const statusInfo = getStatusInfo(loan);
                  return (
                    <div className={`card loan-card ${statusInfo.class}`} key={loan.id}>
                      <div className="loan-header">
                        <h4>{loan.purpose || "Préstamo Personal"}</h4>
                        <span className={`status-badge ${statusInfo.class}`}>
                          {statusInfo.text}
                        </span>
                      </div>
                      <div className="loan-details">
                        <p><b>Monto total:</b> ${loan.amount?.toLocaleString() || 0}</p>
                        <p><b>Restante:</b> ${(loan.remaining || loan.amount)?.toLocaleString() || 0}</p>
                        <p><b>Interés:</b> {loan.interestRate || loan.interest || 0}%</p>
                        <p><b>Vence:</b> {formatDate(loan.dueDate)}</p>
                      </div>
                      <button 
                        className="button-primary" 
                        onClick={() => onPay(loan.id)}
                        disabled={loading}
                      >
                        {loading ? "⏳ Procesando..." : "💳 Pagar Préstamo"}
                      </button>
                      <div className="testnet-info">
                        <small>🔗 Guardado en Testnet</small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Préstamos Pagados */}
          {paidLoans.length > 0 && (
            <div className="loan-section">
              <h3>✅ Préstamos Pagados ({paidLoans.length})</h3>
              <div className="loans-grid">
                {paidLoans.map(loan => {
                  const statusInfo = getStatusInfo(loan);
                  return (
                    <div className={`card loan-card ${statusInfo.class}`} key={loan.id}>
                      <div className="loan-header">
                        <h4>{loan.purpose || "Préstamo Personal"}</h4>
                        <span className={`status-badge ${statusInfo.class}`}>
                          {statusInfo.text}
                        </span>
                      </div>
                      <div className="loan-details">
                        <p><b>Monto pagado:</b> ${loan.amount?.toLocaleString() || 0}</p>
                        <p><b>Interés:</b> {loan.interestRate || loan.interest || 0}%</p>
                        <p><b>Fecha pago:</b> {formatDate(loan.date)}</p>
                      </div>
                      <div className="paid-badge">✅ Completado</div>
                      <div className="testnet-info">
                        <small>🔗 Historial en Testnet</small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}