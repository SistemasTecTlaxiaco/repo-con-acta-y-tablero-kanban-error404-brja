// components/MyLoans.tsx
import React, { useState, useEffect } from "react";
import { useTestnetStorage } from "./hooks/useTestnetStorage";

interface MyLoansProps {
  userWallet?: {
    publicKey: string;
    secret?: string;
  };
  userId: string;
  onPay: (loanId: string) => void;
  onApprove?: (loanId: string) => void;
  loading?: boolean;
}

export default function MyLoans({ userWallet, userId, onPay, onApprove, loading }: MyLoansProps) {
  const { loans, loading: storageLoading, saveLoan, loadUserLoans, updateLoanStatus } = useTestnetStorage(userWallet);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [loanForm, setLoanForm] = useState({
    purpose: '',
    amount: 0,
    interestRate: 5,
    dueDate: ''
  });

  useEffect(() => {
    if (userWallet) {
      loadUserLoans();
    }
  }, [userWallet]);

  const handleCreateLoan = async () => {
    if (!loanForm.purpose.trim() || loanForm.amount <= 0) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const success = await saveLoan({
      userId: userId || userWallet?.publicKey || '',
      purpose: loanForm.purpose,
      amount: loanForm.amount,
      interestRate: loanForm.interestRate,
      status: 'pending',
      dueDate: loanForm.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 días por defecto
    });

    if (success) {
      setShowLoanForm(false);
      setLoanForm({ purpose: '', amount: 0, interestRate: 5, dueDate: '' });
      alert('✅ Préstamo guardado en Testnet');
    } else {
      alert('❌ Error guardando préstamo');
    }
  };

  const handleApproveLoan = async (loanId: string) => {
    const success = await updateLoanStatus(loanId, 'active');
    if (success) {
      alert('✅ Préstamo aprobado');
      if (onApprove) {
        onApprove(loanId);
      }
    } else {
      alert('❌ Error aprobando préstamo');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-MX');
    } catch {
      return dateString;
    }
  };

  const pendingLoans = loans.filter(loan => loan.status === 'pending');
  const activeLoans = loans.filter(loan => loan.status === 'active');
  const paidLoans = loans.filter(loan => loan.status === 'paid');

  const isLoading = loading || storageLoading;

  return (
    <div className="section">
      <div className="section-header">
        <h1 className="section-title">Mis Préstamos en Testnet</h1>
        <div className="testnet-badge">🔗 Datos desde Blockchain</div>
        <button 
          className="button-primary"
          onClick={() => setShowLoanForm(true)}
          disabled={isLoading}
        >
          {isLoading ? "⏳..." : "📝 Solicitar Préstamo"}
        </button>
      </div>

      {/* Formulario de préstamo */}
      {showLoanForm && (
        <div className="card">
          <h3>Nueva Solicitud de Préstamo</h3>
          <div className="form-group">
            <label>Propósito del Préstamo *</label>
            <input
              type="text"
              value={loanForm.purpose}
              onChange={(e) => setLoanForm({...loanForm, purpose: e.target.value})}
              placeholder="Ej: Libros, Matrícula, Equipo..."
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Monto *</label>
            <input
              type="number"
              value={loanForm.amount}
              onChange={(e) => setLoanForm({...loanForm, amount: Number(e.target.value)})}
              min="100"
              max="50000"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Tasa de Interés (%)</label>
            <input
              type="number"
              value={loanForm.interestRate}
              onChange={(e) => setLoanForm({...loanForm, interestRate: Number(e.target.value)})}
              min="1"
              max="20"
              step="0.1"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Fecha de Vencimiento</label>
            <input
              type="date"
              value={loanForm.dueDate}
              onChange={(e) => setLoanForm({...loanForm, dueDate: e.target.value})}
              className="form-control"
            />
          </div>
          <div className="form-actions">
            <button 
              className="button-primary" 
              onClick={handleCreateLoan}
              disabled={isLoading}
            >
              {isLoading ? "⏳ Enviando..." : "💾 Guardar en Testnet"}
            </button>
            <button 
              className="button-secondary" 
              onClick={() => setShowLoanForm(false)}
            >
              ❌ Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Préstamos Pendientes */}
      <div className="loan-status-section">
        <h3>📋 Préstamos Pendientes ({pendingLoans.length})</h3>
        {pendingLoans.length === 0 ? (
          <p className="no-data">No hay préstamos pendientes</p>
        ) : (
          pendingLoans.map(loan => (
            <div key={loan.id} className="loan-item pending">
              <div className="loan-header">
                <h4 className="loan-title">{loan.purpose}</h4>
                <span className="loan-status pending">⏳ Pendiente</span>
              </div>
              <div className="loan-details">
                <div className="detail">
                  <span className="label">Monto:</span>
                  <span className="value">${loan.amount.toLocaleString()}</span>
                </div>
                <div className="detail">
                  <span className="label">Interés:</span>
                  <span className="value">{loan.interestRate}%</span>
                </div>
                <div className="detail">
                  <span className="label">Solicitado:</span>
                  <span className="value">{formatDate(loan.createdAt)}</span>
                </div>
                <div className="detail">
                  <span className="label">ID:</span>
                  <span className="value code">{loan.id}</span>
                </div>
              </div>
              <div className="loan-actions">
                {onApprove && (
                  <button 
                    className="button-success"
                    onClick={() => handleApproveLoan(loan.id)}
                    disabled={isLoading}
                  >
                    ✅ Aprobar
                  </button>
                )}
                <button 
                  className="button-warning"
                  onClick={() => {/* Función para rechazar */}}
                  disabled={isLoading}
                >
                  ❌ Rechazar
                </button>
              </div>
              <div className="testnet-info">
                <small>📍 Guardado en Testnet - {loan.userId.substring(0, 8)}...</small>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Préstamos Activos */}
      <div className="loan-status-section">
        <h3>💰 Préstamos Activos ({activeLoans.length})</h3>
        {activeLoans.length === 0 ? (
          <p className="no-data">No hay préstamos activos</p>
        ) : (
          activeLoans.map(loan => (
            <div key={loan.id} className="loan-item active">
              <div className="loan-header">
                <h4 className="loan-title">{loan.purpose}</h4>
                <span className="loan-status active">💰 Activo</span>
              </div>
              <div className="loan-details">
                <div className="detail">
                  <span className="label">Monto Total:</span>
                  <span className="value">${loan.amount.toLocaleString()}</span>
                </div>
                <div className="detail">
                  <span className="label">Interés:</span>
                  <span className="value">{loan.interestRate}%</span>
                </div>
                <div className="detail">
                  <span className="label">Vence:</span>
                  <span className="value">{formatDate(loan.dueDate)}</span>
                </div>
                <div className="detail">
                  <span className="label">Estado:</span>
                  <span className="value success">Al día</span>
                </div>
              </div>
              <div className="loan-actions">
                <button 
                  className="button-primary"
                  onClick={() => onPay(loan.id)}
                  disabled={isLoading}
                >
                  💳 Realizar Pago
                </button>
                <button 
                  className="button-secondary"
                  onClick={() => {/* Función para detalles */}}
                >
                  📊 Ver Detalles
                </button>
              </div>
              <div className="testnet-info">
                <small>📍 Guardado en Testnet</small>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Préstamos Pagados */}
      <div className="loan-status-section">
        <h3>✅ Préstamos Pagados ({paidLoans.length})</h3>
        {paidLoans.length === 0 ? (
          <p className="no-data">No hay préstamos pagados</p>
        ) : (
          paidLoans.map(loan => (
            <div key={loan.id} className="loan-item paid">
              <div className="loan-header">
                <h4 className="loan-title">{loan.purpose}</h4>
                <span className="loan-status paid">✅ Pagado</span>
              </div>
              <div className="loan-details">
                <div className="detail">
                  <span className="label">Monto Pagado:</span>
                  <span className="value">${loan.amount.toLocaleString()}</span>
                </div>
                <div className="detail">
                  <span className="label">Interés:</span>
                  <span className="value">{loan.interestRate}%</span>
                </div>
                <div className="detail">
                  <span className="label">Fecha Pago:</span>
                  <span className="value">{formatDate(loan.createdAt)}</span>
                </div>
              </div>
              <div className="testnet-info">
                <small>📍 Historial en Testnet</small>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Información de Testnet */}
      <div className="testnet-card">
        <h4>🔗 Información de Testnet</h4>
        <p>Total de préstamos en blockchain: <strong>{loans.length}</strong></p>
        <p>Wallet conectada: <strong>{userWallet ? userWallet.publicKey.substring(0, 20) + '...' : 'No conectada'}</strong></p>
        <button 
          className="button-secondary"
          onClick={loadUserLoans}
          disabled={isLoading}
        >
          🔄 Actualizar Datos
        </button>
      </div>
    </div>
  );
}