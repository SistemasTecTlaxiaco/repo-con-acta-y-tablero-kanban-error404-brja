<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import "./dashboard.css";

interface DashboardProps {
  user: {
    username: string;
    password: string;
    wallet?: any;
  };
  logout: () => void;
  loans: any[];
  onSectionChange: (section: string) => void;
  onRefreshData?: () => Promise<void>;
  loading?: boolean;
}

export default function Dashboard({ user, logout, loans, onSectionChange, onRefreshData, loading }: DashboardProps) {
  const [wallet, setWallet] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState<any[]>([]);

  // Calcular métricas
  const totalLoans = loans.length;
  const activeLoans = loans.filter(loan => !loan.paid && loan.status === 'active').length;
  const pendingLoans = loans.filter(loan => loan.status === 'pending').length;
  const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const paidAmount = loans.filter(loan => loan.paid)
                         .reduce((sum, loan) => sum + loan.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  useEffect(() => {
    // Simular notificaciones
    setNotifications([
      {
        id: 1,
        type: 'warning',
        title: 'Pago Próximo',
        message: 'Tu préstamo #001 vence en 3 días',
        time: '2 horas ago',
        unread: true
      },
      {
        id: 2,
        type: 'success',
        title: 'Conectado a Testnet',
        message: 'Tus datos se guardan en Stellar Testnet',
        time: '1 día ago',
        unread: true
      }
    ]);
  }, []);

  async function connectWallet() {
    if (!window.freighterApi) {
      alert("No tienes Freighter instalado");
      return;
    }

    try {
      const pubKey = await window.freighterApi.getPublicKey();
      setWallet(pubKey);
      setBalance("1,250.75");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Error al conectar la wallet");
    }
  }

  const markNotificationAsRead = (id: number) => {
    setNotifications(notifs => 
      notifs.map(n => n.id === id ? { ...n, unread: false } : n)
    );
  };

  const unreadNotifications = notifications.filter(n => n.unread).length;

  const getLoanStatus = (loan: any) => {
    if (loan.paid) return { text: 'Pagado', class: 'paid' };
    if (loan.status === 'pending') return { text: 'Pendiente', class: 'pending' };
    if (loan.status === 'active') return { text: 'Activo', class: 'active' };
    return { text: 'Pendiente', class: 'pending' };
  };

  return (
    <div className="dash-container">
      {/* Sidebar Mejorado */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>🚀 MiDapp Préstamos</h2>
          <div className="user-welcome">
            <div className="avatar">{user.username.charAt(0).toUpperCase()}</div>
            <div>
              <span>Hola, {user.username}</span>
              <div className="testnet-badge">🔗 Testnet</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            📊 Resumen
          </button>
          <button 
            className="nav-item"
            onClick={() => onSectionChange("request")}
          >
            💸 Solicitar Préstamo
          </button>
          <button 
            className="nav-item"
            onClick={() => onSectionChange("loans")}
          >
            📄 Mis Préstamos
          </button>
          <button 
            className="nav-item"
            onClick={() => onSectionChange("receipts")}
          >
            🧾 Comprobantes
          </button>
          <button 
            className="nav-item"
            onClick={() => onSectionChange("simulator")}
          >
            📈 Simulador
          </button>
          <button 
            className="nav-item"
            onClick={() => onSectionChange("profile")}
          >
            👤 Mi Perfil
          </button>
          
          <div className="nav-divider"></div>
          
          <button className="nav-item" onClick={() => onSectionChange("referrals")}>
            🎁 Programa de Referidos
          </button>
          <button className="nav-item" onClick={() => onSectionChange("support")}>
            💬 Soporte 24/7
          </button>
          <button className="nav-item" onClick={() => onSectionChange("settings")}>
            ⚙️ Configuración
          </button>
          
          <button className="nav-item logout" onClick={logout}>
            ❌ Cerrar Sesión
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="wallet-status">
            {user.wallet ? (
              <div className="wallet-connected">
                <span className="status-dot connected">●</span>
                Wallet Conectada
              </div>
            ) : (
              <div className="wallet-disconnected">
                <span className="status-dot disconnected">●</span>
                Wallet No Conectada
              </div>
            )}
          </div>
          <div className="institution-badge">
            <strong>ITT</strong>
            <span>Tecnológico de Tlaxiaco</span>
          </div>
        </div>
      </aside>

      {/* Contenido Principal Mejorado */}
      <main className="dash-main">
        {/* Header con Notificaciones */}
        <header className="dash-header">
          <div className="header-title">
            <h1>Dashboard de Préstamos</h1>
            <p>Gestiona tus finanzas estudiantiles en Stellar Testnet</p>
          </div>
          
          <div className="header-actions">
            {onRefreshData && (
              <button 
                className="refresh-btn"
                onClick={onRefreshData}
                disabled={loading}
                title="Actualizar datos desde Testnet"
              >
                {loading ? "🔄..." : "🔄"}
              </button>
            )}
            
            <div className="notifications-dropdown">
              <button className="notification-btn">
                🔔 {unreadNotifications > 0 && (
                  <span className="notification-badge">{unreadNotifications}</span>
                )}
              </button>
              <div className="notifications-panel">
                <div className="notifications-header">
                  <h4>Notificaciones</h4>
                  <span className="clear-all">Limpiar</span>
                </div>
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.type} ${notification.unread ? 'unread' : ''}`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="notification-icon">
                      {notification.type === 'warning' && '⚠️'}
                      {notification.type === 'success' && '✅'}
                    </div>
                    <div className="notification-content">
                      <strong>{notification.title}</strong>
                      <p>{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="wallet-status">
              {user.wallet ? (
                <div className="connected-wallet">
                  <span className="wallet-indicator">● Conectado</span>
                  <span className="wallet-balance">{balance} XLM</span>
                </div>
              ) : (
                <button className="connect-wallet-btn" onClick={connectWallet}>
                  🔗 Conectar Wallet
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Métricas Principales */}
        <section className="metrics-grid">
          <div className="metric-card primary">
            <div className="metric-icon">💰</div>
            <div className="metric-info">
              <h3>Total Solicitado</h3>
              <p className="metric-value">${totalAmount.toLocaleString()}</p>
              <span className="metric-label">Historial completo</span>
            </div>
          </div>
          
          <div className="metric-card warning">
            <div className="metric-icon">📊</div>
            <div className="metric-info">
              <h3>Préstamos Activos</h3>
              <p className="metric-value">{activeLoans}</p>
              <span className="metric-label">De {totalLoans} totales</span>
            </div>
          </div>
          
          <div className="metric-card success">
            <div className="metric-icon">✅</div>
            <div className="metric-info">
              <h3>Pagado Total</h3>
              <p className="metric-value">${paidAmount.toLocaleString()}</p>
              <span className="metric-label">Monto liquidado</span>
            </div>
          </div>
          
          <div className="metric-card danger">
            <div className="metric-icon">📅</div>
            <div className="metric-info">
              <h3>Pendientes</h3>
              <p className="metric-value">{pendingLoans}</p>
              <span className="metric-label">Por aprobar</span>
            </div>
          </div>
        </section>

        {/* Contenido según pestaña activa */}
        <section className="dashboard-content">
          {activeTab === "overview" && (
            <div className="overview-grid">
              {/* Widget de Préstamos Recientes */}
              <div className="widget recent-loans">
                <h3>📋 Préstamos Recientes</h3>
                <div className="loans-list">
                  {loans.slice(0, 3).map(loan => {
                    const status = getLoanStatus(loan);
                    return (
                      <div key={loan.id} className="loan-item">
                        <div className="loan-info">
                          <strong>{loan.purpose || "Préstamo Personal"}</strong>
                          <span>${loan.amount}</span>
                        </div>
                        <div className="loan-status">
                          <span className={`status ${status.class}`}>
                            {status.text}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {loans.length === 0 && (
                  <p className="no-data">No tienes préstamos registrados</p>
                )}
                <button 
                  className="view-all-btn"
                  onClick={() => onSectionChange("loans")}
                >
                  Ver todos los préstamos →
                </button>
              </div>

              {/* Widget de Acciones Rápidas */}
              <div className="widget quick-actions">
                <h3>🚀 Acciones Rápidas</h3>
                <div className="action-buttons">
                  <button 
                    className="action-btn primary"
                    onClick={() => onSectionChange("request")}
                    disabled={loading}
                  >
                    {loading ? "⏳..." : "💸 Solicitar Préstamo"}
                  </button>
                  <button 
                    className="action-btn secondary"
                    onClick={() => onSectionChange("simulator")}
                  >
                    📊 Simular Préstamo
                  </button>
                  <button 
                    className="action-btn tertiary"
                    onClick={() => onSectionChange("loans")}
                  >
                    📱 Pagar Préstamo
                  </button>
                  <button className="action-btn quaternary">
                    📄 Descargar Estados
                  </button>
                </div>
              </div>

              {/* Widget de Testnet Info */}
              <div className="widget testnet-widget">
                <h3>🔗 Stellar Testnet</h3>
                <div className="testnet-content">
                  <div className="testnet-info">
                    <p><strong>Estado:</strong> <span className="status-connected">✅ Conectado</span></p>
                    <p><strong>Wallet:</strong> {user.wallet?.publicKey?.substring(0, 20)}...</p>
                    <p><strong>Datos:</strong> Guardados en blockchain</p>
                  </div>
                  <div className="testnet-actions">
                    <button className="testnet-btn" onClick={onRefreshData} disabled={loading}>
                      {loading ? "🔄 Sincronizando..." : "🔄 Sincronizar Datos"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
=======
"use client";
import React from "react";

import PasskeyInfo from './PasskeyInfo';
import LoanPanel from './LoansPanel';
import AdvancedPasskey from './AdvancedPasskeyDemo';

export default function Dashboard(): JSX.Element {
  return (
    <div className="space-y-6">
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold">Wallet Stellar</h2>
        <p className="text-sm text-slate-600">Conecta tu passkey para gestionar tu wallet.</p>
        <PasskeyInfo />
      </section>

      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold">Préstamos</h2>
        <LoanPanel />
      </section>

      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold">Avanzado</h2>
        <AdvancedPasskey />
      </section>
    </div>
  );
}
>>>>>>> 90f075aa62ceed2115b41aa6ec5603b8373afee2
