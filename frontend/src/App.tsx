// App.tsx 
import React, { useState, useEffect } from "react";
import "./components/login.css";
import "./components/dashboard.css";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import RequestLoan from "./components/RequestLoan";
import MyLoans from "./components/MyLoans";
import Profile from "./components/Profile";
import Receipts from "./components/Receipts";
import LoanSimulator from "./components/LoanSimulator";
import ReferralSystem from "./components/ReferralSystem";
import Support from "./components/Support";
import TransactionHistory from "./components/TransactionHistory";
import Notifications from "./components/Notifications";
import LoanCalculator from "./components/LoanCalculator";
import InvestmentPortfolio from "./components/InvestmentPortfolio";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import UserManagement from "./components/UserManagement";
import BranchManagement from "./components/BranchManagement";
import SATCatalog from "./components/SATCatalog";
import Accounting from "./components/Accounting";
import { TestnetDebugger } from './components/TestnetDebugger';

// Servicios de Testnet
import { testnetStorage, UserData, LoanData } from './services/testnetStorage';
import { getStoredWallet } from './components/walletLocal';

// Declaración global para Freighter
declare global {
  interface Window {
    freighterApi?: any;
  } 
}

// Interfaces unificadas para evitar conflictos
interface AppLoan {
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

interface Notification {
  id: string;
  type: "warning" | "info" | "success" | "error";
  title: string;
  message: string;
  date: Date;
  read: boolean;
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

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  studentId: string;
  career: string;
  role: "student" | "admin" | "manager";
  branch: string;
}

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
}

// Props interfaces actualizadas
interface DashboardProps {
  user: { 
    username: string; 
    password: string; 
    wallet: any;
  };
  logout: () => void;
  loans: AppLoan[];
  onSectionChange: (section: string) => void;
  onRefreshData?: () => Promise<void>;
  loading?: boolean;
}

interface RequestLoanProps {
  onNewLoan: (loanData: any) => void;
  loading?: boolean;
}

interface MyLoansProps {
  loans: AppLoan[];
  onPay: (loanId: string) => void;
  onApprove: (loanId: string) => void;
  loading?: boolean;
}

