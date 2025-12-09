const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sobre Nosotros</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">LogiTec</h2>

        <p className="text-gray-700 mb-4">
          LogiTec es una plataforma financiera descentralizada (DApp) diseñada para facilitar 
          préstamos estudiantiles de forma segura, rápida y transparente. Nuestro objetivo es 
          apoyar a estudiantes que necesitan recursos para útiles, inscripciones, transporte, 
          dispositivos y otros gastos educativos.
        </p>

        <h3 className="text-xl font-semibold mb-3">Nuestra Misión</h3>
        <p className="text-gray-700 mb-4">
          Brindar acceso a financiamiento justo para estudiantes, eliminando intermediarios,
          reduciendo costos y aprovechando la tecnología blockchain para garantizar confianza,
          seguridad y transparencia.
        </p>

        <h3 className="text-xl font-semibold mb-3">Tecnología</h3>
        <p className="text-gray-700 mb-4">
          Utilizamos la blockchain de Stellar y contratos inteligentes con Soroban para gestionar 
          préstamos, pagos y registros de manera automática y segura, permitiendo un control total 
          de cada operación financiera.
        </p>

        <h3 className="text-xl font-semibold mb-3">Nuestro Compromiso</h3>
        <p className="text-gray-700">
          En LogiTec estamos comprometidos con la educación, la inclusión financiera y el desarrollo 
          tecnológico. Trabajamos continuamente para ofrecer una plataforma confiable que ayude a 
          más estudiantes a cumplir sus metas académicas.
        </p>
      </div>
    </div>
  );
};

export default About;
