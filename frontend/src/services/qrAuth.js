// server/qrAuth.js
const sessions = new Map();

class QRAuthService {
  static createSession(sessionData) {
    const session = {
      ...sessionData,
      createdAt: Date.now(),
      status: 'pending',
      wallet: null
    };
    
    sessions.set(sessionData.sessionId, session);
    
    // Limpiar sesión después de 5 minutos
    setTimeout(() => {
      const currentSession = sessions.get(sessionData.sessionId);
      if (currentSession && currentSession.status === 'pending') {
        currentSession.status = 'expired';
        sessions.set(sessionData.sessionId, currentSession);
      }
    }, 5 * 60 * 1000);

    return session;
  }

  static getSession(sessionId) {
    return sessions.get(sessionId);
  }

  static updateSession(sessionId, updates) {
    const session = sessions.get(sessionId);
    if (session) {
      const updatedSession = { ...session, ...updates };
      sessions.set(sessionId, updatedSession);
      return updatedSession;
    }
    return null;
  }

  static cleanupExpiredSessions() {
    const now = Date.now();
    for (const [sessionId, session] of sessions.entries()) {
      if (now - session.createdAt > 5 * 60 * 1000) {
        sessions.delete(sessionId);
      }
    }
  }
}

module.exports = QRAuthService;