interface ProfileProps {
  username: string;
  wallet: any;
  name?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  career?: string;
  status?: string;
  onUpdate?: (updatedProfile: any) => void;
  loading?: boolean;
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [wallet, setWallet] = useState<any>(null);
  const [section, setSection] = useState("home");
  const [loans, setLoans] = useState<AppLoan[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "",
    email: "",
    phone: "",
    studentId: "",
    career: "",
    role: "student",
    branch: "Sucursal Central"
  });

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  const [branches, setBranches] = useState<Branch[]>([
    {
      id: "1",
      name: "Sucursal Central",
      address: "Av. Universidad 123, Tlaxiaco",
      phone: "+52 953 123 4567",
      manager: "Admin Principal"
    },
    {
      id: "2",
      name: "Sucursal Norte", 
      address: "Calle Norte 456, Tlaxiaco",
      phone: "+52 953 987 6543",
      manager: "Gerente Norte"
    }
  ]);

  // Cargar datos desde Testnet cuando el usuario se loggea
  useEffect(() => {
    if (loggedIn && wallet) {
      loadDataFromTestnet();
    }
  }, [loggedIn, wallet]);

  const loadDataFromTestnet = async () => {
    if (!wallet) return;
    
    setLoading(true);
    try {
      console.log('📥 Cargando datos desde Testnet...');
      
      // Cargar perfil del usuario
      const profile = await testnetStorage.getUser(wallet.publicKey, username);
      if (profile) {
        setUserData(profile);
        // Actualizar userProfile con datos de Testnet
        setUserProfile(prev => ({
          ...prev,
          fullName: `${profile.name || ''} ${profile.lastname || ''}`.trim() || username,
          email: profile.email || '',
          phone: profile.phone || '',
          career: profile.career || ''
        }));
      }

      // Cargar préstamos desde Testnet
      const testnetLoans = await testnetStorage.getUserLoans(wallet.publicKey);
      const formattedLoans: AppLoan[] = testnetLoans.map(loan => ({
        id: loan.id,
        purpose: loan.purpose,
        amount: loan.amount,
        date: new Date(loan.createdAt),
        dueDate: new Date(loan.dueDate),
        interestRate: loan.interestRate,
        status: mapLoanStatus(loan.status),
        paid: loan.status === 'paid',
        remaining: loan.status === 'paid' ? 0 : loan.amount,
        branch: userProfile.branch
      }));
      setLoans(formattedLoans);

      console.log('✅ Datos cargados desde Testnet:', {
        profile: !!profile,
        loans: formattedLoans.length
      });

    } catch (error) {
      console.error('❌ Error cargando datos desde Testnet:', error);
      // En caso de error, cargar datos de ejemplo
      loadSampleData();
    } finally {
      setLoading(false);
    }
  };

  // Mapear estados de préstamo
  const mapLoanStatus = (status: string): "active" | "paid" | "overdue" | "pending" => {
    switch (status) {
      case 'active': return 'active';
      case 'paid': return 'paid';
      case 'defaulted': return 'overdue';
      case 'approved': return 'active';
      default: return 'pending';
    }
  };

  const loadSampleData = () => {
    // Datos de ejemplo para préstamos
    const sampleLoans: AppLoan[] = [
      {
        id: "1",
        purpose: "Libros y Materiales",
        amount: 500,
        date: new Date('2024-01-15'),
        dueDate: new Date('2024-06-15'),
        interestRate: 5,
        status: "active",
        paid: false,
        remaining: 500,
        branch: "Sucursal Central"
      },
      {
        id: "2", 
        purpose: "Matrícula Semestral",
        amount: 1200,
        date: new Date('2024-02-01'),
        dueDate: new Date('2024-07-01'),
        interestRate: 4.5,
        status: "active",
        paid: false,
        remaining: 1200,
        branch: "Sucursal Central"
      }
    ];

    // Transacciones de ejemplo
    const sampleTransactions: Transaction[] = [
      {
        id: "t1",
        type: "loan",
        amount: 500,
        date: new Date('2024-01-15'),
        description: "Préstamo aprobado - Libros y Materiales",
        status: "completed",
        category: "educación"
      },
      {
        id: "t2",
        type: "loan", 
        amount: 1200,
        date: new Date('2024-02-01'),
        description: "Préstamo aprobado - Matrícula Semestral",
        status: "completed",
        category: "matrícula"
      }
    ];

    // Notificaciones de ejemplo
    const sampleNotifications: Notification[] = [
      {
        id: "n1",
        type: "warning",
        title: "Pago Próximo",
        message: "Tu préstamo #001 vence en 3 días",
        date: new Date(),
        read: false
      },
      {
        id: "n2", 
        type: "success",
        title: "Bienvenido a Testnet",
        message: "Tus datos se guardan en Stellar Testnet",
        date: new Date(),
        read: false
      }
    ];

    setLoans(sampleLoans);
    setTransactions(sampleTransactions);
    setNotifications(sampleNotifications);

    // Generar comprobantes basados en préstamos
    const generatedReceipts: Receipt[] = sampleLoans.map(loan => ({
      id: `r${loan.id}`,
      loanId: loan.id,
      amount: loan.amount,
      date: loan.date,
      type: "loan_disbursement",
      description: `Desembolso préstamo - ${loan.purpose}`,
      satCode: "84111506"
    }));
    setReceipts(generatedReceipts);
  };

  const handleLogin = async (user: string, walletObj: any, userProfileData?: UserData) => {
    setUsername(user);
    setWallet(walletObj);
    setLoggedIn(true);
    
    if (userProfileData) {
      setUserData(userProfileData);
      // Actualizar perfil con datos de Testnet
      setUserProfile(prev => ({
        ...prev,
        fullName: `${userProfileData.name || ''} ${userProfileData.lastname || ''}`.trim() || user,
        email: userProfileData.email || '',
        phone: userProfileData.phone || '',
        career: userProfileData.career || ''
      }));
    } else {
      // Actualizar perfil con nombre de usuario si no hay datos de Testnet
      setUserProfile(prev => ({
        ...prev,
        fullName: prev.fullName || user
      }));
    }

    // Agregar notificación de bienvenida
    const welcomeNotification: Notification = {
      id: `n${Date.now()}`,
      type: "success",
      title: "🔗 Conectado a Testnet",
      message: `Bienvenido ${user}! Tus datos se guardan en Stellar Testnet`,
      date: new Date(),
      read: false
    };
    setNotifications(prev => [welcomeNotification, ...prev]);
  };

  const handleNewLoan = async (loanData: any) => {
    if (!wallet) {
      alert('❌ No hay wallet conectada');
      return;
    }

    setLoading(true);
    try {
      // Crear préstamo en Testnet
      const loanId = `loan_${Date.now()}`;
      const testnetLoan: LoanData = {
        id: loanId,
        userId: wallet.publicKey,
        purpose: loanData.purpose || "Préstamo personal",
        amount: loanData.amount || 0,
        interestRate: loanData.interestRate || 5,
        status: 'pending',
        dueDate: new Date(Date.now() + 15552000000).toISOString(), // 6 meses
        createdAt: new Date().toISOString()
      };

      // Guardar en Testnet
      const success = await testnetStorage.saveLoan(wallet.keypair, testnetLoan);
      
      if (!success) {
        throw new Error('No se pudo guardar el préstamo en Testnet');
      }

      // Actualizar estado local
      const newLoan: AppLoan = {
        id: loanId,
        purpose: loanData.purpose || "Préstamo personal",
        amount: loanData.amount || 0,
        date: new Date(),
        dueDate: new Date(Date.now() + 15552000000), // 6 meses después
        interestRate: loanData.interestRate || 5,
        status: "pending",
        paid: false,
        remaining: loanData.amount || 0,
        branch: userProfile.branch
      };

      setLoans(prev => [...prev, newLoan]);
      
      // Agregar transacción
      const newTransaction: Transaction = {
        id: `t${Date.now()}`,
        type: "loan",
        amount: loanData.amount || 0,
        date: new Date(),
        description: `Solicitud de préstamo - ${loanData.purpose || "Préstamo personal"}`,
        status: "pending",
        category: loanData.purpose?.toLowerCase() || "personal"
      };
      setTransactions(prev => [newTransaction, ...prev]);

      // Notificación de solicitud
      const newNotification: Notification = {
        id: `n${Date.now()}`,
        type: "info",
        title: "📝 Solicitud Enviada a Testnet",
        message: `Tu solicitud de $${loanData.amount || 0} está en revisión`,
        date: new Date(),
        read: false
      };
      setNotifications(prev => [newNotification, ...prev]);

      console.log('✅ Préstamo guardado en Testnet:', loanId);

    } catch (error: any) {
      console.error('❌ Error creando préstamo:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveLoan = async (loanId: string) => {
    if (!wallet) {
      alert('❌ No hay wallet conectada');
      return;
    }

    setLoading(true);
    try {
     
      setLoans(prev => 
        prev.map(loan => 
          loan.id === loanId 
            ? { ...loan, status: "active" } 
            : loan
        )
      );

      const loan = loans.find(l => l.id === loanId);
      if (loan) {
        // Actualizar transacción
        setTransactions(prev => 
          prev.map(t => 
            t.description.includes(loanId) 
              ? { ...t, status: "completed" } 
              : t
          )
        );

        // Agregar comprobante
        const newReceipt: Receipt = {
          id: `r${Date.now()}`,
          loanId: loanId,
          amount: loan.amount,
          date: new Date(),
          type: "loan_disbursement",
          description: `Desembolso préstamo - ${loan.purpose}`,
          satCode: "84111506"
        };
        setReceipts(prev => [...prev, newReceipt]);

        // Notificación de aprobación
        const approvalNotification: Notification = {
          id: `n${Date.now()}`,
          type: "success",
          title: "✅ Préstamo Aprobado",
          message: `Tu préstamo de $${loan.amount} fue aprobado`,
          date: new Date(),
          read: false
        };
        setNotifications(prev => [approvalNotification, ...prev]);
      }

    } catch (error: any) {
      console.error('❌ Error aprobando préstamo:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoanPayment = async (loanId: string) => {
    if (!wallet) {
      alert('❌ No hay wallet conectada');
      return;
    }

    setLoading(true);
    try {
      const loan = loans.find(l => l.id === loanId);
      if (!loan) return;

      const paymentAmount = loan.remaining;

      // En una implementación real, aquí actualizarías el préstamo en Testnet
      setLoans(prev => 
        prev.map(loan => 
          loan.id === loanId 
            ? { 
                ...loan, 
                remaining: 0,
                paid: true,
                status: "paid"
              } 
            : loan
        )
      );

      // Agregar transacción de pago
      const paymentTransaction: Transaction = {
        id: `t${Date.now()}`,
        type: "payment",
        amount: paymentAmount,
        date: new Date(),
        description: `Pago completo - Préstamo ${loanId}`,
        status: "completed",
        category: "pago"
      };
      setTransactions(prev => [paymentTransaction, ...prev]);

      // Agregar comprobante de pago
      const paymentReceipt: Receipt = {
        id: `r${Date.now()}`,
        loanId: loanId,
        amount: paymentAmount,
        date: new Date(),
        type: "payment",
        description: `Pago completo - Préstamo ${loanId}`,
        satCode: "84111506"
      };
      setReceipts(prev => [...prev, paymentReceipt]);

      // Notificación de pago exitoso
      const paymentNotification: Notification = {
        id: `n${Date.now()}`,
        type: "success",
        title: "💳 Pago Exitoso",
        message: `Pago de $${paymentAmount} realizado correctamente`,
        date: new Date(),
        read: false
      };
      setNotifications(prev => [paymentNotification, ...prev]);

    } catch (error: any) {
      console.error('❌ Error procesando pago:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleUpdateProfile = async (updatedProfile: any) => {
    if (!wallet) {
      alert('❌ No hay wallet conectada');
      return;
    }

    setLoading(true);
    try {
      // Actualizar en Testnet
      const userData: UserData = {
        username: username,
        password: 'hashed_password', // En producción usar hash real
        name: updatedProfile.name,
        lastname: updatedProfile.lastname,
        email: updatedProfile.email,
        phone: updatedProfile.phone,
        career: updatedProfile.career,
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      const success = await testnetStorage.saveUser(wallet.keypair, userData);
      
      if (success) {
        setUserData(userData);
        setUserProfile(prev => ({
          ...prev,
          fullName: `${updatedProfile.name || ''} ${updatedProfile.lastname || ''}`.trim(),
          email: updatedProfile.email || '',
          phone: updatedProfile.phone || '',
          career: updatedProfile.career || ''
        }));

        // Notificación de perfil actualizado
        const profileNotification: Notification = {
          id: `n${Date.now()}`,
          type: "success",
          title: "👤 Perfil Actualizado en Testnet",
          message: "Tu información fue guardada en la blockchain",
          date: new Date(),
          read: false
        };
        setNotifications(prev => [profileNotification, ...prev]);
      } else {
        throw new Error('No se pudo guardar en Testnet');
      }

    } catch (error: any) {
      console.error('❌ Error actualizando perfil:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBranch = (branchData: any) => {
    const newBranch: Branch = {
      id: Date.now().toString(),
      ...branchData
    };
    setBranches(prev => [...prev, newBranch]);
  };

  const handleUpdateBranch = (branchId: string, updatedData: any) => {
    setBranches(prev =>
      prev.map(branch =>
        branch.id === branchId ? { ...branch, ...updatedData } : branch
      )
    );
  };

  // Funciones para manejar las acciones del sidebar
  const handleSupportClick = () => setSection("support");
  const handleReferralsClick = () => setSection("referrals");
  const handleTransactionsClick = () => setSection("transactions");
  const handleNotificationsClick = () => setSection("notifications");
  const handleCalculatorClick = () => setSection("calculator");
  const handleInvestmentClick = () => setSection("investment");
  const handleReportsClick = () => setSection("reports");
  const handleAccountingClick = () => setSection("accounting");
  const handleSATCatalogClick = () => setSection("sat-catalog");
  const handleBranchesClick = () => setSection("branches");
  const handleUsersClick = () => setSection("users");
  const handleSettingsClick = () => setSection("settings");

  const handleLogoutClick = () => {
    if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      setLoggedIn(false);
      setUsername("");
      setWallet(null);
      setSection("home");
      setLoans([]);
      setReceipts([]);
      setTransactions([]);
      setNotifications([]);
      setUserData(null);
    }
  };

  const handleRefreshData = async () => {
    if (wallet) {
      await loadDataFromTestnet();
      
      const refreshNotification: Notification = {
        id: `n${Date.now()}`,
        type: "info",
        title: "🔄 Datos Actualizados",
        message: "Datos sincronizados desde Testnet",
        date: new Date(),
        read: false
      };
      setNotifications(prev => [refreshNotification, ...prev]);
    }
  };
function App() {
  return (
    <div>
      {/* Tu contenido actual de la app */}
      <TestnetDebugger />
    </div>
  );
}
  // Si no está loggeado, mostrar Login
  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // Renderizar aplicación principal
  return (
    <div className="app">
      {loading && (
        <div className="global-loading">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>🔗 Procesando en Testnet...</p>
          </div>
        </div>
      )}

      {section === "home" ? (
        <Dashboard 
          user={{ 
            username, 
            password: '', 
            wallet 
          }} 
          logout={handleLogoutClick}
          loans={loans}
          onSectionChange={setSection}
          onRefreshData={handleRefreshData}
          loading={loading}
        />
      ) : (
        <div className="main-layout">
          {/* Sidebar de Navegación */}
          <aside className="sidebar">
            <div className="sidebar-header">
              <div className="logo">🚀</div>
              <h2>MiDapp Préstamos</h2>
              <div className="user-welcome">
                <div className="avatar">{username.charAt(0).toUpperCase()}</div>
                <div>
                  <div className="username">Hola, {username}</div>
                  <div className="user-role">
                    {userProfile.role} 
                    <span className="testnet-indicator">🔗 Testnet</span>
                  </div>
                </div>
              </div>
            </div>
            
            <nav className="sidebar-nav">
              {/* Navegación Principal */}
              <div className="nav-section">
                <h3 className="nav-section-title">Operaciones</h3>
                <div className="nav-buttons">
                  <button className={`nav-button ${section === "home" ? "active" : ""}`} onClick={() => setSection("home")}>
                    <span className="nav-icon">📊</span>
                    <span className="nav-label">Dashboard</span>
                  </button>
                  <button className={`nav-button ${section === "request" ? "active" : ""}`} onClick={() => setSection("request")}>
                    <span className="nav-icon">💸</span>
                    <span className="nav-label">Solicitar Préstamo</span>
                  </button>
                  <button className={`nav-button ${section === "loans" ? "active" : ""}`} onClick={() => setSection("loans")}>
                    <span className="nav-icon">📄</span>
                    <span className="nav-label">Mis Préstamos</span>
                  </button>
                  <button className={`nav-button ${section === "receipts" ? "active" : ""}`} onClick={() => setSection("receipts")}>
                    <span className="nav-icon">🧾</span>
                    <span className="nav-label">Comprobantes</span>
                  </button>
                  <button className={`nav-button ${section === "transactions" ? "active" : ""}`} onClick={handleTransactionsClick}>
                    <span className="nav-icon">💳</span>
                    <span className="nav-label">Historial Transacciones</span>
                  </button>
                </div>
              </div>

              {/* Herramientas Financieras */}
              <div className="nav-section">
                <h3 className="nav-section-title">Herramientas</h3>
                <div className="nav-buttons">
                  <button className={`nav-button ${section === "simulator" ? "active" : ""}`} onClick={() => setSection("simulator")}>
                    <span className="nav-icon">📈</span>
                    <span className="nav-label">Simulador Préstamos</span>
                  </button>
                  <button className={`nav-button ${section === "calculator" ? "active" : ""}`} onClick={handleCalculatorClick}>
                    <span className="nav-icon">🧮</span>
                    <span className="nav-label">Calculadora Financiera</span>
                  </button>
                  <button className={`nav-button ${section === "investment" ? "active" : ""}`} onClick={handleInvestmentClick}>
                    <span className="nav-icon">📊</span>
                    <span className="nav-label">Portafolio Inversiones</span>
                  </button>
                </div>
              </div>

              {/* Sistema de Referidos y Soporte */}
              <div className="nav-section">
                <h3 className="nav-section-title">Marketing & Soporte</h3>
                <div className="nav-buttons">
                  <button className={`nav-button ${section === "referrals" ? "active" : ""}`} onClick={handleReferralsClick}>
                    <span className="nav-icon">🎁</span>
                    <span className="nav-label">Programa Referidos</span>
                  </button>
                  <button className={`nav-button ${section === "notifications" ? "active" : ""}`} onClick={handleNotificationsClick}>
                    <span className="nav-icon">🔔</span>
                    <span className="nav-label">Notificaciones</span>
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="notification-badge">{notifications.filter(n => !n.read).length}</span>
                    )}
                  </button>
                  <button className={`nav-button ${section === "support" ? "active" : ""}`} onClick={handleSupportClick}>
                    <span className="nav-icon">💬</span>
                    <span className="nav-label">Soporte 24/7</span>
                  </button>
                </div>
              </div>

              {/* Administración y Contabilidad */}
              <div className="nav-section">
                <h3 className="nav-section-title">Administración</h3>
                <div className="nav-buttons">
                  <button className={`nav-button ${section === "accounting" ? "active" : ""}`} onClick={handleAccountingClick}>
                    <span className="nav-icon">📋</span>
                    <span className="nav-label">Contabilidad</span>
                  </button>
                  <button className={`nav-button ${section === "reports" ? "active" : ""}`} onClick={handleReportsClick}>
                    <span className="nav-icon">📑</span>
                    <span className="nav-label">Reportes</span>
                  </button>
                  <button className={`nav-button ${section === "sat-catalog" ? "active" : ""}`} onClick={handleSATCatalogClick}>
                    <span className="nav-icon">🏷️</span>
                    <span className="nav-label">Catálogo SAT</span>
                  </button>
                </div>
              </div>

              {/* Configuración del Sistema */}
              <div className="nav-section">
                <h3 className="nav-section-title">Sistema</h3>
                <div className="nav-buttons">
                  <button className={`nav-button ${section === "users" ? "active" : ""}`} onClick={handleUsersClick}>
                    <span className="nav-icon">👥</span>
                    <span className="nav-label">Gestión Usuarios</span>
                  </button>
                  <button className={`nav-button ${section === "branches" ? "active" : ""}`} onClick={handleBranchesClick}>
                    <span className="nav-icon">🏢</span>
                    <span className="nav-label">Sucursales</span>
                  </button>
                  <button className={`nav-button ${section === "profile" ? "active" : ""}`} onClick={() => setSection("profile")}>
                    <span className="nav-icon">👤</span>
                    <span className="nav-label">Mi Perfil</span>
                  </button>
                  <button className={`nav-button ${section === "settings" ? "active" : ""}`} onClick={handleSettingsClick}>
                    <span className="nav-icon">⚙️</span>
                    <span className="nav-label">Configuración</span>
                  </button>
                </div>
              </div>

              {/* Cerrar Sesión */}
              <div className="nav-section">
                <div className="nav-buttons">
                  <button className="nav-button logout-button" onClick={handleLogoutClick}>
                    <span className="nav-icon">🚪</span>
                    <span className="nav-label">Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </nav>
            
            <div className="sidebar-footer">
              <div className="wallet-status">
                {wallet ? (
                  <div className="wallet-connected">
                    <span className="status-dot connected">●</span>
                    <div>
                      <div>Wallet Conectada</div>
                      <div className="wallet-address">{wallet.publicKey?.substring(0, 8)}...{wallet.publicKey?.substring(50)}</div>
                    </div>
                  </div>
                ) : (
                  <div className="wallet-disconnected">
                    <span className="status-dot disconnected">●</span>
                    Wallet No Conectada
                  </div>
                )}
              </div>
              <div className="system-info">
                <small>🔗 Stellar Testnet v2.0.0</small>
                <small>© 2025 MiDapp - ITT</small>
              </div>
            </div>
          </aside>

          {/* Contenido Principal */}
          <div className="content">
            <header className="header">
              <div className="header-left">
                <span className="institution-name">
                  INSTITUTO TECNOLÓGICO DE TLAXIACO
                </span>
                <span className="current-section">
                  {section === "home" && "Dashboard Principal"}
                  {section === "request" && "Solicitar Préstamo"}
                  {section === "loans" && "Mis Préstamos"} 
                  {section === "receipts" && "Comprobantes"}
                  {section === "transactions" && "Historial de Transacciones"}
                  {section === "simulator" && "Simulador de Préstamos"}
                  {section === "calculator" && "Calculadora Financiera"}
                  {section === "investment" && "Portafolio de Inversiones"}
                  {section === "referrals" && "Programa de Referidos"}
                  {section === "notifications" && "Notificaciones"}
                  {section === "support" && "Soporte y Ayuda"}
                  {section === "accounting" && "Contabilidad"}
                  {section === "reports" && "Reportes y Análisis"}
                  {section === "sat-catalog" && "Catálogo SAT"}
                  {section === "users" && "Gestión de Usuarios"}
                  {section === "branches" && "Gestión de Sucursales"}
                  {section === "profile" && "Mi Perfil"}
                  {section === "settings" && "Configuración del Sistema"}
                </span>
              </div>
              
              <div className="header-actions">
                <button 
                  className="refresh-btn"
                  onClick={handleRefreshData}
                  disabled={loading}
                  title="Actualizar datos desde Testnet"
                >
                  🔄
                </button>
                <div className="user-info">
                  <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
                  <div className="user-details">
                    <span className="user-name">{username}</span>
                    <span className="user-role">{userProfile.role}</span>
                  </div>
                </div>
                <div className="quick-actions">
                  <button className="action-btn" onClick={() => setSection("notifications")}>
                    <span className="action-icon">🔔</span>
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="notification-indicator"></span>
                    )}
                  </button>
                  <button className="action-btn" onClick={() => setSection("profile")}>
                    <span className="action-icon">👤</span>
                  </button>
                </div>
              </div>
            </header>

            <main className="main-content">
              {/* Renderizar sección actual */}
              {section === "request" && (
                <RequestLoan 
                  onNewLoan={handleNewLoan} 
                  loading={loading} 
                />
              )}
              {section === "loans" && (
                <MyLoans 
                  loans={loans} 
                  onPay={handleLoanPayment} 
                  onApprove={handleApproveLoan} 
                  loading={loading} 
                />
              )}
              {section === "receipts" && <Receipts receipts={receipts} />}
              {section === "transactions" && <TransactionHistory transactions={transactions} />}
              {section === "simulator" && <LoanSimulator />}
              {section === "calculator" && <LoanCalculator />}
              {section === "investment" && <InvestmentPortfolio transactions={transactions} />}
              {section === "referrals" && <ReferralSystem />}
              {section === "notifications" && (
                <Notifications 
                  notifications={notifications} 
                  onMarkAsRead={handleMarkNotificationAsRead} 
                  onClearAll={handleClearAllNotifications} 
                />
              )}
              {section === "support" && <Support />}
              {section === "accounting" && <Accounting transactions={transactions} receipts={receipts} />}
              {section === "reports" && <Reports loans={loans} transactions={transactions} />}
              {section === "sat-catalog" && <SATCatalog />}
              {section === "users" && <UserManagement />}
              {section === "branches" && (
                <BranchManagement 
                  branches={branches} 
                  onAddBranch={handleAddBranch} 
                  onUpdateBranch={handleUpdateBranch} 
                />
              )}
              {section === "profile" && (
                <Profile 
                  username={username} 
                  wallet={wallet} 
                  name={userData?.name || userProfile.fullName.split(' ')[0]} 
                  lastname={userData?.lastname || userProfile.fullName.split(' ').slice(1).join(' ')}
                  email={userData?.email || userProfile.email} 
                  phone={userData?.phone || userProfile.phone} 
                  career={userData?.career || userProfile.career} 
                  onUpdate={handleUpdateProfile} 
                  loading={loading}
                />
              )}
              {section === "settings" && <Settings />}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;