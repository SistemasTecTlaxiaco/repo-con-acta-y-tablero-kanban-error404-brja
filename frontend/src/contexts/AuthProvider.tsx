import { useState, useEffect } from 'react';
import { AuthContext, type AuthContextProps, type AuthContextType } from './AuthContext';
import { authService } from '../services/auth.service';
import type { User } from '../types/auth.types';

/**
 * =====================================================
 * AUTH PROVIDER - LOGITEC PRÉSTAMOS ESTUDIANTILES
 * Manejo centralizado de sesión, usuario y wallet
 * =====================================================
 */
export function AuthProvider({ children }: AuthContextProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined);

  /**
   * Inicializa la sesión al cargar la aplicación
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const profile = await authService.getProfile();
          setUser(profile);
          setWalletAddress(profile.walletAddress);
        }
      } catch (err) {
        authService.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);



  /**
   * Inicio de sesión tradicional (OBSOLETO)
   */
  const login = async () => {
    setError('Por favor usa "Conectar Billetera" para ingresar.');
  };

  /**
   * Registro de nuevo usuario (OBSOLETO)
   */
  const register = async () => {
    setError('Por favor usa "Conectar Billetera" para registrarte.');
  };

  /**
   * Cierre de sesión
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    setWalletAddress(undefined);
    setError(null);
  };

  /**
   * Login mediante Wallet
   */
  const loginWithWallet = async () => {
    await connectFreighter();
  };

  const linkWallet = async (address: string) => {
    // Mock logic
    setWalletAddress(address);
  };

  const unlinkWallet = async () => {
    setWalletAddress(undefined);
  };

  /**
   * =====================================================
   * CONEXIÓN DE WALLET FREIGHTER (STELLAR)
   * =====================================================
   */
  const connectFreighter = async () => {
    try {
      console.log('[AuthProvider.connectFreighter] Iniciando conexión con Freighter...');
      setIsLoading(true);
      setError(null);

      const publicKey = await authService.connectFreighterWallet();
      console.log('[AuthProvider.connectFreighter] Clave pública obtenida:', publicKey);

      const profile = await authService.getProfile();
      setUser(profile);
      setWalletAddress(publicKey);

      console.log('[AuthProvider.connectFreighter] ✓ Conexión completada correctamente');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al conectar Freighter';
      console.error('[AuthProvider.connectFreighter] ✗ Error:', message);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * =====================================================
   * DATOS EXPUESTOS AL CONTEXTO
   * =====================================================
   */
  const contextValue: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    loginWithWallet,
    linkWallet,
    unlinkWallet,
    connectFreighter,
    isAuthenticated: !!user,
    walletAddress
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
