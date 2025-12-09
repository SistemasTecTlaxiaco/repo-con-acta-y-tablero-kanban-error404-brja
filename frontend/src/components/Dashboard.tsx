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

export default function Dashboard({
  user,
  logout,
  loans,
  onSectionChange,
  onRefreshData,
  loading
}: DashboardProps) {
  const [wallet, setWallet] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState<any[]>([]);

  // Métricas
  const totalLoans = loans.length;
  const activeLoans = loans.filter(loan => !loan.paid && loan.status === "active").length;
  const pendingLoans = loans.filter(loan => loan.status === "pending").length;
  const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const paidAmount = loans
    .filter(loan => loan.paid)
    .reduce((sum, loan) => sum + loan.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  useEffect(() => {
    setNotifications([
      {
        id: 1,
        type: "warning",
        title: "Pago Próximo",
        message: "Tu préstamo #001 vence en 3 días",
        time: "2 horas ago",
        unread: true
      },
      {
        id: 2,
        type: "success",
        title: "Conectado a Testnet",
        message: "Tus datos se guardan en Stellar Testnet",
        time: "1 día ago",
        unread: true
      }
    ]);
  }, []);

  async function connectWallet() {
    if (!(window as any).freighterApi) {
      alert("No tienes Freighter instalado");
      return;
    }

    try {
      const pubKey = await (window as any).freighterApi.getPublicKey();
      setWallet(pubKey);
      setBalance("1,250.75");
    } catch (error) {
      console.error("Error al conectar la wallet:", error);
      alert("Error al conectar la wallet");
    }
  }

  const markNotificationAsRead = (id: number) => {
    setNotifications(notifs =>
      notifs.map(n => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const unreadNotifications = notifications.filter(n => n.unread).length;

  const getLoanStatus = (loan: any) => {
    if (loan.paid) return { text: "Pagado", class: "paid" };
    if (loan.status === "pending") return { text: "Pendiente", class: "pending" };
    if (loan.status === "active") return { text: "Activo", class: "active" };
    return { text: "Pendiente", class: "pending" };
  };

  return (
    <div className="dash-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>🚀 MiDapp Préstamos</h2>
          <div className="user-welcome">
            <div className="avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
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
          <button className="nav-item" onClick={() => onSectionChange("request")}>
            💸 Solicitar Préstamo
          </button>
          <button className="nav-item" onClick={() => onSectionChange("loans")}>
            📄 Mis Préstamos
          </button>
          <button className="nav-item" onClick={() => onSectionChange("receipts")}>
            🧾 Comprobantes
          </button>
          <button className="nav-item" onClick={() => onSectionChange("simulator")}>
            📈 Simulador
          </button>
          <button className="nav-item" onClick={() => onSectionChange("profile")}>
            👤 Mi Perfil
          </button>

          <div className="nav-divider"></div>

          <button className="nav-item" onClick={() => onSectionChange("referrals")}>
            🎁 Referidos
          </button>
          <button className="nav-item" onClick={() => onSectionChange("support")}>
            💬 Soporte
          </button>
          <button className="nav-item" onClick={() => onSectionChange("settings")}>
            ⚙️ Configuración
          </button>

          <button className="nav-item logout" onClick={logout}>
            ❌ Cerrar Sesión
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="dash-main">
        {/* HEADER */}
        <header className="dash-header">
          <div>
            <h1>Dashboard de Préstamos</h1>
            <p>Administra tus finanzas en Stellar Testnet</p>
          </div>

          <div className="header-actions">
            {onRefreshData && (
              <button onClick={onRefreshData} disabled={loading}>
                {loading ? "🔄..." : "🔄 Actualizar"}
              </button>
            )}

            <div className="notifications-dropdown">
              <button>🔔 {unreadNotifications}</button>
              <div className="notifications-panel">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`notification-item ${n.unread ? "unread" : ""}`}
                    onClick={() => markNotificationAsRead(n.id)}
                  >
                    <strong>{n.title}</strong>
                    <p>{n.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="wallet-status">
              {user.wallet ? (
                <div>
                  <span>● Conectado</span>
                  <span>{balance} XLM</span>
                </div>
              ) : (
                <button onClick={connectWallet}>🔗 Conectar Wallet</button>
              )}
            </div>
          </div>
        </header>

        {/* MÉTRICAS */}
        <section className="metrics-grid">
          <div className="metric-card">
            <h3>Total Solicitado</h3>
            <p>${totalAmount}</p>
          </div>
          <div className="metric-card">
            <h3>Activos</h3>
            <p>{activeLoans}</p>
          </div>
          <div className="metric-card">
            <h3>Pagado</h3>
            <p>${paidAmount}</p>
          </div>
          <div className="metric-card">
            <h3>Pendientes</h3>
            <p>{pendingLoans}</p>
          </div>
        </section>

        {/* PRÉSTAMOS */}
        <section>
          <h2>Préstamos Recientes</h2>
          {loans.slice(0, 3).map(loan => {
            const status = getLoanStatus(loan);
            return (
              <div key={loan.id}>
                <strong>{loan.purpose}</strong> - ${loan.amount}
                <span className={status.class}>{status.text}</span>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
