// server/routes/qrAuth.js
const express = require('express');
const router = express.Router();
const QRAuthService = require('../qrAuth');

// Crear sesión QR
router.post('/qr-session', (req, res) => {
  try {
    const { sessionId, username, type } = req.body;
    const session = QRAuthService.createSession({ sessionId, username, type });
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener estado de sesión
router.get('/qr-session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = QRAuthService.getSession(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Sesión no encontrada' });
    }

    res.json({
      status: session.status,
      wallet: session.wallet
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Aprobar sesión desde móvil
router.post('/qr-session/:sessionId/approve', (req, res) => {
  try {
    const { sessionId } = req.params;
    const { wallet } = req.body;

    const updatedSession = QRAuthService.updateSession(sessionId, {
      status: 'approved',
      wallet
    });

    if (!updatedSession) {
      return res.status(404).json({ error: 'Sesión no encontrada' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;