import { Saint } from '@/lib/types';
import Image from 'next/image';

interface SaintCardProps {
  saint: Saint;
  onSelect: () => void;
}

const saintEmojis: Record<string, string> = {
  francis: '🕊️',
  paul: '⚔️',
  therese: '🌹',
  carlo: '💻',
};

export default function SaintCard({ saint, onSelect }: SaintCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`group relative ${saint.color} text-white p-8 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 w-full max-w-sm overflow-hidden`}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Saint Icon/Emoji */}
      <div className="relative mb-4">
        <div className="text-6xl mb-3 animate-bounce-slow">
          {saintEmojis[saint.id] || '✨'}
        </div>
      </div>

      {/* Content */}
      <div className="relative text-center">
        <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">{saint.name}</h2>
        <p className="text-sm opacity-90 mb-4 font-semibold">{saint.fullName}</p>
        <p className="text-sm mb-6 leading-relaxed">{saint.description}</p>

        {/* Virtue badges */}
        <div className="flex gap-2 justify-center flex-wrap mb-5">
          {saint.primaryVirtues.map((virtue) => (
            <span
              key={virtue}
              className="bg-white bg-opacity-30 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold shadow-md border border-white/20"
            >
              {virtue}
            </span>
          ))}
        </div>

        {/* Quest count */}
        <div className="flex items-center justify-center gap-2 bg-black/20 rounded-full px-4 py-2 backdrop-blur-sm">
          <span className="text-xl">📖</span>
          <span className="text-sm font-bold">
            {saint.quests.length} Quest{saint.quests.length !== 1 ? 's' : ''} Available
          </span>
        </div>
      </div>

      {/* Click indicator */}
      <div className="absolute bottom-3 right-3 text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
        →
      </div>
    </button>
  );
}
