import type { User } from '../types/auth.types';
import { requestAccess, getAddress } from '@stellar/freighter-api';

export class AuthService {
  async getProfile(): Promise<User> {
    // If we have a stored wallet address, accept it as the profile
    const address = localStorage.getItem('walletAddress');
    if (address) {
      return this.mockUser(address);
    }
    throw new Error('No user profile found');
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    // Simulate an update, return the provided data as a User
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    }
    throw new Error('Cannot update profile: No current user found.');
  }

  async linkWallet(walletAddress: string): Promise<User> {
    // Simulate linking
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        walletAddress,
        walletConnected: true
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('walletAddress', walletAddress);
      return updatedUser;
    }
    return this.mockUser(walletAddress);
  }

  async unlinkWallet(): Promise<User> {
    // Simulate unlinking
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser };
      delete updatedUser.walletAddress;
      updatedUser.walletConnected = false;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.removeItem('walletAddress');
      return updatedUser;
    }
    throw new Error('No user to unlink');
  }

  /**
   * Connect to Freighter wallet using the official SDK
   */
  async connectFreighterWallet(): Promise<string> {
    try {
      console.log('[connectFreighterWallet] 🌟 Iniciando conexión con Freighter...');

      const accessResult = await requestAccess();

      if (accessResult.error) {
        throw new Error(`Error de acceso: ${accessResult.error}`);
      }

      const addressResult = await getAddress();

      if (addressResult.error) {
        throw new Error(`Error al obtener dirección: ${addressResult.error}`);
      }

      const stellarAddress = addressResult.address;

      if (!stellarAddress) {
        throw new Error('No se recibió dirección de Freighter');
      }

      localStorage.setItem('walletAddress', stellarAddress);

      // Simulate a user object
      const user: User = this.mockUser(stellarAddress);

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', 'mock-token-for-client-logic');

      return stellarAddress;

    } catch (error) {
      console.error('[connectFreighterWallet] ❌ Error:', error);
      throw error;
    }
  }

  /**
   * Mock saving wallet to backend (now just local)
   */
  async saveWalletToProfile(walletAddress: string): Promise<User> {
    const user = this.mockUser(walletAddress);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('walletAddress', walletAddress);
    return user;
  }

  private mockUser(address: string): User {
    return {
      id: 'wallet-' + address.substring(0, 8),
      name: 'Stellar User',
      email: 'wallet@stellar.org',
      role: 'donor',
      walletAddress: address,
      walletConnected: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // This method is no longer needed as there's no backend API to set headers for
  // private setAuthHeader(token: string | null): void {
  //   // No longer setting axios headers
  // }

  // This method is no longer needed as login is handled purely via wallet connection
  // async signLoginMessage(): Promise<{ signature: string; publicKey: string }> {
  //   if (typeof window === 'undefined' || !window.freighter) {
  //     throw new Error('Freighter no está instalado');
  //   }

  //   const publicKey = await window.freighter.getPublicKey();
  //   if (!publicKey) {
  //     throw new Error('No se pudo obtener la dirección de la wallet');
  //   }

  //   const message = `Login to GreenTech-Hub with address: ${publicKey}`;
  //   const signature = await window.freighter.signMessage(message);

  //   return { signature, publicKey };
  // }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        this.logout();
        return null;
      }
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('walletAddress');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('walletAddress');
  }
}

export const authService = new AuthService();
export default authService;
