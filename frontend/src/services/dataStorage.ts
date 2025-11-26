// src/services/dataStorage.ts

export interface UserProfile {
  username: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  career: string;
  status: string;
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
  private readonly DATA_ENTRY_PREFIX = 'user_data';
  
  // Simulación de almacenamiento
  private storage: Map<string, string> = new Map();

  // Guardar perfil de usuario en Testnet (simulado)
  async saveUserProfile(userKeypair: any, profile: UserProfile): Promise<boolean> {
    try {
      console.log('💾 Guardando perfil en Testnet:', profile.username);
      
      // Simular tiempo de guardado
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const key = `${this.DATA_ENTRY_PREFIX}_profile_${profile.username}`;
      const value = JSON.stringify(profile);
      this.storage.set(key, value);
      
      console.log('✅ Perfil guardado en Testnet:', profile.username);
      return true;
    } catch (error) {
      console.error('❌ Error guardando perfil:', error);
      return false;
    }
  }

  // Obtener perfil de usuario desde Testnet (simulado)
  async getUserProfile(publicKey: string, username: string): Promise<UserProfile | null> {
    try {
      console.log('🔍 Buscando perfil en Testnet:', username);
      
      // Simular tiempo de búsqueda
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const key = `${this.DATA_ENTRY_PREFIX}_profile_${username}`;
      const value = this.storage.get(key);
      
      if (value) {
        const profileData = JSON.parse(value);
        console.log('✅ Perfil encontrado:', username);
        return profileData;
      }
      
      console.log('❌ Perfil no encontrado:', username);
      return null;
    } catch (error) {
      console.error('❌ Error obteniendo perfil:', error);
      return null;
    }
  }

  // Guardar préstamo en Testnet (simulado)
  async saveLoan(userKeypair: any, loan: LoanData): Promise<boolean> {
    try {
      console.log('💾 Guardando préstamo en Testnet:', loan.id);
      
      // Simular tiempo de guardado
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const key = `${this.DATA_ENTRY_PREFIX}_loan_${loan.id}`;
      const value = JSON.stringify(loan);
      this.storage.set(key, value);
      
      console.log('✅ Préstamo guardado en Testnet:', loan.id);
      return true;
    } catch (error) {
      console.error('❌ Error guardando préstamo:', error);
      return false;
    }
  }

  // Obtener todos los préstamos de un usuario (simulado)
  async getUserLoans(publicKey: string): Promise<LoanData[]> {
    try {
      console.log('🔍 Buscando préstamos para:', publicKey);
      
      // Simular tiempo de búsqueda
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const loans: LoanData[] = [];
      
      for (const [key, value] of this.storage.entries()) {
        if (key.startsWith(`${this.DATA_ENTRY_PREFIX}_loan_`)) {
          const loanData = JSON.parse(value);
          // Filtrar por usuario
          if (loanData.userId === publicKey) {
            loans.push(loanData);
          }
        }
      }

      const sortedLoans = loans.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      console.log(`✅ Encontrados ${sortedLoans.length} préstamos`);
      return sortedLoans;
    } catch (error) {
      console.error('❌ Error obteniendo préstamos:', error);
      return [];
    }
  }

  // Obtener todos los préstamos (sin filtrar)
  async getAllLoans(): Promise<LoanData[]> {
    try {
      const loans: LoanData[] = [];
      
      for (const [key, value] of this.storage.entries()) {
        if (key.startsWith(`${this.DATA_ENTRY_PREFIX}_loan_`)) {
          loans.push(JSON.parse(value));
        }
      }

      return loans.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('❌ Error obteniendo todos los préstamos:', error);
      return [];
    }
  }

  // Actualizar estado de préstamo
  async updateLoanStatus(loanId: string, status: LoanData['status']): Promise<boolean> {
    try {
      const key = `${this.DATA_ENTRY_PREFIX}_loan_${loanId}`;
      const existing = this.storage.get(key);
      
      if (existing) {
        const loanData: LoanData = JSON.parse(existing);
        loanData.status = status;
        this.storage.set(key, JSON.stringify(loanData));
        console.log('✅ Estado de préstamo actualizado:', loanId, status);
        return true;
      }
      
      console.log('❌ Préstamo no encontrado:', loanId);
      return false;
    } catch (error) {
      console.error('❌ Error actualizando préstamo:', error);
      return false;
    }
  }

  // Eliminar préstamo (para testing)
  async deleteLoan(loanId: string): Promise<boolean> {
    try {
      const key = `${this.DATA_ENTRY_PREFIX}_loan_${loanId}`;
      const existed = this.storage.delete(key);
      
      if (existed) {
        console.log('🗑️ Préstamo eliminado:', loanId);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Error eliminando préstamo:', error);
      return false;
    }
  }

  // Eliminar perfil (para testing)
  async deleteProfile(username: string): Promise<boolean> {
    try {
      const key = `${this.DATA_ENTRY_PREFIX}_profile_${username}`;
      const existed = this.storage.delete(key);
      
      if (existed) {
        console.log('🗑️ Perfil eliminado:', username);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Error eliminando perfil:', error);
      return false;
    }
  }

  // Obtener estadísticas
  getStats(): { profiles: number; loans: number } {
    let profiles = 0;
    let loans = 0;

    for (const key of this.storage.keys()) {
      if (key.startsWith(`${this.DATA_ENTRY_PREFIX}_profile_`)) profiles++;
      if (key.startsWith(`${this.DATA_ENTRY_PREFIX}_loan_`)) loans++;
    }

    return { profiles, loans };
  }

  // Limpiar almacenamiento (para testing)
  clearStorage(): void {
    this.storage.clear();
    console.log('🧹 Almacenamiento limpiado');
  }

  // Generar datos de prueba
  async generateSampleData(): Promise<void> {
    console.log('📦 Generando datos de prueba...');
    
    // Datos de perfil de prueba
    const sampleProfile: UserProfile = {
      username: 'demo',
      name: 'Juan',
      lastname: 'Pérez',
      email: 'juan.perez@ejemplo.com',
      phone: '1234567890',
      career: 'Ingeniería en Sistemas',
      status: 'active'
    };

    // Préstamos de prueba
    const sampleLoans: LoanData[] = [
      {
        id: 'loan_1',
        userId: 'GDEMO123',
        purpose: 'Libros y Materiales',
        amount: 500,
        interestRate: 5,
        status: 'active',
        dueDate: new Date(Date.now() + 1209600000).toISOString(), // 2 semanas
        createdAt: new Date(Date.now() - 86400000).toISOString() // 1 día atrás
      },
      {
        id: 'loan_2',
        userId: 'GDEMO123',
        purpose: 'Matrícula Semestral',
        amount: 1200,
        interestRate: 4.5,
        status: 'pending',
        dueDate: new Date(Date.now() + 2592000000).toISOString(), // 1 mes
        createdAt: new Date().toISOString()
      }
    ];

    // Guardar perfil de prueba
    const mockKeypair = { publicKey: 'GDEMO123' };
    await this.saveUserProfile(mockKeypair, sampleProfile);

    // Guardar préstamos de prueba
    for (const loan of sampleLoans) {
      await this.saveLoan(mockKeypair, loan);
    }

    console.log('✅ Datos de prueba generados exitosamente');
  }
}

export const testnetStorage = new TestnetStorage();

// Inicializar con datos de prueba
testnetStorage.generateSampleData().catch(console.error);