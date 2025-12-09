<<<<<<< HEAD
# LoginTech

Proyecto: LoginTech — plataforma educativa con autenticación descentralizada + micropréstamos on-chain (Soroban).

## Estructura
- contracts/: contrato Soroban en Rust
- frontend/: React + TypeScript
- scripts/: utilidades build/deploy

## Pasos rápidos
1. Instala Rust + target wasm32 and soroban toolchain.
2. Compila contrato:
   - `cd contracts/logintech-contract`
   - `cargo build --release --target wasm32-unknown-unknown`
3. Despliega usando `soroban-cli`:
   - `soroban contract deploy --wasm target/wasm32-unknown-unknown/release/logintech_contract.wasm --network testnet`
4. Ajusta `frontend/src/services/soroban.ts` con el `CONTRACT_ID` obtenido al desplegar.
5. Configura e integra la wallet Soroban en `frontend/src/services/walletAdapter.ts`.
6. Ejecuta frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## Notas
- El contrato aquí es un *registro* de préstamos. Si quieres transferir tokens reales (ej. USDC), hay que integrar el estándar token Soroban dentro de las funciones `create_loan` y `pay`.
- Revisa versiones de `soroban-sdk` y APIs de wallets antes de desplegar en mainnet.
=======
# 🔐 Soroban Passkey Authentication Demo

Implementación completa de autenticación con Passkeys (WebAuthn) para contratos inteligentes de Soroban en la blockchain de Stellar.

## 🎯 Características

- ✅ **Contrato de cuenta personalizado** en Soroban con verificación secp256r1
- ✅ **Frontend moderno** con Next.js 14+ y TypeScript
- ✅ **Autenticación biométrica** con WebAuthn/Passkeys
- ✅ **Sin contraseñas** - usa Face ID, Touch ID o Windows Hello
- ✅ **Integración completa** con Stellar SDK
- ✅ **UI/UX moderna** con Tailwind CSS

## 📋 Requisitos Previos

- **Rust** 1.75+
- **Node.js** 18+
- **Stellar CLI** (soroban-cli)
- **HTTPS** (para WebAuthn - incluye certificado self-signed para desarrollo)

## 🚀 Instalación Rápida

```bash
# Clonar el proyecto
git clone <tu-repo>
cd soroban-passkey-demo

# Instalar dependencias del contrato
cd contract
make build

# Instalar dependencias del frontend
cd ../frontend
npm install

# Iniciar desarrollo
npm run dev
```

## 📁 Estructura del Proyecto

```
soroban-passkey-demo/
├── contract/               # Contrato Soroban en Rust
│   ├── src/
│   │   ├── lib.rs         # Contrato principal con __check_auth
│   │   └── test.rs        # Tests del contrato
│   ├── Cargo.toml
│   └── Makefile
├── frontend/              # Aplicación Next.js
│   ├── src/
│   │   ├── app/          # App Router de Next.js 14
│   │   ├── components/   # Componentes React
│   │   ├── hooks/        # Custom hooks (usePasskey, useStellar)
│   │   └── lib/          # Utilidades y configuración
│   ├── package.json
│   └── next.config.js
├── scripts/              # Scripts de deployment
└── README.md
```

## 🔧 Cómo Funciona

### 1. Registro de Passkey

```typescript
// El usuario crea un passkey (clave biométrica)
const credential = await navigator.credentials.create({
  publicKey: {
    challenge: randomChallenge,
    rp: { name: "Soroban Passkey Demo" },
    user: { id, name, displayName },
    pubKeyCredParams: [{ type: "public-key", alg: -7 }], // ES256 (secp256r1)
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      userVerification: "required"
    }
  }
});
```

### 2. Almacenamiento en el Contrato

```rust
// La clave pública se almacena en el contrato Soroban
pub fn init(env: Env, public_key: BytesN<64>) {
    env.storage().instance().set(&DataKey::Owner, &public_key);
}
```

### 3. Autenticación

```rust
// El contrato verifica la firma usando secp256r1
fn __check_auth(
    env: Env,
    signature_payload: Hash<32>,
    signature: BytesN<64>,
    _auth_context: Vec<Context>,
) -> Result<(), Error> {
    let public_key: BytesN<64> = env.storage()
        .instance()
        .get(&DataKey::Owner)
        .unwrap();
    
    env.crypto().secp256r1_verify(
        &public_key,
        &signature_payload.into(),
        &signature
    );
    Ok(())
}
```

## 🌐 Desarrollo con HTTPS

WebAuthn requiere HTTPS. Para desarrollo local:

```bash
cd frontend
npm run dev:https
# Acepta el certificado self-signed en el navegador
```

## 🧪 Testing

```bash
# Tests del contrato
cd contract
cargo test

# Tests del frontend
cd frontend
npm test
```

## 📦 Deployment

### Testnet

```bash
# Compilar el contrato
cd contract
make build

# Desplegar a Stellar Testnet
./scripts/deploy-testnet.sh

# Configurar el frontend
cd frontend
cp .env.example .env.local
# Edita .env.local con el CONTRACT_ID

# Deploy del frontend (Vercel)
npm run build
vercel deploy
```

## 🎓 Recursos

- [Soroban Documentation](https://soroban.stellar.org/)
- [WebAuthn Guide](https://webauthn.guide/)
- [Stellar SDK](https://stellar.github.io/js-stellar-sdk/)

## ⏱️ Tiempo de Implementación

**Desarrollo completo**: ~4-6 horas

- Contrato Soroban: 1.5-2 horas
- Frontend Next.js: 2-3 horas
- Integración y testing: 0.5-1 hora

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios.

## 📄 Licencia

MIT License - ver LICENSE para más detalles

## 👨‍💻 Autor

Creado con ❤️ para la comunidad de Stellar/Soroban
>>>>>>> 90f075aa62ceed2115b41aa6ec5603b8373afee2
