"use client";

import { useState } from "react";

export default function HomePage() {
  const [step, setStep] = useState("menu");

  return (
    <div className="flex flex-col items-center justify-center text-center">

      {step === "menu" && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Bienvenido</h1>
          <p className="text-slate-300">Elige una opción para continuar</p>

          <button
            onClick={() => setStep("register")}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg"
          >
            Registrarse
          </button>

          <button
            onClick={() => setStep("login")}
            className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-lg"
          >
            Iniciar sesión
          </button>
        </div>
      )}

      {/* --------------- REGISTRO --------------- */}
      {step === "register" && (
        <RegisterForm goBack={() => setStep("menu")} />
      )}

      {/* --------------- LOGIN --------------- */}
      {step === "login" && (
        <LoginForm goBack={() => setStep("menu")} />
      )}
    </div>
  );
}

function RegisterForm({ goBack }: { goBack: () => void }) {
  const [username, setUsername] = useState("");

  async function handleRegister() {
    alert("Aquí generas la passkey + guardas usuario");
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <h2 className="text-2xl font-semibold">Crear cuenta</h2>

      <input
        className="w-full p-3 rounded bg-slate-800 border border-slate-600"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button
        onClick={handleRegister}
        className="bg-blue-600 hover:bg-blue-500 w-full py-2 rounded"
      >
        Generar llave biométrica
      </button>

      <button onClick={goBack} className="text-slate-400 hover:text-white">
        ← Regresar
      </button>
    </div>
  );
}

function LoginForm({ goBack }: { goBack: () => void }) {
  async function handleLogin() {
    alert("Aquí verificas la passkey y entras al dashboard");
    window.location.href = "/dashboard";
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <h2 className="text-2xl font-semibold">Iniciar sesión</h2>

      <button
        onClick={handleLogin}
        className="bg-green-600 hover:bg-green-500 w-full py-2 rounded"
      >
        Entrar con biométricos
      </button>

      <button onClick={goBack} className="text-slate-400 hover:text-white">
        ← Regresar
      </button>
    </div>
  );
}
