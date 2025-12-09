import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface LoanRequest {
  _id?: string;
  id?: string;
  studentName: string;
  school: string;
  purpose: string;
  amount: string;
  repaymentMonths: string;
  walletAddress: string;
  currentAmount?: string;
  createdAt?: string;
  status?: string;
  creator?: any;
}

const LoanDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loan, setLoan] = useState<LoanRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState('');
  const [fundSuccess, setFundSuccess] = useState(false);

  useEffect(() => {
    if (id) loadLoan(id);
  }, [id]);

  const loadLoan = async (loanId: string) => {
    try {
      setIsLoading(true);

      // 🔴 SIMULACIÓN
      const fakeLoan: LoanRequest = {
        id: loanId,
        studentName: 'Juan Pérez',
        school: 'Universidad Tecnológica',
        purpose: 'Pago de colegiatura',
        amount: '150',
        repaymentMonths: '6',
        walletAddress: 'GBHX2F...KDL93',
        currentAmount: '45',
        status: 'active',
        createdAt: new Date().toISOString()
      };

      setLoan(fakeLoan);
    } catch {
      setError('Error al cargar el préstamo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFund = async () => {
    if (!user || !loan || !fundAmount) return;

    try {
      setFundSuccess(true);
      setFundAmount('');
      setTimeout(() => setFundSuccess(false), 4000);
    } catch {
      setError('Error al procesar el financiamiento');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando solicitud...</p>
        </div>
      </div>
    );
  }

  if (error || !loan) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="mb-6 px-4 py-2 text-blue-600 hover:text-blue-800"
          >
            ← Volver
          </button>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error || 'Solicitud no encontrada'}
          </div>
        </div>
      </div>
    );
  }

  const progress =
    (parseFloat(loan.currentAmount || '0') /
      parseFloat(loan.amount || '1')) *
    100;

  return (
    <div className="w-full h-full bg-gray-50 overflow-auto">
      <div className="w-full px-4 py-8 max-w-6xl mx-auto">

        {fundSuccess && (
          <div className="mb-6 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg">
            ✅ Financiamiento realizado correctamente
          </div>
        )}

        <h1 className="text-4xl font-bold text-blue-800 mb-2">
          Préstamo Estudiantil
        </h1>

        <p className="text-gray-600 mb-6">
          {loan.studentName} — {loan.school}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Información principal */}
          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Motivo del Préstamo</h2>
              <p className="text-gray-700">{loan.purpose}</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Estado del Financiamiento</h2>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-100 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Recaudado</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {loan.currentAmount || '0'} XLM
                  </p>
                </div>

                <div className="bg-indigo-100 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Meta</p>
                  <p className="text-2xl font-bold text-indigo-700">
                    {loan.amount} XLM
                  </p>
                </div>

                <div className="bg-purple-100 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Progreso</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {Math.min(progress, 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-2">Plazo de Pago</h2>
              <p className="text-gray-700">
                {loan.repaymentMonths} meses
              </p>
            </div>

          </div>

          {/* Panel de financiamiento */}
          <div className="lg:col-span-1">

            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold mb-4">Financiar Préstamo</h3>

              <input
                type="number"
                value={fundAmount}
                onChange={e => setFundAmount(e.target.value)}
                placeholder="Cantidad en XLM"
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-blue-500"
              />

              <button
                onClick={handleFund}
                disabled={!fundAmount}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-700"
              >
                Financiar
              </button>

              <div className="bg-gray-100 rounded-lg p-4 mt-4">
                <p className="text-xs">Wallet del Estudiante:</p>
                <p className="text-xs font-mono break-all">
                  {loan.walletAddress}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetail;
