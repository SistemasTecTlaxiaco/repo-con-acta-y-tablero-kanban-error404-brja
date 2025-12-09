// src/services/testnetUserService.ts

export interface UserData {
  username: string;
  password: string; // En un caso real, esto debería ser hash
  name?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  career?: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

export class TestnetUserService {
  private readonly USER_PREFIX = 'user_profile';
  
  // Simulación de almacenamiento - reemplaza con Stellar SDK real cuando lo configures
  private storage: Map<string, string> = new Map();

  // Guardar usuario en Testnet (simulado)
  async saveUserToTestnet(userKeypair: any, userData: UserData): Promise<boolean> {
    try {
      console.log('💾 Guardando usuario en Testnet (simulado):', userData.username);
      
      // Simular el proceso de guardado en blockchain
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const key = `${this.USER_PREFIX}_${userData.username}`;
      const value = JSON.stringify(userData);
      this.storage.set(key, value);
      
      console.log('✅ Usuario guardado exitosamente:', userData.username);
      return true;
    } catch (error) {
      console.error('❌ Error guardando usuario en Testnet:', error);
      return false;
    }
  }

  // Obtener usuario desde Testnet (simulado)
  async getUserFromTestnet(publicKey: string, username: string): Promise<UserData | null> {
    try {
      console.log('🔍 Buscando usuario en Testnet:', username);
      
      // Simular tiempo de búsqueda
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const key = `${this.USER_PREFIX}_${username}`;
      const value = this.storage.get(key);
      
      if (value) {
        const userData = JSON.parse(value);
        console.log('✅ Usuario encontrado:', username);
        return userData;
      }
      
      console.log('❌ Usuario no encontrado:', username);
      return null;
    } catch (error) {
      console.error('❌ Error obteniendo usuario:', error);
      return null;
    }
  }

  // Verificar si usuario existe
  async userExists(publicKey: string, username: string): Promise<boolean> {
    const user = await this.getUserFromTestnet(publicKey, username);
    return user !== null;
  }

  // Actualizar usuario existente
  async updateUser(userKeypair: any, userData: UserData): Promise<boolean> {
    try {
      const exists = await this.userExists(userKeypair.publicKey, userData.username);
      if (!exists) {
        console.error('❌ Usuario no existe para actualizar:', userData.username);
        return false;
      }

      return await this.saveUserToTestnet(userKeypair, userData);
    } catch (error) {
      console.error('❌ Error actualizando usuario:', error);
      return false;
    }
  }

  // Obtener todos los usuarios (para administración)
  async getAllUsers(): Promise<UserData[]> {
    try {
      const users: UserData[] = [];
      
      for (const [key, value] of this.storage.entries()) {
        if (key.startsWith(this.USER_PREFIX)) {
          users.push(JSON.parse(value));
        }
      }
      
      return users;
    } catch (error) {
      console.error('❌ Error obteniendo usuarios:', error);
      return [];
    }
  }

  // Eliminar usuario (para testing)
  async deleteUser(username: string): Promise<boolean> {
    try {
      const key = `${this.USER_PREFIX}_${username}`;
      const existed = this.storage.delete(key);
      
      if (existed) {
        console.log('🗑️ Usuario eliminado:', username);
        return true;
      }
      
      console.log('❌ Usuario no encontrado para eliminar:', username);
      return false;
    } catch (error) {
      console.error('❌ Error eliminando usuario:', error);
      return false;
    }
  }

  // Obtener estadísticas
  getStats(): { totalUsers: number; activeUsers: number; inactiveUsers: number } {
    let totalUsers = 0;
    let activeUsers = 0;
    let inactiveUsers = 0;

    for (const value of this.storage.values()) {
      try {
        const userData: UserData = JSON.parse(value);
        totalUsers++;
        if (userData.status === 'active') {
          activeUsers++;
        } else {
          inactiveUsers++;
        }
      } catch (error) {
        console.error('Error procesando usuario:', error);
      }
    }

    return { totalUsers, activeUsers, inactiveUsers };
  }

  // Limpiar almacenamiento (para testing)
  clearStorage(): void {
    this.storage.clear();
    console.log('🧹 Almacenamiento de usuarios limpiado');
  }

  // Generar datos de prueba
  async generateSampleData(): Promise<void> {
    const sampleUsers: UserData[] = [
      {
        username: 'admin',
        password: 'admin123',
        name: 'Administrador',
        lastname: 'Sistema',
        email: 'admin@logintech.com',
        phone: '1234567890',
        career: 'Administración',
        createdAt: new Date().toISOString(),
        status: 'active'
      },
      {
        username: 'juan.perez',
        password: 'password123',
        name: 'Juan',
        lastname: 'Pérez',
        email: 'juan.perez@ittlaxiaco.edu.mx',
        phone: '0987654321',
        career: 'Ingeniería en Sistemas',
        createdAt: new Date().toISOString(),
        status: 'active'
      },
      {
        username: 'maria.garcia',
        password: 'password123',
        name: 'María',
        lastname: 'García',
        email: 'maria.garcia@ittlaxiaco.edu.mx',
        phone: '1122334455',
        career: 'Contaduría',
        createdAt: new Date().toISOString(),
        status: 'active'
      }
    ];

    console.log('📦 Generando datos de prueba...');
    
    for (const user of sampleUsers) {
      const mockKeypair = { publicKey: 'G' + user.username.toUpperCase() };
      await this.saveUserToTestnet(mockKeypair, user);
    }
    
    console.log('✅ Datos de prueba generados exitosamente');
  }

  // Validar credenciales de usuario
  async validateCredentials(username: string, password: string): Promise<{ valid: boolean; user?: UserData }> {
    try {
      // Usar una public key genérica para búsqueda
      const publicKey = 'G' + username.toUpperCase();
      const user = await this.getUserFromTestnet(publicKey, username);
      
      if (user && user.password === password) {
        return { valid: true, user };
      }
      
      return { valid: false };
    } catch (error) {
      console.error('❌ Error validando credenciales:', error);
      return { valid: false };
    }
  }

  // Cambiar estado de usuario
  async changeUserStatus(username: string, status: 'active' | 'inactive'): Promise<boolean> {
    try {
      const publicKey = 'G' + username.toUpperCase();
      const user = await this.getUserFromTestnet(publicKey, username);
      
      if (!user) {
        console.error('❌ Usuario no encontrado:', username);
        return false;
      }

      user.status = status;
      const mockKeypair = { publicKey };
      return await this.updateUser(mockKeypair, user);
    } catch (error) {
      console.error('❌ Error cambiando estado de usuario:', error);
      return false;
    }
  }
}

export const testnetUserService = new TestnetUserService();

// Inicializar con datos de prueba al cargar el servicio
testnetUserService.generateSampleData().catch(console.error);