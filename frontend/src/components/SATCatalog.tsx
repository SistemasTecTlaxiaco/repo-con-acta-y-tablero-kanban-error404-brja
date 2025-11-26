import React, { useState } from 'react';

interface SATCode {
  code: string;
  description: string;
  category: string;
}

const SATCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const satCodes: SATCode[] = [
    { code: '84111506', description: 'Servicios de enseñanza escolarizada', category: 'educación' },
    { code: '84111600', description: 'Servicios de enseñanza para adultos', category: 'educación' },
    { code: '84111700', description: 'Servicios de enseñanza especializada', category: 'educación' },
    { code: '84111800', description: 'Servicios de apoyo a la enseñanza', category: 'educación' },
    { code: '43201800', description: 'Equipo de computo', category: 'tecnología' },
    { code: '43211500', description: 'Equipo periférico de computo', category: 'tecnología' },
    { code: '60121100', description: 'Servicios de préstamos personales', category: 'financieros' },
    { code: '60121200', description: 'Servicios de préstamos estudiantiles', category: 'financieros' },
    { code: '60121300', description: 'Servicios de préstamos hipotecarios', category: 'financieros' },
    { code: '82111500', description: 'Servicios de contabilidad y auditoria', category: 'servicios' },
    { code: '82111600', description: 'Servicios de administración de nómina', category: 'servicios' },
    { code: '82111700', description: 'Servicios de administración de impuestos', category: 'servicios' }
  ];

  const categories = ['all', ...Array.from(new Set(satCodes.map(item => item.category)))];

  const filteredCodes = satCodes.filter(code =>
    (selectedCategory === 'all' || code.category === selectedCategory) &&
    (code.code.includes(searchTerm) || 
     code.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="sat-catalog">
      <div className="section-header">
        <h1>Catálogo SAT</h1>
        <p>Códigos del Sistema de Administración Tributaria para facturación</p>
      </div>

      <div className="catalog-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por código o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="category-filter">
          <label>Filtrar por categoría:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Todas las categorías' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="catalog-grid">
        {filteredCodes.map((item, index) => (
          <div key={index} className="sat-code-card">
            <div className="code-header">
              <span className="sat-code">{item.code}</span>
              <span className="category-badge">{item.category}</span>
            </div>
            <div className="code-description">
              {item.description}
            </div>
            <div className="code-actions">
              <button className="btn-small">📋 Copiar</button>
              <button className="btn-small">⭐ Favorito</button>
            </div>
          </div>
        ))}
      </div>

      {filteredCodes.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏷️</div>
          <h3>No se encontraron códigos</h3>
          <p>Intenta con otros términos de búsqueda</p>
        </div>
      )}

      <div className="catalog-info">
        <h3>💡 Información sobre códigos SAT</h3>
        <p>
          Los códigos del SAT son utilizados para identificar productos y servicios 
          en comprobantes fiscales digitales (CFDI). Asegúrate de seleccionar el código 
          correcto para tu actividad.
        </p>
      </div>
    </div>
  );
};

export default SATCatalog;