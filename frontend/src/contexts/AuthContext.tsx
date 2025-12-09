import { createContext } from 'react';
import type { User, RegisterData } from '../types/auth.types';

/**
 * ===============================
 * CONTEXTO DE AUTENTICACIÓN LOGITEC
 * Plataforma de Préstamos Estudiantiles
 * ===============================
 */
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Autenticación tradicional
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;

  // Autenticación con Wallet (Freighter)
  loginWithWallet: () => Promise<void>;
  linkWallet: (address: string) => Promise<void>;
  unlinkWallet: () => Promise<void>;
  connectFreighter: () => Promise<void>;

  // Estado de sesión
  isAuthenticated: boolean;
  walletAddress?: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

/**
 * ===============================
 * PROPS DEL PROVIDER DE AUTENTICACIÓN
 * ===============================
 */
export interface AuthContextProps {
  children: React.ReactNode;
}
