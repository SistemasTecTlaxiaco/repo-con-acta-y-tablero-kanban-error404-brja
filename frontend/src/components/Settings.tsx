import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    institutionName: 'Instituto Tecnológico de Tlaxiaco',
    currency: 'MXN',
    language: 'es',
    timezone: 'America/Mexico_City',
    
    // Loan Settings
    maxLoanAmount: 10000,
    minLoanAmount: 100,
    defaultInterestRate: 5,
    maxLoanTerm: 24,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    loanReminders: true,
    paymentAlerts: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    // Aquí iría la lógica para guardar en backend
    alert('Configuraciones guardadas correctamente');
  };

  return (
    <div className="settings">
      <div className="section-header">
        <h1>Configuración del Sistema</h1>
        <p>Personaliza y configura tu plataforma de préstamos</p>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <button 
            className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            ⚙️ General
          </button>
          <button 
            className={`tab-button ${activeTab === 'loans' ? 'active' : ''}`}
            onClick={() => setActiveTab('loans')}
          >
            💰 Préstamos
          </button>
          <button 
            className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            🔔 Notificaciones
          </button>
          <button 
            className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            🔒 Seguridad
          </button>
          <button 
            className={`tab-button ${activeTab === 'integrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('integrations')}
          >
            🔗 Integraciones
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'general' && (
            <div className="settings-section">
              <h3>Configuración General</h3>
              
              <div className="setting-group">
                <label>Nombre de la Institución</label>
                <input
                  type="text"
                  value={settings.institutionName}
                  onChange={(e) => handleSettingChange('institutionName', e.target.value)}
                />
              </div>

              <div className="setting-group">
                <label>Moneda Principal</label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleSettingChange('currency', e.target.value)}
                >
                  <option value="MXN">Peso Mexicano (MXN)</option>
                  <option value="USD">Dólar Americano (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>

              <div className="setting-group">
                <label>Idioma</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="setting-group">
                <label>Zona Horaria</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                >
                  <option value="America/Mexico_City">Ciudad de México</option>
                  <option value="America/New_York">New York</option>
                  <option value="Europe/London">London</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'loans' && (
            <div className="settings-section">
              <h3>Configuración de Préstamos</h3>
              
              <div className="setting-group">
                <label>Monto Máximo de Préstamo</label>
                <input
                  type="number"
                  value={settings.maxLoanAmount}
                  onChange={(e) => handleSettingChange('maxLoanAmount', Number(e.target.value))}
                />
                <span className="setting-help">Monto máximo que un usuario puede solicitar</span>
              </div>

              <div className="setting-group">
                <label>Monto Mínimo de Préstamo</label>
                <input
                  type="number"
                  value={settings.minLoanAmount}
                  onChange={(e) => handleSettingChange('minLoanAmount', Number(e.target.value))}
                />
              </div>

              <div className="setting-group">
                <label>Tasa de Interés Predeterminada</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.defaultInterestRate}
                  onChange={(e) => handleSettingChange('defaultInterestRate', Number(e.target.value))}
                />
                <span className="setting-help">Tasa de interés anual predeterminada</span>
              </div>

              <div className="setting-group">
                <label>Plazo Máximo (meses)</label>
                <input
                  type="number"
                  value={settings.maxLoanTerm}
                  onChange={(e) => handleSettingChange('maxLoanTerm', Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>Configuración de Notificaciones</h3>
              
              <div className="setting-toggle">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  />
                  Notificaciones por Email
                </label>
              </div>

              <div className="setting-toggle">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                  />
                  Notificaciones Push
                </label>
              </div>

              <div className="setting-toggle">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.loanReminders}
                    onChange={(e) => handleSettingChange('loanReminders', e.target.checked)}
                  />
                  Recordatorios de Préstamos
                </label>
              </div>

              <div className="setting-toggle">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.paymentAlerts}
                    onChange={(e) => handleSettingChange('paymentAlerts', e.target.checked)}
                  />
                  Alertas de Pago
                </label>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h3>Configuración de Seguridad</h3>
              
              <div className="setting-toggle">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                  />
                  Autenticación de Dos Factores
                </label>
              </div>

              <div className="setting-group">
                <label>Tiempo de Espera de Sesión (minutos)</label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', Number(e.target.value))}
                />
              </div>

              <div className="setting-group">
                <label>Caducidad de Contraseña (días)</label>
                <input
                  type="number"
                  value={settings.passwordExpiry}
                  onChange={(e) => handleSettingChange('passwordExpiry', Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="settings-section">
              <h3>Integraciones</h3>
              
              <div className="integration-card">
                <h4>🔗 Stellar Blockchain</h4>
                <p>Integración con la red Stellar para transacciones seguras</p>
                <button className="btn-primary">Configurar</button>
              </div>

              <div className="integration-card">
                <h4>📧 Servicio de Email</h4>
                <p>Configuración del servicio de correo electrónico</p>
                <button className="btn-primary">Configurar</button>
              </div>

              <div className="integration-card">
                <h4>📊 Google Analytics</h4>
                <p>Seguimiento y análisis de métricas de la plataforma</p>
                <button className="btn-primary">Configurar</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn-primary" onClick={saveSettings}>
          💾 Guardar Configuraciones
        </button>
        <button className="btn-secondary">
          🔄 Restablecer Valores
        </button>
      </div>
    </div>
  );
};

export default Settings;