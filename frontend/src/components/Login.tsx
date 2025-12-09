// Login.tsx - VERSIÓN CON TESTNET REAL
import React, { useState, useEffect } from "react";
import { generateWallet, fundTestnetAccount, getStoredWallet } from './walletLocal';
import { BiometricService } from './BiometricService';
import { testnetStorage, UserData } from '../services/testnetStorage';
import './login.css';

interface LoginProps {
  onLogin: (username: string, wallet: any, userData: UserData) => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<"login" | "register" | null>(null);
    const [authMethod, setAuthMethod] = useState<"biometric" | "password" | null>(null);
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeAuth, setActiveAuth] = useState<"biometric" | "password" | "qr">("password");
    const [isNewUser, setIsNewUser] = useState(false);

    useEffect(() => {
        checkBiometricSupport();
    }, []);

    const checkBiometricSupport = async () => {
        try {
            const supported = await BiometricService.isSupported();
            const platformAvailable = await BiometricService.isPlatformAuthenticatorAvailable();
            setIsBiometricSupported(supported && platformAvailable);
        } catch {
            setIsBiometricSupported(false);
        }
    };

    // Función para registrar nuevo usuario en Testnet
    const registerNewUser = async (username: string, wallet: any): Promise<UserData> => {
        const userData: UserData = {
            username: username,
            password: password,
            name: '',
            lastname: '',
            email: '',
            phone: '',
            career: '',
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        console.log('📝 Registrando nuevo usuario en Testnet...');
        const success = await testnetStorage.saveUser(wallet.keypair, userData);
        
        if (!success) {
            throw new Error('No se pudo guardar el usuario en Testnet');
        }

        console.log('✅ Usuario registrado exitosamente');
        return userData;
    };

    // Función para login de usuario existente
    const loginExistingUser = async (username: string, wallet: any): Promise<UserData> => {
        console.log('🔍 Buscando usuario en Testnet...');
        const userData = await testnetStorage.getUser(wallet.publicKey, username);
        
        if (!userData) {
            throw new Error('Usuario no encontrado en Testnet');
        }

        // Verificar contraseña
        if (userData.password !== password) {
            throw new Error('Contraseña incorrecta');
        }

        console.log('✅ Usuario autenticado exitosamente');
        return userData;
    };

    // Función común para manejar autenticación
    const handleAuth = async (isNewRegistration: boolean = false) => {
        setIsLoading(true);
        setError("");

        try {
            // Verificar que haya wallet
            let wallet = getStoredWallet();
            if (!wallet) {
                console.log('💰 Creando nueva wallet...');
                wallet = generateWallet();
                
                // Fondear la cuenta en Testnet
                console.log('💰 Fondendo cuenta en Testnet...');
                const funded = await fundTestnetAccount(wallet.publicKey);
                if (!funded) {
                    throw new Error('No se pudo fondear la cuenta en Testnet');
                }
            }

            let userData: UserData;

            if (isNewRegistration) {
                // Verificar si el usuario ya existe
                const exists = await testnetStorage.userExists(wallet.publicKey, username);
                if (exists) {
                    throw new Error('El usuario ya existe. Usa inicio de sesión.');
                }
                userData = await registerNewUser(username, wallet);
            } else {
                userData = await loginExistingUser(username, wallet);
            }

            // Llamar callback de login
            onLogin(username, wallet, userData);
            setShowModal(false);
            setError("");

        } catch (error: any) {
            console.error('❌ Error en autenticación:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBiometricLogin = async () => {
        if (!username.trim()) {
            setError("Ingresa tu usuario.");
            return;
        }

        setIsLoading(true);
        setError("");
        
        try {
            const hasCredentials = await BiometricService.hasBiometricCredentials(username);
            
            if (!hasCredentials) {
                setError("No tienes huella registrada. Regístrate primero.");
                setIsLoading(false);
                return;
            }

            setShowModal(true);
            setModalType("login");
            setAuthMethod("biometric");

            const isAuthenticated = await BiometricService.authenticateBiometric(username);
            
            if (isAuthenticated) {
                await handleAuth(false);
            } else {
                setError("Autenticación biométrica fallida.");
            }
        } catch (error: any) {
            setError(`Error en autenticación: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBiometricRegister = async () => {
        if (!username.trim()) {
            setError("Ingresa tu usuario.");
            return;
        }

        setIsLoading(true);
        setError("");
        setShowModal(true);
        setModalType("register");
        setAuthMethod("biometric");

        try {
            const isRegistered = await BiometricService.registerBiometric(username);
            
            if (isRegistered) {
                await handleAuth(true);
            } else {
                setError("Registro biométrico fallido.");
            }
        } catch (error: any) {
            setError(`Error en registro: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordLogin = () => {
        if (!username.trim()) {
            setError("Ingresa tu usuario.");
            return;
        }
        setShowModal(true);
        setModalType("login");
        setAuthMethod("password");
        setIsNewUser(false);
    };

    const handlePasswordRegister = () => {
        if (!username.trim()) {
            setError("Ingresa tu usuario.");
            return;
        }
        setShowModal(true);
        setModalType("register");
        setAuthMethod("password");
        setIsNewUser(true);
    };

    const handlePasswordAuth = async () => {
        if (!password.trim()) {
            setError("Ingresa tu contraseña.");
            return;
        }
        
        await handleAuth(isNewUser);
    };

    const handleQRAuth = async () => {
        if (!username.trim()) {
            setError("Ingresa tu usuario.");
            return;
        }
        
        await handleAuth(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setPassword("");
        setIsLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>🚀 LOGINTECH DApp</h1>
                    <p>Sistema de Préstamos - Stellar Testnet</p>
                    <div className="testnet-badge">🔗 Conectado a Testnet</div>
                </div>

                <div className="auth-tabs">
                    <button 
                        className={`tab-button ${activeAuth === 'password' ? 'active' : ''}`}
                        onClick={() => setActiveAuth('password')}
                    >
                        Contraseña
                    </button>
                    <button 
                        className={`tab-button ${activeAuth === 'biometric' ? 'active' : ''}`}
                        onClick={() => setActiveAuth('biometric')}
                        disabled={!isBiometricSupported}
                    >
                        Huella
                    </button>
                    <button 
                        className={`tab-button ${activeAuth === 'qr' ? 'active' : ''}`}
                        onClick={() => setActiveAuth('qr')}
                    >
                        QR
                    </button>
                </div>

                <div className="auth-content">
                    <div className="input-group">
                        <label htmlFor="username">Usuario</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Ingresa tu usuario"
                            value={username}
                            onChange={e => { setUsername(e.target.value); setError(""); }}
                            className={error && !username ? 'input-error' : ''}
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {activeAuth === 'password' && (
                        <div className="password-buttons">
                            <button 
                                className="auth-button primary"
                                onClick={handlePasswordLogin}
                                disabled={isLoading || !username.trim()}
                            >
                                {isLoading ? "Verificando..." : "Iniciar Sesión"}
                            </button>
                            <button 
                                className="auth-button secondary"
                                onClick={handlePasswordRegister}
                                disabled={isLoading || !username.trim()}
                            >
                                {isLoading ? "Registrando..." : "Registrarse"}
                            </button>
                        </div>
                    )}

                    {activeAuth === 'biometric' && isBiometricSupported && (
                        <div className="biometric-buttons">
                            <button 
                                className="auth-button primary"
                                onClick={handleBiometricLogin}
                                disabled={isLoading || !username.trim()}
                            >
                                {isLoading ? "Procesando..." : "Iniciar con Huella"}
                            </button>
                            <button 
                                className="auth-button secondary"
                                onClick={handleBiometricRegister}
                                disabled={isLoading || !username.trim()}
                            >
                                {isLoading ? "Registrando..." : "Registrar Huella"}
                            </button>
                        </div>
                    )}

                    {activeAuth === 'qr' && (
                        <button 
                            className="auth-button primary qr-button"
                            onClick={handleQRAuth}
                            disabled={isLoading || !username.trim()}
                        >
                            {isLoading ? "Generando QR..." : "Escanear Código QR"}
                        </button>
                    )}

                    {activeAuth === 'biometric' && !isBiometricSupported && (
                        <div className="warning-message">
                            ⚠️ La autenticación biométrica no está disponible en este dispositivo
                        </div>
                    )}
                </div>

                <div className="wallet-info">
                    <p>🔗 <strong>Stellar Testnet</strong> - Datos en blockchain</p>
                    <p>💰 Wallet automática - Fondos gratuitos</p>
                    <p>📊 Perfiles guardados en la red</p>
                </div>

                <div className="login-footer">
                    <p>¿Problemas para acceder? <a href="#support">Contactar soporte</a></p>
                </div>
            </div>

            {/* Modal de autenticación */}
            {showModal && (
                <div className="modal-backdrop">
                    <div className="modal">
                        {authMethod === "biometric" ? (
                            <>
                                <h2>
                                    {modalType === "login" 
                                        ? "Verificación de Huella Digital" 
                                        : "Registro de Huella Digital"}
                                </h2>
                                <p>
                                    {modalType === "login"
                                        ? "Por favor, toca el sensor de huella digital en tu dispositivo..."
                                        : "Registra tu huella digital cuando el navegador lo solicite..."}
                                </p>
                                <div className="biometric-animation">
                                    <div className="fingerprint-scanner">
                                        <div className="fingerprint"></div>
                                    </div>
                                </div>
                                {isLoading && (
                                    <div className="loading-spinner">
                                        {modalType === "login" ? "🔍 Verificando..." : "💾 Guardando en Testnet..."}
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <h2>{isNewUser ? "Registro de Usuario" : "Iniciar Sesión"}</h2>
                                <p className="modal-subtitle">
                                    {isNewUser 
                                        ? "🔗 Se creará tu perfil en Stellar Testnet"
                                        : "🔗 Verificando tu perfil en Testnet"}
                                </p>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        placeholder="Contraseña"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="modal-input"
                                        onKeyPress={(e) => e.key === 'Enter' && handlePasswordAuth()}
                                    />
                                </div>
                                <button 
                                    className="auth-button primary" 
                                    onClick={handlePasswordAuth}
                                    disabled={isLoading || !password.trim()}
                                >
                                    {isLoading 
                                        ? (isNewUser ? "💾 Guardando..." : "🔍 Verificando...") 
                                        : (isNewUser ? "📝 Registrarse" : "🚀 Iniciar Sesión")}
                                </button>
                            </>
                        )}
                        <button 
                            className="auth-button secondary" 
                            onClick={handleCloseModal}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>

                        {isLoading && (
                            <div className="transaction-status">
                                <p>⏳ Procesando transacción en Testnet...</p>
                                <p className="small">Esto puede tomar unos segundos</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}