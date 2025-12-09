import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useDonations } from '../hooks/useDonations';
import { DonateModal } from '../components/DonateModal';

const Prestamos: React.FC = () => {
  const navigate = useNavigate();
  const { projects, isLoading: loading, refreshProjects } = useProjects();
  const { makeDonation, isDonating } = useDonations();

  const [selectedPrestamo, setSelectedPrestamo] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPrestamos = useMemo(() => {
    return projects.filter(prestamo =>
      prestamo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  const handleViewDetails = (id: string) => {
    navigate(`/prestamo/${id}`);
  };

  const handlePrestar = (prestamo: any) => {
    setSelectedPrestamo(prestamo);
    setIsModalOpen(true);
  };

  const handleSubmitPrestamo = async (amount: number) => {
    if (!selectedPrestamo) return;

    await makeDonation(
      selectedPrestamo._id || selectedPrestamo.id,
      amount.toString(),
      selectedPrestamo.walletAddress
    );

    await refreshProjects();
    setIsModalOpen(false);
    setSelectedPrestamo(null);
  };

  const PrestamoCard = ({ prestamo }: { prestamo: any }) => {
    const progress = parseFloat(prestamo.progress) || 0;

    return (
      <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col">

        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
          {prestamo.category || 'Microcrédito'}
        </span>

        <h3 className="text-lg font-bold text-gray-800 mb-2">
          {prestamo.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 flex-1">
          {prestamo.description}
        </p>

        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-semibold text-gray-700">
              {prestamo.currentAmount || 0} / {prestamo.targetAmount} XLM
            </span>
            <span className="text-sm font-bold text-blue-600">
              {progress.toFixed(0)}%
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-full transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handlePrestar(prestamo)}
            disabled={isDonating}
            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition font-medium"
          >
            💰 Prestar
          </button>

          <button
            onClick={() => handleViewDetails(prestamo._id || prestamo.id)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-md transition font-medium"
          >
            📄 Detalles
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-12">
      <div className="container mx-auto px-4">

        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-blue-800">
              Préstamos Disponibles
            </h1>
            <p className="text-gray-600">
              Apoya personas y emprendedores con financiamiento
            </p>
          </div>

          <button
            onClick={() => navigate('/create-prestamo')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            + Crear Préstamo
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar préstamos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border mb-8"
        />

        {loading ? (
          <div className="text-center py-20">Cargando...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredPrestamos.map(prestamo => (
              <PrestamoCard key={prestamo._id || prestamo.id} prestamo={prestamo} />
            ))}
          </div>
        )}
      </div>

      <DonateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedPrestamo}
        onDonate={handleSubmitPrestamo}
      />
    </div>
  );
};

export default Prestamos;
