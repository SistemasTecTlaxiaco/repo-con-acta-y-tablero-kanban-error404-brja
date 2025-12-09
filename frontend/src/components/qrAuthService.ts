// services/qrAuthService.ts
export interface QRCodeData {
  sessionId: string;
  username: string;
  timestamp: number;
  type: 'login' | 'register';
}

export class QRAuthService {
  private static API_BASE = 'http://localhost:3001/api/auth';

  // Generar sesión QR
  static async generateQRSession(username: string, type: 'login' | 'register'): Promise<{ qrData: string; sessionId: string }> {
    const sessionId = this.generateSessionId();
    
    const qrData: QRCodeData = {
      sessionId,
      username,
      timestamp: Date.now(),
      type
    };

    // Guardar sesión en el servidor
    await fetch(`${this.API_BASE}/qr-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        username,
        type,
        status: 'pending',
        expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutos
      })
    });

    return {
      qrData: JSON.stringify(qrData),
      sessionId
    };
  }

  // Verificar estado de la sesión
  static async checkSessionStatus(sessionId: string): Promise<{ status: 'pending' | 'approved' | 'rejected' | 'expired'; wallet?: any }> {
    const response = await fetch(`${this.API_BASE}/qr-session/${sessionId}`);
    
    if (!response.ok) {
      throw new Error('Error al verificar sesión');
    }

    return await response.json();
  }

  // Aprovar sesión desde el móvil
  static async approveSession(sessionId: string, walletData: any): Promise<boolean> {
    const response = await fetch(`${this.API_BASE}/qr-session/${sessionId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet: walletData })
    });

    return response.ok;
  }

  private static generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }
}