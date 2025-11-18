"use client";
import React, { useEffect, useState } from 'react';
import KanbanCard from './KanbanCard';

type Card = { id: string; title: string; desc?: string; color?: string };
type Column = { id: string; title: string; cards: Card[] };

const STORAGE_KEY = 'kanban-data-v1';

const sampleData: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    cards: [
      { id: 'c1', title: 'Crear wireframe', desc: 'Bocetar la pantalla principal', color: '#FFB86B' },
      { id: 'c2', title: 'Revisar acta', desc: 'Leer actas previas', color: '#FFD6A5' },
    ],
  },
  {
    id: 'doing',
    title: 'Doing',
    cards: [{ id: 'c3', title: 'Implementar API', desc: 'Endpoint para actas', color: '#9AE6B4' }],
  },
  {
    id: 'done',
    title: 'Done',
    cards: [{ id: 'c4', title: 'Instalar Tailwind', desc: 'Configurar utilidades', color: '#BDB2FF' }],
  },
];

export default function KanbanBoard() {
  const [cols, setCols] = useState<Column[]>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      return raw ? JSON.parse(raw) : sampleData;
    } catch (e) {
      return sampleData;
    }
  });

  const [newCardTitle, setNewCardTitle] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cols));
    } catch (e) {
      // ignore
    }
  }, [cols]);

  function handleDragStart(e: React.DragEvent, cardId: string, fromId: string) {
    e.dataTransfer.setData('application/json', JSON.stringify({ cardId, fromId }));
  }

  function handleDrop(e: React.DragEvent, toId: string) {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;
    try {
      const { cardId, fromId } = JSON.parse(data);
      if (fromId === toId) return;
      setCols((prev) => {
        const fromCol = prev.find((c) => c.id === fromId);
        const toCol = prev.find((c) => c.id === toId);
        if (!fromCol || !toCol) return prev;
        const cardIndex = fromCol.cards.findIndex((x) => x.id === cardId);
        if (cardIndex === -1) return prev;
        const card = fromCol.cards[cardIndex];
        const newFromCards = [...fromCol.cards.slice(0, cardIndex), ...fromCol.cards.slice(cardIndex + 1)];
        const newToCards = [card, ...toCol.cards];
        return prev.map((c) => {
          if (c.id === fromId) return { ...c, cards: newFromCards };
          if (c.id === toId) return { ...c, cards: newToCards };
          return c;
        });
      });
    } catch (err) {
      // noop
    }
  }

  function handleAddCard(colId: string) {
    const title = (newCardTitle[colId] || '').trim();
    if (!title) return;
    const newCard: Card = { id: 'c' + Date.now(), title, desc: '', color: randomColor() };
    setCols((prev) => prev.map((c) => (c.id === colId ? { ...c, cards: [newCard, ...c.cards] } : c)));
    setNewCardTitle((s) => ({ ...s, [colId]: '' }));
  }

  function randomColor() {
    const palette = ['#FFB86B', '#FFD6A5', '#9AE6B4', '#BDB2FF', '#F6C9E8'];
    return palette[Math.floor(Math.random() * palette.length)];
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex gap-6 overflow-x-auto py-6">
        {cols.map((col) => (
          <div
            key={col.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, col.id)}
            className="min-w-[260px] max-w-sm flex-shrink-0"
          >
            <div className="p-4 rounded-xl glass border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold">{col.title}</h3>
                <span className="text-xs text-gray-200/60">{col.cards.length}</span>
              </div>

              <div>
                <div className="mb-3">
                  <input
                    value={newCardTitle[col.id] || ''}
                    onChange={(e) => setNewCardTitle((s) => ({ ...s, [col.id]: e.target.value }))}
                    className="w-full p-2 rounded bg-white/5 text-sm text-white placeholder:text-gray-300/60 outline-none"
                    placeholder={`Agregar tarjeta a ${col.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddCard(col.id);
                    }}
                  />
                  <button
                    onClick={() => handleAddCard(col.id)}
                    className="mt-2 w-full bg-white/6 hover:bg-white/8 text-white text-sm py-1 rounded"
                  >
                    Añadir
                  </button>
                </div>

                <div>
                  {col.cards.map((card) => (
                    <div
                      key={card.id}
                      onDragStart={(e) => handleDragStart(e, card.id, col.id)}
                      draggable
                    >
                      <KanbanCard card={card} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
