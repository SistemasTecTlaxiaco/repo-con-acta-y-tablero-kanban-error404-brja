import React, { useState } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'admin' | 'manager';
  status: 'active' | 'inactive';
  joinDate: Date;
  lastLogin: Date;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'admin',
      email: 'admin@ittlaxiaco.edu.mx',
      role: 'admin',
      status: 'active',
      joinDate: new Date('2024-01-01'),
      lastLogin: new Date()
    },
    {
      id: '2',
      username: 'juan.perez',
      email: 'juan.perez@ittlaxiaco.edu.mx',
      role: 'student',
      status: 'active',
      joinDate: new Date('2024-02-15'),
      lastLogin: new Date('2024-03-20')
    },
    {
      id: '3',
      username: 'maria.garcia',
      email: 'maria.garcia@ittlaxiaco.edu.mx',
      role: 'student',
      status: 'active',
      joinDate: new Date('2024-03-01'),
      lastLogin: new Date('2024-03-18')
    }
  ]);

  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'student' as 'student' | 'admin' | 'manager'
  });

  const handleAddUser = () => {
    if (newUser.username && newUser.email) {
      const user: User = {
        id: Date.now().toString(),
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        status: 'active',
        joinDate: new Date(),
        lastLogin: new Date()
      };
      setUsers([...users, user]);
      setNewUser({ username: '', email: '', role: 'student' });
      setShowAddUser(false);
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const deleteUser = (userId: string) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#ff4444';
      case 'manager': return '#ffaa00';
      case 'student': return '#00aaff';
      default: return '#888';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? '#00ff88' : '#ff4444';
  };

  return (
    <div className="user-management">
      <div className="section-header">
        <h1>Gestión de Usuarios</h1>
        <p>Administra los usuarios del sistema</p>
        <button 
          className="btn-primary"
          onClick={() => setShowAddUser(true)}
        >
          👥 Agregar Usuario
        </button>
      </div>

      {showAddUser && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Agregar Nuevo Usuario</h2>
            <div className="input-group">
              <label>Nombre de Usuario</label>
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                placeholder="usuario"
              />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="usuario@ittlaxiaco.edu.mx"
              />
            </div>
            <div className="input-group">
              <label>Rol</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
              >
                <option value="student">Estudiante</option>
                <option value="manager">Gerente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-primary" onClick={handleAddUser}>
                Agregar Usuario
              </button>
              <button className="btn-secondary" onClick={() => setShowAddUser(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-header">
              <div className="user-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <h3>{user.username}</h3>
                <span className="user-email">{user.email}</span>
              </div>
            </div>

            <div className="user-details">
              <div className="user-role" style={{ color: getRoleColor(user.role) }}>
                {user.role}
              </div>
              <div className="user-status" style={{ color: getStatusColor(user.status) }}>
                {user.status}
              </div>
            </div>

            <div className="user-meta">
              <span>Registro: {user.joinDate.toLocaleDateString('es-MX')}</span>
              <span>Último acceso: {user.lastLogin.toLocaleDateString('es-MX')}</span>
            </div>

            <div className="user-actions">
              <button 
                className={`status-btn ${user.status === 'active' ? 'deactivate' : 'activate'}`}
                onClick={() => toggleUserStatus(user.id)}
              >
                {user.status === 'active' ? 'Desactivar' : 'Activar'}
              </button>
              <button 
                className="delete-btn"
                onClick={() => deleteUser(user.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No hay usuarios registrados</h3>
          <p>Agrega el primer usuario del sistema</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;