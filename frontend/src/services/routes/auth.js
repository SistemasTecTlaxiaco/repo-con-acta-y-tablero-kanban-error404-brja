// server/routes/auth.js
const express = require('express');
const router = express.Router();
const WebAuthnService = require('../webauthn');

router.post('/generate-registration-options', async (req, res) => {
  try {
    const { username } = req.body;
    const options = await WebAuthnService.generateRegistrationOptions(username);
    res.json(options);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/verify-registration', async (req, res) => {
  try {
    const { username, attestation } = req.body;
    const result = await WebAuthnService.verifyRegistration(username, attestation);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/generate-authentication-options', async (req, res) => {
  try {
    const { username } = req.body;
    const options = await WebAuthnService.generateAuthenticationOptions(username);
    res.json(options);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/verify-authentication', async (req, res) => {
  try {
    const { username, assertion } = req.body;
    const result = await WebAuthnService.verifyAuthentication(username, assertion);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/has-credentials', (req, res) => {
  try {
    const { username } = req.query;
    const result = WebAuthnService.hasCredentials(username);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;