import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Passkey Soroban App",
  description: "App con Passkeys y Soroban",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white antialiased">

        <header className="p-4 border-b border-slate-700 bg-slate-900/60 backdrop-blur">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-semibold">Passkey Soroban App</h1>
            <nav>
              <a className="mr-4 hover:text-blue-400 transition" href="/">Dashboard</a>
            </nav>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-6">
          {children}
        </main>

      </body>
    </html>
  );
}
