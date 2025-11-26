// services/biometricService.ts
import { 
  startRegistration, 
  startAuthentication,
  browserSupportsWebAuthn,
  platformAuthenticatorIsAvailable
} from '@simplewebauthn/browser';

const API_BASE_URL = 'http://localhost:3000/api'; // Ajusta según tu backend

export interface BiometricUser {
  id: string;
  username: string;
  credentialId?: string;
}

export class BiometricService {
  static async isSupported(): Promise<boolean> {
    try {
      return browserSupportsWebAuthn();
    } catch {
      return false;
    }
  }

  static async isPlatformAuthenticatorAvailable(): Promise<boolean> {
    try {
      return platformAuthenticatorIsAvailable();
    } catch {
      return false;
    }
  }

  // Registrar nueva credencial biométrica
  static async registerBiometric(username: string): Promise<boolean> {
    try {
      // 1. Obtener opciones de registro del servidor
      const resp = await fetch(`${API_BASE_URL}/auth/generate-registration-options`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!resp.ok) {
        throw new Error('Error al generar opciones de registro');
      }

      const options = await resp.json();

      // 2. Iniciar registro en el navegador
      const attestation = await startRegistration(options);

      // 3. Verificar registro con el servidor
      const verificationResp = await fetch(`${API_BASE_URL}/auth/verify-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          attestation,
        }),
      });

      if (!verificationResp.ok) {
        throw new Error('Error al verificar registro');
      }

      const verification = await verificationResp.json();
      return verification.verified;
    } catch (error) {
      console.error('Error en registro biométrico:', error);
      throw error;
    }
  }

  // Autenticar con credencial biométrica existente
  static async authenticateBiometric(username: string): Promise<boolean> {
    try {
      // 1. Obtener opciones de autenticación del servidor
      const resp = await fetch(`${API_BASE_URL}/auth/generate-authentication-options`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!resp.ok) {
        throw new Error('Error al generar opciones de autenticación');
      }

      const options = await resp.json();

      // 2. Iniciar autenticación en el navegador
      const assertion = await startAuthentication(options);

      // 3. Verificar autenticación con el servidor
      const verificationResp = await fetch(`${API_BASE_URL}/auth/verify-authentication`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          assertion,
        }),
      });

      if (!verificationResp.ok) {
        throw new Error('Error al verificar autenticación');
      }

      const verification = await verificationResp.json();
      return verification.verified;
    } catch (error) {
      console.error('Error en autenticación biométrica:', error);
      throw error;
    }
  }

  // Verificar si el usuario tiene credenciales registradas
  static async hasBiometricCredentials(username: string): Promise<boolean> {
    try {
      const resp = await fetch(`${API_BASE_URL}/auth/has-credentials?username=${encodeURIComponent(username)}`);
      if (!resp.ok) return false;
      
      const data = await resp.json();
      return data.hasCredentials;
    } catch {
      return false;
    }
  }
}