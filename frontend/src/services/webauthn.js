// server/webauthn.js
const { 
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse 
} = require('@simplewebauthn/server');
const { isoBase64URL, isoUint8Array } = require('@simplewebauthn/server/helpers');

// Simulación de base de datos (en producción usa una DB real)
const users = new Map();
const credentials = new Map();

class WebAuthnService {
  static async generateRegistrationOptions(username) {
    const user = users.get(username) || {
      id: isoUint8Array.fromUTF8String(username),
      username,
      credentials: []
    };

    const options = await generateRegistrationOptions({
      rpName: 'Stellar DApp',
      rpID: process.env.RP_ID || 'localhost',
      userID: user.id,
      userName: user.username,
      timeout: 60000,
      attestationType: 'none',
      excludeCredentials: user.credentials.map(cred => ({
        id: cred.credentialID,
        type: 'public-key',
        transports: cred.transports,
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
        authenticatorAttachment: 'platform', // Para huellas en el mismo dispositivo
      },
      supportedAlgorithmIDs: [-7, -257], // ES256 y RS256
    });

    // Guardar challenge temporal
    users.set(username, {
      ...user,
      currentChallenge: options.challenge
    });

    return options;
  }

  static async verifyRegistration(username, attestationResponse) {
    const user = users.get(username);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const verification = await verifyRegistrationResponse({
      response: attestationResponse,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: process.env.ORIGIN || 'http://localhost:3000',
      expectedRPID: process.env.RP_ID || 'localhost',
    });

    if (verification.verified && verification.registrationInfo) {
      const { credential, credentialID, credentialPublicKey, counter } = verification.registrationInfo;

      // Guardar nueva credencial
      const newCredential = {
        credentialID: isoBase64URL.fromBuffer(credentialID),
        credentialPublicKey: isoBase64URL.fromBuffer(credentialPublicKey),
        counter,
        transports: attestationResponse.response.transports,
      };

      user.credentials.push(newCredential);
      users.set(username, user);

      // Limpiar challenge
      delete user.currentChallenge;
    }

    return { verified: verification.verified };
  }

  static async generateAuthenticationOptions(username) {
    const user = users.get(username);
    if (!user || user.credentials.length === 0) {
      throw new Error('Usuario no tiene credenciales registradas');
    }

    const options = await generateAuthenticationOptions({
      timeout: 60000,
      allowCredentials: user.credentials.map(cred => ({
        id: cred.credentialID,
        type: 'public-key',
        transports: cred.transports,
      })),
      userVerification: 'preferred',
      rpID: process.env.RP_ID || 'localhost',
    });

    // Guardar challenge temporal
    user.currentChallenge = options.challenge;
    users.set(username, user);

    return options;
  }

  static async verifyAuthentication(username, authenticationResponse) {
    const user = users.get(username);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const credential = user.credentials.find(
      cred => cred.credentialID === authenticationResponse.id
    );

    if (!credential) {
      throw new Error('Credencial no encontrada');
    }

    const verification = await verifyAuthenticationResponse({
      response: authenticationResponse,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: process.env.ORIGIN || 'http://localhost:3000',
      expectedRPID: process.env.RP_ID || 'localhost',
      credential: {
        id: credential.credentialID,
        publicKey: isoBase64URL.toBuffer(credential.credentialPublicKey),
        counter: credential.counter,
        transports: credential.transports,
      },
    });

    if (verification.verified) {
      // Actualizar counter
      credential.counter = verification.authenticationInfo.newCounter;
      
      // Limpiar challenge
      delete user.currentChallenge;
    }

    return { verified: verification.verified };
  }

  static hasCredentials(username) {
    const user = users.get(username);
    return { hasCredentials: !!(user && user.credentials.length > 0) };
  }
}

module.exports = WebAuthnService;