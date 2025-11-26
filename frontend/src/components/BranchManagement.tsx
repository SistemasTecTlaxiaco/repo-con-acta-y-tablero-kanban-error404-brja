import React, { useState } from 'react';

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
}

interface BranchManagementProps {
  branches: Branch[];
  onAddBranch: (branchData: any) => void;
  onUpdateBranch: (branchId: string, updatedData: any) => void;
}

const BranchManagement: React.FC<BranchManagementProps> = ({ 
  branches, 
  onAddBranch, 
  onUpdateBranch 
}) => {
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [newBranch, setNewBranch] = useState({
    name: '',
    address: '',
    phone: '',
    manager: ''
  });

  const handleAddBranch = () => {
    if (newBranch.name && newBranch.address && newBranch.phone && newBranch.manager) {
      onAddBranch(newBranch);
      setNewBranch({ name: '', address: '', phone: '', manager: '' });
      setShowAddBranch(false);
    }
  };

  const handleUpdateBranch = () => {
    if (editingBranch) {
      onUpdateBranch(editingBranch.id, newBranch);
      setEditingBranch(null);
      setNewBranch({ name: '', address: '', phone: '', manager: '' });
    }
  };

  const startEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setNewBranch({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      manager: branch.manager
    });
  };

  const cancelEdit = () => {
    setEditingBranch(null);
    setNewBranch({ name: '', address: '', phone: '', manager: '' });
  };

  return (
    <div className="branch-management">
      <div className="section-header">
        <h1>Gestión de Sucursales</h1>
        <p>Administra las sucursales del sistema</p>
        <button 
          className="btn-primary"
          onClick={() => setShowAddBranch(true)}
        >
          🏢 Agregar Sucursal
        </button>
      </div>

      {(showAddBranch || editingBranch) && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{editingBranch ? 'Editar Sucursal' : 'Agregar Nueva Sucursal'}</h2>
            
            <div className="input-group">
              <label>Nombre de la Sucursal</label>
              <input
                type="text"
                value={newBranch.name}
                onChange={(e) => setNewBranch({...newBranch, name: e.target.value})}
                placeholder="Sucursal Central"
              />
            </div>

            <div className="input-group">
              <label>Dirección</label>
              <input
                type="text"
                value={newBranch.address}
                onChange={(e) => setNewBranch({...newBranch, address: e.target.value})}
                placeholder="Av. Universidad 123"
              />
            </div>

            <div className="input-group">
              <label>Teléfono</label>
              <input
                type="text"
                value={newBranch.phone}
                onChange={(e) => setNewBranch({...newBranch, phone: e.target.value})}
                placeholder="+52 953 123 4567"
              />
            </div>

            <div className="input-group">
              <label>Gerente</label>
              <input
                type="text"
                value={newBranch.manager}
                onChange={(e) => setNewBranch({...newBranch, manager: e.target.value})}
                placeholder="Nombre del gerente"
              />
            </div>

            <div className="modal-actions">
              <button 
                className="btn-primary" 
                onClick={editingBranch ? handleUpdateBranch : handleAddBranch}
              >
                {editingBranch ? 'Actualizar' : 'Agregar'} Sucursal
              </button>
              <button className="btn-secondary" onClick={editingBranch ? cancelEdit : () => setShowAddBranch(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="branches-grid">
        {branches.map(branch => (
          <div key={branch.id} className="branch-card">
            <div className="branch-header">
              <div className="branch-icon">🏢</div>
              <h3>{branch.name}</h3>
            </div>

            <div className="branch-details">
              <div className="detail-item">
                <span className="detail-label">📍 Dirección:</span>
                <span className="detail-value">{branch.address}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">📞 Teléfono:</span>
                <span className="detail-value">{branch.phone}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">👨‍💼 Gerente:</span>
                <span className="detail-value">{branch.manager}</span>
              </div>
            </div>

            <div className="branch-stats">
              <div className="stat">
                <span className="stat-number">15</span>
                <span className="stat-label">Préstamos</span>
              </div>
              <div className="stat">
                <span className="stat-number">8</span>
                <span className="stat-label">Activos</span>
              </div>
              <div className="stat">
                <span className="stat-number">$25K</span>
                <span className="stat-label">Total</span>
              </div>
            </div>

            <div className="branch-actions">
              <button 
                className="edit-btn"
                onClick={() => startEdit(branch)}
              >
                ✏️ Editar
              </button>
              <button className="view-btn">
                👁️ Ver Detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      {branches.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏢</div>
          <h3>No hay sucursales registradas</h3>
          <p>Agrega la primera sucursal del sistema</p>
        </div>
      )}
    </div>
  );
};

export default BranchManagement;