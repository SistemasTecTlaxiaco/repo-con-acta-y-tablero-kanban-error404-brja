// src//components/hooks/useTestnetStorage.ts
import { useState, useEffect } from 'react';
import { testnetStorage, UserProfile, LoanData } from '../../services/dataStorage';

// Interface para wallet simplificada
interface SimpleWallet {
  publicKey: string;
  secret?: string;
}

export const useTestnetStorage = (userWallet?: SimpleWallet) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loans, setLoans] = useState<LoanData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar perfil desde Testnet
  const loadUserProfile = async (username: string) => {
    if (!userWallet?.publicKey) {
      setError('No hay wallet conectada');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const userProfile = await testnetStorage.getUserProfile(userWallet.publicKey, username);
      setProfile(userProfile);
    } catch (error: any) {
      console.error('Error loading profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Guardar perfil en Testnet
  const saveUserProfile = async (profileData: UserProfile): Promise<boolean> => {
    if (!userWallet?.publicKey) {
      setError('No hay wallet conectada');
      return false;
    }
    
    setLoading(true);
    setError(null);
    try {
      const success = await testnetStorage.saveUserProfile(userWallet, profileData);
      if (success) {
        setProfile(profileData);
      }
      return success;
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cargar préstamos desde Testnet
  const loadUserLoans = async () => {
    if (!userWallet?.publicKey) {
      setError('No hay wallet conectada');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const userLoans = await testnetStorage.getUserLoans(userWallet.publicKey);
      setLoans(userLoans);
    } catch (error: any) {
      console.error('Error loading loans:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Guardar préstamo en Testnet
  const saveLoan = async (loanData: Omit<LoanData, 'id' | 'createdAt'>): Promise<boolean> => {
    if (!userWallet?.publicKey) {
      setError('No hay wallet conectada');
      return false;
    }
    
    setLoading(true);
    setError(null);
    try {
      const loan: LoanData = {
        ...loanData,
        id: `loan_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      
      const success = await testnetStorage.saveLoan(userWallet, loan);
      if (success) {
        setLoans(prev => [loan, ...prev]);
      }
      return success;
    } catch (error: any) {
      console.error('Error saving loan:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar estado de préstamo
  const updateLoanStatus = async (loanId: string, status: LoanData['status']): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const success = await testnetStorage.updateLoanStatus(loanId, status);
      if (success) {
        setLoans(prev => 
          prev.map(loan => 
            loan.id === loanId ? { ...loan, status } : loan
          )
        );
      }
      return success;
    } catch (error: any) {
      console.error('Error updating loan:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar préstamo
  const deleteLoan = async (loanId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const success = await testnetStorage.deleteLoan(loanId);
      if (success) {
        setLoans(prev => prev.filter(loan => loan.id !== loanId));
      }
      return success;
    } catch (error: any) {
      console.error('Error deleting loan:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Limpiar error
  const clearError = () => setError(null);

  // Cargar datos automáticamente cuando cambie la wallet
  useEffect(() => {
    if (userWallet?.publicKey && profile?.username) {
      loadUserProfile(profile.username);
      loadUserLoans();
    }
  }, [userWallet?.publicKey]);

  // Cargar datos de prueba al montar el hook
  useEffect(() => {
    if (!userWallet && loans.length === 0) {
      // Cargar datos de prueba si no hay wallet conectada
      const loadSampleData = async () => {
        const sampleLoans = await testnetStorage.getAllLoans();
        if (sampleLoans.length > 0) {
          setLoans(sampleLoans);
        }
      };
      loadSampleData();
    }
  }, []);

  return {
    // Estado
    profile,
    loans,
    loading,
    error,
    
    // Acciones de perfil
    loadUserProfile,
    saveUserProfile,
    
    // Acciones de préstamos
    loadUserLoans,
    saveLoan,
    updateLoanStatus,
    deleteLoan,
    
    // Utilidades
    clearError,
    
    // Información
    hasWallet: !!userWallet?.publicKey,
    walletPublicKey: userWallet?.publicKey,
  };
};