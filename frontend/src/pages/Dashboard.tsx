import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import { useDonationsByRole } from '../hooks/useDonationsByRole';
import { useWalletBalance } from '../hooks/useWalletBalance';
import { WalletConnect } from '../components/WalletConnect';
import { ProjectCard } from '../components/ProjectCard';
import { DonationList } from '../components/DonationList';

const DonorDashboard = () => {
  const { projects, isLoading: projectsLoading, error: projectsError } = useProjects();
  const { made, totalMade, isLoading: donationsLoading, error: donationsError } = useDonationsByRole();
  const { balance, isLoading: balanceLoading } = useWalletBalance();

  return (
    <div className="space-y-8">

      {/* WALLET */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 border-2 border-blue-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">💳 Conecta tu Wallet para Pagos</h2>
        <WalletConnect />
      </section>

      {/* BALANCE */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Saldo Disponible</h2>
        <div className="flex items-baseline space-x-2">
          {balanceLoading ? (
            <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>
          ) : (
            <span className="text-3xl font-bold text-gray-900">{balance || '0'}</span>
          )}
          <span className="text-gray-600">XLM</span>
        </div>
      </section>

      {/* ESTADÍSTICAS DE PAGOS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Total Pagado</h3>
          <p className="mt-2 text-3xl font-semibold text-blue-600">
            {totalMade.toFixed(2)} XLM
          </p>
          <p className="mt-1 text-xs text-gray-500">{made.length} pagos realizados</p>
        </div>

        <div className="bg-indigo-50 rounded-lg shadow p-6 border-l-4 border-indigo-500">
          <h3 className="text-sm font-medium text-gray-500">Promedio por Pago</h3>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">
            {made.length > 0 ? (totalMade / made.length).toFixed(2) : '0.00'} XLM
          </p>
          <p className="mt-1 text-xs text-gray-500">Por transacción</p>
        </div>
      </section>

      {/* PRÉSTAMOS DISPONIBLES */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Préstamos Disponibles</h2>
        {projectsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Cargando préstamos...</p>
          </div>
        ) : projectsError ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
            <p>No se pudieron cargar los préstamos. {projectsError}</p>
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} compact />
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
            <p>No hay solicitudes de préstamo disponibles.</p>
          </div>
        )}
      </section>

      {/* HISTORIAL DE PAGOS */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mis Pagos Realizados</h2>
        {donationsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Cargando tus pagos...</p>
          </div>
        ) : donationsError ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
            <p>No se pudieron cargar los pagos. {donationsError}</p>
          </div>
        ) : made && made.length > 0 ? (
          <DonationList donations={made} type="made" compact />
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
            <p>Aún no has realizado pagos.</p>
          </div>
        )}
      </section>
    </div>
  );
};

const CreatorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Hook for navigation
  const { projects, isLoading: projectsLoading, error: projectsError } = useProjects();
  const { received, totalReceived, isLoading: donationsLoading, error: donationsError } = useDonationsByRole();
  const myProjects = user ? projects.filter(p => p.creatorId === user.id) : [];

  return (
    <div className="space-y-8">

      {/* WALLET */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 border-2 border-blue-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">💳 Wallet de Cobros</h2>
        <WalletConnect />
      </section>

      {/* ESTADÍSTICAS DE PRÉSTAMOS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Préstamos Activos</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {myProjects.filter(p => p.status === 'active').length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Monto Total Prestado</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {myProjects.reduce((sum, p) => sum + (p.raisedAmount || 0), 0)} XLM
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Préstamos Finalizados</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {myProjects.filter(p => p.status === 'completed').length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Pagos Recibidos</h3>
          <p className="mt-2 text-3xl font-semibold text-blue-600">
            {received ? received.length : 0}
          </p>
        </div>
      </section>

      {/* INGRESOS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-indigo-50 rounded-lg shadow p-6 border-l-4 border-indigo-500">
          <h3 className="text-sm font-medium text-gray-500">Ingresos Totales</h3>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">
            {totalReceived.toFixed(2)} XLM
          </p>
          <p className="mt-1 text-xs text-gray-500">Pagos de estudiantes</p>
        </div>

        <div className="bg-blue-50 rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Promedio por Pago</h3>
          <p className="mt-2 text-3xl font-semibold text-blue-600">
            {received && received.length > 0 ? (totalReceived / received.length).toFixed(2) : '0.00'} XLM
          </p>
        </div>
      </section>

      {/* MIS PRÉSTAMOS */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Mis Préstamos</h2>
          <button
            onClick={() => navigate('/create-prestamo')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear Solicitud
          </button>
        </div>

        {projectsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Cargando solicitudes...</p>
          </div>
        ) : projectsError ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
            <p>No se pudieron cargar. {projectsError}</p>
          </div>
        ) : myProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
            <p>No tienes solicitudes aún.</p>
          </div>
        )}
      </section>

      {/* PAGOS RECIBIDOS */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Pagos Recibidos</h2>
        {donationsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Cargando pagos...</p>
          </div>
        ) : donationsError ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
            <p>Error al cargar los pagos. {donationsError}</p>
          </div>
        ) : received && received.length > 0 ? (
          <DonationList donations={received} type="received" compact />
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
            <p>Aún no has recibido pagos.</p>
          </div>
        )}
      </section>
    </div>
  );
};

function Dashboard() {
  const { user } = useAuth();
  const { refreshProjects } = useProjects();

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  if (!user) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        {user.role === 'donor' ? 'Panel del Estudiante' : 'Panel del Prestamista'}
      </h1>

      {user.role === 'donor' ? <DonorDashboard /> : <CreatorDashboard />}
    </div>
  );
}

export default Dashboard;
