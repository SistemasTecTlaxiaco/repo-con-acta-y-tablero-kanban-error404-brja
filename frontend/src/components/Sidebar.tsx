import React from 'react';
import './sidebar.css';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  userName?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  onLogout,
  userName = "admin" 
}) => {
  
  const handleNavigation = (section: string) => {
    onSectionChange(section);
  };

  const handleSupport = () => {
    // Aquí puedes integrar con tu servicio de soporte
    window.open('https://wa.me/1234567890', '_blank');
  };

  const handleReferrals = () => {
    onSectionChange('referrals');
  };

  const handleSettings = () => {
    onSectionChange('settings');
  };

  const mainSections = [
    { id: 'dashboard', label: 'Resumen', icon: '📊' },
    { id: 'request-loan', label: 'Solicitar Préstamo', icon: '💰' },
    { id: 'my-loans', label: 'Mis Préstamos', icon: '📑' },
    { id: 'receipts', label: 'Comprobantes', icon: '🧾' },
    { id: 'simulator', label: 'Simulador', icon: '🧮' },
    { id: 'profile', label: 'Mi Perfil', icon: '👤' }
  ];

  const bottomSections = [
    { id: 'referrals', label: '🎁 Programa de Referidos', action: handleReferrals },
    { id: 'support', label: '💬 Soporte 24/7', action: handleSupport },
    { id: 'settings', label: '⚙️ Configuración', action: handleSettings },
    { id: 'logout', label: '❌ Cerrar Sesión', action: onLogout }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>MiDapp Préstamos</h2>
        <div className="user-welcome">
          <span className="welcome-text">👋 Hola, {userName}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">Navegación Principal</h3>
          <ul className="nav-list">
            {mainSections.map((section) => (
              <li key={section.id}>
                <button
                  className={`nav-button ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => handleNavigation(section.id)}
                >
                  <span className="nav-icon">{section.icon}</span>
                  <span className="nav-label">{section.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">Más Opciones</h3>
          <ul className="nav-list">
            {bottomSections.map((section) => (
              <li key={section.id}>
                <button
                  className={`nav-button ${activeSection === section.id ? 'active' : ''}`}
                  onClick={section.action}
                >
                  <span className="nav-label">{section.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="sidebar-footer">
        <p>MiDapp v1.0</p>
        <p className="footer-security">🔒 Conexión Segura</p>
      </div>
    </div>
  );
};

export default Sidebar;