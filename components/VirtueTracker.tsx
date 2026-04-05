import { VirtueProgress } from '@/lib/types';

interface VirtueTrackerProps {
  virtues: VirtueProgress;
}

const virtueColors = {
  Faith: 'bg-gradient-to-r from-blue-500 to-blue-600',
  Mercy: 'bg-gradient-to-r from-pink-500 to-pink-600',
  Courage: 'bg-gradient-to-r from-red-500 to-red-600',
  Wisdom: 'bg-gradient-to-r from-purple-500 to-purple-600',
};

const virtueBgColors = {
  Faith: 'from-blue-50 to-blue-100',
  Mercy: 'from-pink-50 to-pink-100',
  Courage: 'from-red-50 to-red-100',
  Wisdom: 'from-purple-50 to-purple-100',
};

const virtueIcons = {
  Faith: '✝️',
  Mercy: '❤️',
  Courage: '🦁',
  Wisdom: '📖',
};

export default function VirtueTracker({ virtues }: VirtueTrackerProps) {
  const maxPoints = 20; // Scale for progress bars
  const totalPoints = Object.values(virtues).reduce((sum, val) => sum + val, 0);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 border-2 border-gray-200">
      <div className="text-center mb-6">
        <span className="text-4xl mb-2 block">🌟</span>
        <h3 className="text-2xl font-bold text-gray-800">Your Virtues</h3>
      </div>

      <div className="space-y-5">
        {Object.entries(virtues).map(([virtue, points]) => {
          const percentage = Math.min((points / maxPoints) * 100, 100);
          return (
            <div key={virtue} className={`bg-gradient-to-r ${virtueBgColors[virtue as keyof VirtueProgress]} rounded-xl p-4 shadow-md`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                  <span className="text-2xl">{virtueIcons[virtue as keyof VirtueProgress]}</span>
                  {virtue}
                </span>
                <span className="font-bold text-gray-700 bg-white px-3 py-1 rounded-full text-sm shadow">
                  {points} pts
                </span>
              </div>
              <div className="w-full bg-white/70 rounded-full h-4 shadow-inner">
                <div
                  className={`${virtueColors[virtue as keyof VirtueProgress]} h-4 rounded-full transition-all duration-500 shadow-sm`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 shadow-lg border-2 border-yellow-300">
        <div className="text-sm font-semibold text-gray-600 mb-1">Total Virtue Points</div>
        <div className="text-5xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
          {totalPoints}
        </div>
        {totalPoints >= 10 && (
          <div className="mt-2 text-sm font-semibold text-gray-600">
            {totalPoints >= 30 ? '🎉 Saint in the Making!' : '⭐ Growing Strong!'}
          </div>
        )}
      </div>
    </div>
  );
}
