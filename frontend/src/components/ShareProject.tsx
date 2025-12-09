import { useState } from 'react';

interface ShareProjectProps {
  projectId: string;
  projectTitle: string;
  projectDescription: string;
}

export const ShareProject = ({ 
  projectId, 
  projectTitle, 
  projectDescription
}: ShareProjectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const baseUrl = window.location.origin;
  const projectUrl = `${baseUrl}/project/${projectId}`;
  
  const shareText = `¡Mira esta solicitud de préstamo en LogiTec!\n\n${projectTitle}\n\n${projectDescription}\n\n¡Apoya a un estudiante a cumplir sus metas académicas!`;
  const shortShareText = `${projectTitle} - Solicitud de préstamo en LogiTec\n${projectUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(projectUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    const message = encodeURIComponent(shortShareText);
    window.open(
      `https://wa.me/?text=${message}`,
      '_blank',
      'width=500,height=600'
    );
  };

  const shareToFacebook = () => {
    const message = encodeURIComponent(shareText);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(projectUrl)}&quote=${message}`,
      '_blank',
      'width=600,height=600'
    );
  };

  const shareToTwitter = () => {
    const message = encodeURIComponent(
      `${projectTitle} - Apoya esta solicitud de préstamo en LogiTec\n${projectUrl}`
    );
    window.open(
      `https://twitter.com/intent/tweet?text=${message}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const shareToLinkedin = () => {
    const message = encodeURIComponent(shareText);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(projectUrl)}&title=${encodeURIComponent(projectTitle)}&summary=${message}`,
      '_blank',
      'width=600,height=600'
    );
  };

  const shareToTelegram = () => {
    const message = encodeURIComponent(shortShareText);
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(projectUrl)}&text=${message}`,
      '_blank',
      'width=500,height=600'
    );
  };

  const shareToEmail = () => {
    const subject = encodeURIComponent(`Solicitud de préstamo en LogiTec: ${projectTitle}`);
    const body = encodeURIComponent(
      `${shareText}\n\nVer solicitud completa: ${projectUrl}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="relative">
      {/* BOTÓN PRINCIPAL */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors gap-2"
      >
        <span>📤</span>
        Compartir Préstamo
      </button>

      {/* MODAL */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-xl z-50 p-5 min-w-80 border border-gray-200">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Compartir Solicitud
            </h3>

            {/* BOTONES SOCIALES */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={shareToWhatsApp}
                className="flex items-center justify-center gap-2 p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-medium transition"
              >
                💬 WhatsApp
              </button>

              <button
                onClick={shareToFacebook}
                className="flex items-center justify-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition"
              >
                f Facebook
              </button>

              <button
                onClick={shareToTwitter}
                className="flex items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition"
              >
                𝕏 Twitter
              </button>

              <button
                onClick={shareToLinkedin}
                className="flex items-center justify-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium transition"
              >
                in LinkedIn
              </button>

              <button
                onClick={shareToTelegram}
                className="flex items-center justify-center gap-2 p-3 bg-cyan-50 hover:bg-cyan-100 text-cyan-600 rounded-lg font-medium transition"
              >
                ✈️ Telegram
              </button>

              <button
                onClick={shareToEmail}
                className="flex items-center justify-center gap-2 p-3 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg font-medium transition"
              >
                ✉️ Email
              </button>
            </div>

            {/* DIVISOR */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* COPIAR LINK */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-600">Copiar enlace</p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={projectUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700 truncate"
                />

                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    copied
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {copied ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>
            </div>

            {/* CERRAR */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-4 px-3 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* FONDO */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ShareProject;
