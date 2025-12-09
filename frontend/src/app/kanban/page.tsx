import React from 'react'
import KanbanBoard from '../../components/KanbanBoard'
import { PlusCircle } from 'lucide-react'

export default function Page() {
  return (
    <main className="min-h-screen animated-gradient py-8">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center glass">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
              </svg>
            </div>
            <div>
              <h2 className="text-white font-extrabold">Kanban Studio</h2>
              <p className="text-xs text-gray-100/70">Un tablero interactivo y visual</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-white/6 hover:bg-white/8 text-white rounded-md glass">
              Exportar
            </button>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md shadow-md flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Nuevo tablero
            </button>
          </div>
        </nav>

        <header className="mb-6 text-white">
          <h1 className="text-5xl font-extrabold drop-shadow-lg">Organiza tus actas y tareas con estilo</h1>
          <p className="mt-2 text-gray-100/80">Fondo animado, efecto glass y acciones rápidas. Arrastra tarjetas entre columnas para probar.</p>
        </header>

        <section className="bg-gradient-to-b from-white/3 to-black/10 p-6 rounded-3xl glass border border-white/6">
          <KanbanBoard />
        </section>

        <button
          aria-label="Agregar tarjeta"
          className="fixed right-8 bottom-8 bg-pink-500 hover:bg-pink-400 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl transform-gpu hover:scale-105 transition"
        >
          <PlusCircle className="w-6 h-6" />
        </button>
      </div>
    </main>
  )
}
