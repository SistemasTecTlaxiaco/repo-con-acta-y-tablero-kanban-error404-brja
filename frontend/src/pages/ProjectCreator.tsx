import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoanRequestCreator: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    school: '',
    purpose: '',
    amount: '',
    repaymentMonths: '6',
    walletAddress: user?.walletAddress || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ✅ Validar wallet
  if (!user?.walletAddress) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Wallet No Conectada</h2>
          <p className="text-gray-700 mb-6">
            Debes conectar tu wallet para solicitar un préstamo.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Ir al Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!formData.studentName.trim()) throw new Error('Nombre requerido');
      if (!formData.email.trim()) throw new Error('Correo requerido');
      if (!formData.school.trim()) throw new Error('Escuela requerida');
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        throw new Error('Monto inválido');
      }

      // Map loan data to Project structure
      const loanProject = {
        title: `Préstamo: ${formData.studentName}`,
        // Storing structure data in description for now or extended fields if available
        description: `Estudiante: ${formData.studentName} (${formData.email}). Escuela: ${formData.school}. Motivo: ${formData.purpose}. Plazo: ${formData.repaymentMonths} meses.`,
        targetAmount: formData.amount,
        category: 'education',
        environmentalImpact: {
          metric: 'Impacto Social',
          value: '1',
          unit: 'estudiante apoyado'
        },
        imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        milestones: [],
        tokenRewards: '1'
      };

      console.log('Envío de solicitud:', loanProject);

      // Call service
      const { projectService } = await import('../services/project.service');
      await projectService.createProject(loanProject);

      setSuccess(true);

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error(err);
      const errorMsg = err instanceof Error ? err.message : 'Error al solicitar préstamo';
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    // ... (success view remains same)
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-blue-600 mb-2">
            ¡Préstamo Enviado!
          </h2>
          <p className="text-gray-700">Tu solicitud fue enviada correctamente.</p>
          <p className="text-sm text-gray-500 mt-2">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-12">
      <div className="container mx-auto px-4 max-w-2xl">

        <h1 className="text-3xl font-bold text-blue-800 mb-2">
          Solicitar Préstamo Estudiantil
        </h1>

        <p className="text-gray-600 mb-6">
          Wallet:{' '}
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
            {user?.walletAddress ? `${user.walletAddress.slice(0, 8)}...${user.walletAddress.slice(-8)}` : 'No conectada'}
          </span>
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-6">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">

          {/* Nombre del estudiante */}
          <div className="mb-5">
            <label className="block text-blue-800 font-medium mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              className="w-full border border-blue-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Ej: Juan Pérez"
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-blue-800 font-medium mb-2">
              Correo Electrónico *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-blue-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Ej: juan@ejemplo.com"
            />
          </div>

          {/* Escuela */}
          <div className="mb-5">
            <label className="block text-blue-800 font-medium mb-2">
              Institución Educativa *
            </label>
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              className="w-full border border-blue-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Ej: Universidad Nacional"
            />
          </div>

          {/* Motivo */}
          <div className="mb-5">
            <label className="block text-blue-800 font-medium mb-2">
              Concepto / Motivo
            </label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full border border-blue-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Ej: Pago de colegiatura del semestre..."
            ></textarea>
          </div>

          {/* Monto */}
          <div className="mb-5">
            <label className="block text-blue-800 font-medium mb-2">
              Cantidad a Solicitar (XLM) *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full border border-blue-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
              required
              placeholder="100"
            />
          </div>

          {/* Plazo */}
          <div className="mb-6">
            <label className="block text-blue-800 font-medium mb-2">
              Tiempo a Pagar (Meses)
            </label>
            <select
              name="repaymentMonths"
              value={formData.repaymentMonths}
              onChange={handleChange}
              className="w-full border border-blue-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="3">3 meses</option>
              <option value="6">6 meses</option>
              <option value="12">12 meses</option>
              <option value="18">18 meses</option>
              <option value="24">24 meses</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-bold"
            >
              {isSubmitting ? 'Procesando...' : 'Crear Solicitud'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LoanRequestCreator;
