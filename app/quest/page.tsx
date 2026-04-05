'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/lib/context/GameContext';
import QuestView from '@/components/QuestView';
import VirtueTracker from '@/components/VirtueTracker';
import Link from 'next/link';

export default function QuestPage() {
  const router = useRouter();
  const { gameState, completeQuest, nextQuest, resetProgress } = useGame();

  useEffect(() => {
    if (!gameState.selectedSaint) {
      router.push('/saints');
    }
  }, [gameState.selectedSaint, router]);

  if (!gameState.selectedSaint) {
    return null;
  }

  const currentQuest = gameState.selectedSaint.quests[gameState.userProgress.currentQuestIndex];
  const isLastQuest = gameState.userProgress.currentQuestIndex >= gameState.selectedSaint.quests.length - 1;
  const allQuestsCompleted = gameState.userProgress.currentQuestIndex >= gameState.selectedSaint.quests.length;

  const handleQuestComplete = (rewards: { virtue: string; points: number }[]) => {
    completeQuest(currentQuest.id, rewards);
    nextQuest();
  };

  const handleChooseNewSaint = () => {
    resetProgress();
    router.push('/saints');
  };

  if (allQuestsCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-orange-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-2xl p-12 text-center mb-8">
            <div className="text-8xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
              Congratulations, Everyday Saint!
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              You have completed all quests with {gameState.selectedSaint.name}!
            </p>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-lg p-6 mb-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Your Saintly Journey</h3>
              <p className="text-lg text-gray-700 mb-4">
                Through your quests with {gameState.selectedSaint.name}, you have grown in virtue
                and learned what it means to be an everyday saint.
              </p>
              <p className="text-md text-gray-600">
                "The saints are not extraordinary people who did extraordinary things.
                They are ordinary people who did ordinary things with extraordinary love."
              </p>
            </div>

            <div className="mb-8">
              <VirtueTracker virtues={gameState.userProgress.virtues} />
            </div>

            <div className="space-y-4">
              <button
                onClick={handleChooseNewSaint}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                Journey with Another Saint
              </button>
              <div>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-800 underline"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
          <div>
            <Link
              href="/saints"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              ← Change Saint
            </Link>
            <h2 className="text-2xl font-bold text-gray-800 mt-2">
              {gameState.selectedSaint.name}'s Journey
            </h2>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Quest Progress</div>
            <div className="text-xl font-bold text-gray-800">
              {gameState.userProgress.currentQuestIndex + 1} / {gameState.selectedSaint.quests.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 bg-white rounded-lg p-4 shadow">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-500"
              style={{
                width: `${((gameState.userProgress.currentQuestIndex + 1) / gameState.selectedSaint.quests.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quest View */}
          <div className="lg:col-span-2">
            <QuestView
              quest={currentQuest}
              onComplete={handleQuestComplete}
            />
          </div>

          {/* Sidebar with Virtue Tracker */}
          <div className="lg:col-span-1">
            <VirtueTracker virtues={gameState.userProgress.virtues} />

            {isLastQuest && (
              <div className="mt-6 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-sm font-semibold text-yellow-800">
                  🌟 This is your final quest! Complete it to achieve sainthood with {gameState.selectedSaint.name}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
