// src/components/TestnetDebugger.tsx
import { useState, useEffect } from 'react';
import { useTestnetStorage } from './hooks/useTestnetStorage';
import { testnetStorage } from '../services/dataStorage';

export const TestnetDebugger = () => {
  const [username, setUsername] = useState('demo');
  const [storageStats, setStorageStats] = useState({ profiles: 0, loans: 0 });
  
  // Wallet de prueba - usa una real de Testnet
  const [testWallet] = useState({
    publicKey: 'GDEMO123', // Esta es la que usa tu dataStorage
    secret: 'S...' // Solo para desarrollo
  });

  const {
    profile,
    loans,
    loading,
    error,
    loadUserProfile,
    saveUserProfile,
    loadUserLoans,
    saveLoan
  } = useTestnetStorage(testWallet);

  // Actualizar estadísticas del storage
  const updateStats = () => {
    setStorageStats(testnetStorage.getStats());
  };

  useEffect(() => {
    updateStats();
    // Cargar datos iniciales
    loadUserProfile('demo');
    loadUserLoans();
  }, []);

  const handleSaveTestProfile = async () => {
    const testProfile = {
      username: username,
      name: 'María',
      lastname: 'García',
      email: `${username}@universidad.edu`,
      phone: '555-1234',
      career: 'Medicina',
      status: 'active'
    };

    console.log('💾 Guardando perfil:', testProfile);
    const success = await saveUserProfile(testProfile);
    console.log('✅ Resultado:', success);
    
    if (success) {
      setTimeout(() => {
        loadUserProfile(username);
        updateStats();
      }, 500);
    }
  };

  const handleSaveTestLoan = async () => {
    const testLoan = {
      userId: testWallet.publicKey,
      purpose: 'Equipo de Laboratorio',
      amount: 750,
      interestRate: 4.2,
      status: 'pending' as const,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días
    };

    console.log('💾 Guardando préstamo:', testLoan);
    const success = await saveLoan(testLoan);
    console.log('✅ Resultado:', success);
    
    if (success) {
      setTimeout(() => {
        loadUserLoans();
        updateStats();
      }, 500);
    }
  };

  const handleGenerateSampleData = async () => {
    await testnetStorage.generateSampleData();
    setTimeout(() => {
      loadUserProfile('demo');
      loadUserLoans();
      updateStats();
    }, 1000);
  };

  const handleClearStorage = () => {
    testnetStorage.clearStorage();
    updateStats();
    // Recargar componentes
    setTimeout(() => {
      loadUserProfile('demo');
      loadUserLoans();
    }, 500);
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #28a745', 
      margin: '10px',
      background: '#f8fff9',
      borderRadius: '8px'
    }}>
      <h3>🧪 Testnet Storage Debugger (MEMORIA)</h3>
      
      {/* Estadísticas */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '15px',
        padding: '10px',
        background: '#e9ecef',
        borderRadius: '5px'
      }}>
        <div><strong>📊 Perfiles:</strong> {storageStats.profiles}</div>
        <div><strong>💰 Préstamos:</strong> {storageStats.loans}</div>
        <div><strong>🔑 Wallet:</strong> {testWallet.publicKey}</div>
      </div>

      {/* Controles */}
      <div style={{ marginBottom: '15px' }}>
        <label>
          Username: 
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            style={{ margin: '0 10px', padding: '5px' }}
          />
        </label>
        
        <button onClick={() => loadUserProfile(username)} disabled={loading}>
          🔄 Cargar Perfil
        </button>
        <button onClick={handleSaveTestProfile} disabled={loading}>
          💾 Guardar Perfil
        </button>
        <button onClick={loadUserLoans} disabled={loading}>
          🔄 Cargar Préstamos
        </button>
        <button onClick={handleSaveTestLoan} disabled={loading}>
          💾 Nuevo Préstamo
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <button onClick={handleGenerateSampleData} style={{ background: '#17a2b8' }}>
          📦 Generar Datos Demo
        </button>
        <button onClick={handleClearStorage} style={{ background: '#dc3545', marginLeft: '10px' }}>
          🗑️ Limpiar Storage
        </button>
      </div>

      {loading && <p>⏳ Cargando...</p>}
      {error && <p style={{ color: 'red' }}>❌ Error: {error}</p>}

      {/* Datos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h4>👤 Perfil:</h4>
          <pre style={{ 
            background: '#fff', 
            padding: '10px', 
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '12px',
            minHeight: '200px'
          }}>
            {profile ? JSON.stringify(profile, null, 2) : 'No hay perfil cargado'}
          </pre>
        </div>
        
        <div>
          <h4>📝 Préstamos ({loans.length}):</h4>
          <pre style={{ 
            background: '#fff', 
            padding: '10px', 
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '12px',
            minHeight: '200px'
          }}>
            {loans.length > 0 ? JSON.stringify(loans, null, 2) : 'No hay préstamos'}
          </pre>
        </div>
      </div>

      {/* Información importante */}
      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        background: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '5px'
      }}>
        <h4>⚠️ Importante:</h4>
        <p>Este storage está en <strong>MEMORIA</strong> (Map). Los datos se pierden al recargar la página.</p>
        <p>Para persistencia real en Stellar Testnet, necesitas implementar Data Entries de Stellar.</p>
      </div>
    </div>
  );
};