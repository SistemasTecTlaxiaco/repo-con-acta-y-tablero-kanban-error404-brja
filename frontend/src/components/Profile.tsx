import React, { useState, useEffect } from "react";

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

export default function Profile({ 
  username, 
  wallet, 
  name, 
  lastname,
  email, 
  phone, 
  career,
  status,
  onUpdate,
  loading 
}: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: name || '',
    lastname: lastname || '',
    email: email || '',
    phone: phone || '',
    career: career || ''
  });

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedProfile);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({
      name: name || '',
      lastname: lastname || '',
      email: email || '',
      phone: phone || '',
      career: career || ''
    });
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusColor = (status: string = 'active') => {
    switch (status.toLowerCase()) {
      case 'active': return '#00ff88';
      case 'inactive': return '#ff4444';
      case 'pending': return '#ffaa00';
      default: return '#00aaff';
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">Perfil del Usuario</h2>
        <div className="testnet-badge">🔗 Stellar Testnet</div>
        {onUpdate && (
          <button 
            className="button-primary"
            onClick={() => setIsEditing(!isEditing)}
            disabled={loading}
          >
            {loading ? '⏳ Guardando...' : (isEditing ? '❌ Cancelar' : '✏️ Editar Perfil')}
          </button>
        )}
      </div>
      
      <div className="card profile-card">
        {/* Información de Wallet */}
        {wallet && (
          <div className="wallet-info-section">
            <h4>🔗 Información de Wallet</h4>
            <div className="wallet-details">
              <p><strong>Estado:</strong> <span className="status-connected">✅ Conectada</span></p>
              <p><strong>Dirección:</strong> <code>{wallet.publicKey?.substring(0, 20)}...</code></p>
              <p><strong>Red:</strong> Stellar Testnet</p>
            </div>
          </div>
        )}

        {/* Información Básica */}
        <div className="profile-header">
          <div className="profile-avatar">
            {username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="profile-info">
            <h3>
              {isEditing ? (
                <div className="name-inputs">
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Nombre"
                    className="profile-input"
                  />
                  <input
                    type="text"
                    value={editedProfile.lastname}
                    onChange={(e) => handleChange('lastname', e.target.value)}
                    placeholder="Apellidos"
                    className="profile-input"
                  />
                </div>
              ) : (
                `${name || 'Nombre'} ${lastname || ''}`
              )}
            </h3>
            <p>@{username}</p>
            <span 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(status) }}
            >
              {status || 'Activo'}
            </span>
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="profile-section">
          <h4>📧 Información de Contacto</h4>
          <div className="profile-details">
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              {isEditing ? (
                <input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="profile-input"
                />
              ) : (
                <span className="detail-value">{email || 'No especificado'}</span>
              )}
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Teléfono:</span>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedProfile.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="profile-input"
                />
              ) : (
                <span className="detail-value">{phone || 'No especificado'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Información Académica */}
        <div className="profile-section">
          <h4>🎓 Información Académica</h4>
          <div className="profile-details">
            <div className="detail-row">
              <span className="detail-label">Carrera:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.career}
                  onChange={(e) => handleChange('career', e.target.value)}
                  className="profile-input"
                />
              ) : (
                <span className="detail-value">{career || 'No especificada'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Información de Testnet */}
        <div className="profile-section">
          <h4>🔗 Información de Testnet</h4>
          <div className="profile-details">
            <div className="detail-row">
              <span className="detail-label">Plataforma:</span>
              <span className="detail-value">Stellar Testnet</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Datos:</span>
              <span className="detail-value">Guardados en blockchain</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Transparencia:</span>
              <span className="detail-value">✅ Verificable</span>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        {isEditing && onUpdate && (
          <div className="profile-actions">
            <button className="button-primary" onClick={handleSave} disabled={loading}>
              {loading ? '💾 Guardando en Testnet...' : '💾 Guardar Cambios'}
            </button>
            <button className="button-secondary" onClick={handleCancel}>
              ❌ Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Información de la Sesión */}
      <div className="card session-info">
        <h3>📊 Información de la Sesión</h3>
        <div className="session-details">
          <div className="session-item">
            <span className="session-label">Usuario:</span>
            <span className="session-value">{username}</span>
          </div>
          <div className="session-item">
            <span className="session-label">Wallet:</span>
            <span className="session-value">{wallet ? 'Conectada' : 'No conectada'}</span>
          </div>
          <div className="session-item">
            <span className="session-label">Plataforma:</span>
            <span className="session-value">Stellar Testnet</span>
          </div>
          <div className="session-item">
            <span className="session-label">Última actualización:</span>
            <span className="session-value">{new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}