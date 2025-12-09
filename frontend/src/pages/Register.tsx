import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { connectFreighter, isLoading, error } = useAuth(); // Usamos connectFreighter directamente

  const handleConnect = async () => {
    try {
      await connectFreighter();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-12 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-blue-800 mb-4">
            Bienvenido a Logitec
          </h1>

          <p className="text-gray-600 mb-8">
            Ya no utilizamos registro por correo. Para usar la plataforma descentralizada,
            simplemente conecta tu billetera de Stellar (Freighter).
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-bold disabled:opacity-50"
          >
            {isLoading ? 'Conectando...' : 'Conectar Billetera Freighter'}
          </button>

          <p className="mt-6 text-sm text-gray-500">
            ¿No tienes billetera? <a href="https://www.freighter.app/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Descarga Freighter aquí</a>
          </p>

          <p className="mt-4 text-sm text-gray-500">
            <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline">Volver al inicio</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
