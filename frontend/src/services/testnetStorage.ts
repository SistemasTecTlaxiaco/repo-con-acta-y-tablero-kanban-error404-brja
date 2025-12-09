// services/testnetStorage.ts

export interface UserData {
  username: string;
  password: string;
  name?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  career?: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface LoanData {
  id: string;
  userId: string;
  purpose: string;
  amount: number;
  interestRate: number;
  status: 'pending' | 'approved' | 'active' | 'paid' | 'defaulted';
  dueDate: string;
  createdAt: string;
}

export class TestnetStorage {
  private readonly USER_PREFIX = 'user_profile';
  private readonly LOAN_PREFIX = 'user_loan';

  // Simulación de almacenamiento - en producción usarías Stellar SDK real
  private storage: Map<string, string> = new Map();

  // Guardar usuario (simulado)
  async saveUser(userKeypair: any, userData: UserData): Promise<boolean> {
    try {
      const key = `${this.USER_PREFIX}_${userData.username}`;
      const value = JSON.stringify(userData);
      this.storage.set(key, value);
      
      // Simular guardado en Testnet
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ Usuario guardado (simulado):', userData.username);
      return true;
    } catch (error) {
      console.error('❌ Error guardando usuario:', error);
      return false;
    }
  }

  // Obtener usuario (simulado)
  async getUser(publicKey: string, username: string): Promise<UserData | null> {
    try {
      const key = `${this.USER_PREFIX}_${username}`;
      const value = this.storage.get(key);
      
      if (value) {
        return JSON.parse(value);
      }
      return null;
    } catch (error) {
      console.error('❌ Error obteniendo usuario:', error);
      return null;
    }
  }

  // Verificar si usuario existe
  async userExists(publicKey: string, username: string): Promise<boolean> {
    const user = await this.getUser(publicKey, username);
    return user !== null;
  }

  // Guardar préstamo (simulado)
  async saveLoan(userKeypair: any, loanData: LoanData): Promise<boolean> {
    try {
      const key = `${this.LOAN_PREFIX}_${loanData.id}`;
      const value = JSON.stringify(loanData);
      this.storage.set(key, value);
      
      // Simular guardado en Testnet
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ Préstamo guardado (simulado):', loanData.id);
      return true;
    } catch (error) {
      console.error('❌ Error guardando préstamo:', error);
      return false;
    }
  }

  // Obtener todos los préstamos de un usuario (simulado)
  async getUserLoans(publicKey: string): Promise<LoanData[]> {
    try {
      const loans: LoanData[] = [];
      
      for (const [key, value] of this.storage.entries()) {
        if (key.startsWith(`${this.LOAN_PREFIX}_`)) {
          const loanData = JSON.parse(value);
          // Filtrar por usuario si es necesario
          if (loanData.userId === publicKey) {
            loans.push(loanData);
          }
        }
      }

      return loans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('❌ Error obteniendo préstamos:', error);
      return [];
    }
  }

  // Obtener todos los préstamos (sin filtrar por usuario)
  async getAllLoans(): Promise<LoanData[]> {
    try {
      const loans: LoanData[] = [];
      
      for (const [key, value] of this.storage.entries()) {
        if (key.startsWith(`${this.LOAN_PREFIX}_`)) {
          const loanData = JSON.parse(value);
          loans.push(loanData);
        }
      }

      return loans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('❌ Error obteniendo préstamos:', error);
      return [];
    }
  }

  // Actualizar estado de préstamo
  async updateLoanStatus(loanId: string, status: LoanData['status']): Promise<boolean> {
    try {
      const key = `${this.LOAN_PREFIX}_${loanId}`;
      const existing = this.storage.get(key);
      
      if (existing) {
        const loanData: LoanData = JSON.parse(existing);
        loanData.status = status;
        this.storage.set(key, JSON.stringify(loanData));
        console.log('✅ Estado de préstamo actualizado:', loanId, status);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error actualizando préstamo:', error);
      return false;
    }
  }

  // Limpiar almacenamiento (para testing)
  clearStorage(): void {
    this.storage.clear();
    console.log('🧹 Almacenamiento limpiado');
  }

  // Obtener estadísticas
  getStats(): { users: number; loans: number } {
    let users = 0;
    let loans = 0;

    for (const key of this.storage.keys()) {
      if (key.startsWith(this.USER_PREFIX)) users++;
      if (key.startsWith(this.LOAN_PREFIX)) loans++;
    }

    return { users, loans };
  }
}

export const testnetStorage = new TestnetStorage();