'use client';

import { useRouter } from 'next/navigation';
import { useGame } from '@/lib/context/GameContext';
import { saints } from '@/lib/data/saints';
import SaintCard from '@/components/SaintCard';
import Link from 'next/link';

export default function SaintsPage() {
  const router = useRouter();
  const { selectSaint, resetProgress, gameState } = useGame();

  const handleSelectSaint = (saint: typeof saints[0]) => {
    selectSaint(saint, true); // Always reset virtues to start fresh with each saint
    router.push('/quest');
  };

  const handleFullReset = () => {
    if (confirm('Are you sure you want to reset ALL progress? This will clear all your virtue points.')) {
      resetProgress();
    }
  };

  const totalVirtuePoints = Object.values(gameState.userProgress.virtues).reduce((sum, val) => sum + val, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/"
            className="inline-block text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Back to Home
          </Link>

          {totalVirtuePoints > 0 && (
            <button
              onClick={handleFullReset}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Reset All Progress
            </button>
          )}
        </div>

        <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">
          Choose Your Saint
        </h1>
        <p className="text-lg text-center text-gray-600 mb-4 max-w-2xl mx-auto">
          Each saint has their own unique journey and will help you grow in different virtues.
          Select a saint to begin your quest toward sainthood.
        </p>

        {totalVirtuePoints > 0 && (
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl px-6 py-3 border-2 border-yellow-400">
              <p className="text-sm font-semibold text-gray-700">Previous Total Virtue Points</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                {totalVirtuePoints}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 justify-items-center">
          {saints.map((saint) => (
            <SaintCard
              key={saint.id}
              saint={saint}
              onSelect={() => handleSelectSaint(saint)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
