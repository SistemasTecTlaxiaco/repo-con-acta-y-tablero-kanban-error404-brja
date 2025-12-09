import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import { useState, useEffect } from 'react';

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects } = useProjects(); // puedes luego renombrarlo a loans si quieres
  const [featuredLoans, setFeaturedLoans] = useState<any[]>([]);

  useEffect(() => {
    setFeaturedLoans(projects.slice(0, 6));
  }, [projects]);

  const getLoanTypeBadge = (type: string) => {
    const types: { [key: string]: { label: string; emoji: string } } = {
      personal: { label: 'Préstamo Personal', emoji: '👤' },
      business: { label: 'Préstamo Empresarial', emoji: '🏢' },
      education: { label: 'Préstamo Educativo', emoji: '🎓' },
      vehicle: { label: 'Préstamo Vehicular', emoji: '🚗' },
      emergency: { label: 'Préstamo de Emergencia', emoji: '🚑' }
    };
    return types[type] || { label: 'Préstamo General', emoji: '💸' };
  };

  return (
    <div className="w-full h-full bg-slate-50 overflow-auto">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center px-6">

          <span className="inline-block mb-6 px-5 py-2 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
            💳 Plataforma Digital de Préstamos
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
            <span className="text-blue-600">GreenTech</span>{" "}
            <span className="text-indigo-600">Loans</span>
            <div className="text-gray-900 mt-4">
              Financiamiento Rápido, Seguro y Digital
            </div>
          </h1>

          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Solicita, gestiona y recibe préstamos de forma 100% digital.
            Transparencia, seguridad y recompensas con tecnología blockchain.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  📊 Mi Panel
                </button>

                <button
                  onClick={() => navigate('/projects')}
                  className="px-6 py-3 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
                >
                  💰 Ver Préstamos
                </button>

                <button
                  onClick={() => navigate('/wallet')}
                  className="px-6 py-3 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
                >
                  👛 Mi Billetera
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  🔐 Iniciar Sesión
                </button>

                <button
                  onClick={() => navigate('/projects')}
                  className="px-6 py-3 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
                >
                  💳 Solicitar Préstamo
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* PRÉSTAMOS DESTACADOS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            ⭐ Préstamos Disponibles
          </h2>

          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Elige el tipo de financiamiento que mejor se adapte a tus necesidades.
          </p>

          {featuredLoans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredLoans.map((loan) => {
                const progress =
                  (parseFloat(loan.currentAmount || '0') /
                    parseFloat(loan.targetAmount || '1')) * 100;

                const typeBadge = getLoanTypeBadge(loan.category);

                return (
                  <div
                    key={loan._id || loan.id}
                    onClick={() =>
                      navigate(`/project/${loan._id || loan.id}`)
                    }
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden"
                  >
                    <img
                      src={
                        loan.imageUrl ||
                        'https://via.placeholder.com/400x300?text=Prestamo'
                      }
                      className="w-full h-48 object-cover"
                    />

                    <div className="p-5">
                      <span className="inline-block mb-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        {typeBadge.emoji} {typeBadge.label}
                      </span>

                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {loan.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {loan.description}
                      </p>

                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1 text-gray-600">
                          <span>
                            ${parseFloat(loan.currentAmount || 0).toFixed(2)} / ${loan.targetAmount}
                          </span>
                          <span className="font-bold text-blue-600">
                            {Math.min(progress, 100).toFixed(0)}%
                          </span>
                        </div>

                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-700"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                          {(loan.creator?.username || 'U')[0].toUpperCase()}
                        </div>

                        <p className="text-xs text-gray-600">
                          Solicitado por{' '}
                          <span className="font-semibold text-gray-800">
                            {loan.creator?.username || 'Usuario'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600">
              Aún no hay préstamos disponibles
            </div>
          )}
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            ¿Por qué usar LOGITEC Loans?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

            <div className="p-6 bg-white rounded-xl shadow">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-bold text-lg mb-2">Respuesta Rápida</h3>
              <p className="text-gray-600">
                Solicita tu préstamo en minutos desde cualquier lugar.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow">
              <div className="text-3xl mb-3">🔐</div>
              <h3 className="font-bold text-lg mb-2">Seguridad Total</h3>
              <p className="text-gray-600">
                Tecnología blockchain para proteger tus datos y pagos.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="font-bold text-lg mb-2">Crecimiento Financiero</h3>
              <p className="text-gray-600">
                Mejora tu historial crediticio con pagos responsables.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
