import React from 'react';
import { Clock, Circle } from 'lucide-react';

type Card = {
  id: string;
  title: string;
  desc?: string;
  color?: string;
};

export default function KanbanCard({ card }: { card: Card }) {
  return (
    <div
      draggable
      className="p-4 mb-4 rounded-xl shadow-2xl cursor-grab hover:scale-[1.02] transform-gpu transition-all duration-200 glass border-l-4"
      data-id={card.id}
      style={{ borderColor: card.color || 'rgba(255,255,255,0.12)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-white leading-tight">{card.title}</h4>
          {card.desc ? (
            <p className="text-xs text-gray-100/80 mt-2">{card.desc}</p>
          ) : null}
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 text-gray-200/80 text-xs">
            <Clock className="w-4 h-4 text-gray-200/80" />
            <span>Hoy</span>
          </div>
          {card.color ? (
            <Circle className="w-4 h-4" style={{ color: card.color }} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
