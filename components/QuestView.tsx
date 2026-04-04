'use client';

import { useState, useEffect } from 'react';
import { Quest } from '@/lib/types';

interface QuestViewProps {
  quest: Quest;
  onComplete: (rewards: { virtue: string; points: number }[]) => void;
}

type QuestStage = 'story' | 'challenge' | 'result' | 'reward';

export default function QuestView({ quest, onComplete }: QuestViewProps) {
  const [stage, setStage] = useState<QuestStage>('story');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Reset to story stage when quest changes
  useEffect(() => {
    setStage('story');
    setSelectedAnswer(null);
    setIsCorrect(false);
  }, [quest.id]);

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === quest.challenge.correctAnswer;
    setIsCorrect(correct);
    setStage('result');
  };

  const handleContinue = () => {
    if (stage === 'story') {
      setStage('challenge');
    } else if (stage === 'result') {
      setStage('reward');
    } else if (stage === 'reward') {
      onComplete(quest.rewards);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-slide-in-up">
      {/* Story Stage */}
      {stage === 'story' && (
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl p-10 border-2 border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-5xl">📖</span>
            <h2 className="text-4xl font-bold text-gray-800">{quest.title}</h2>
          </div>
          <div className="bg-white/50 rounded-xl p-6 mb-8 backdrop-blur-sm">
            <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-line">{quest.story}</p>
          </div>
          <button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl text-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
          >
            Continue to Challenge →
          </button>
        </div>
      )}

      {/* Challenge Stage */}
      {stage === 'challenge' && (
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-2xl p-10 border-2 border-purple-100">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-5xl">🤔</span>
            <h3 className="text-3xl font-bold text-gray-800">Challenge</h3>
          </div>
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 mb-8 border-l-4 border-purple-600">
            <p className="text-xl font-semibold text-gray-800">{quest.challenge.question}</p>
          </div>
          <div className="space-y-4 mb-8">
            {quest.challenge.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(index)}
                className={`w-full text-left p-5 rounded-xl border-3 transition-all transform hover:scale-102 ${
                  selectedAnswer === index
                    ? 'border-purple-600 bg-gradient-to-r from-purple-100 to-blue-100 shadow-lg scale-102'
                    : 'border-gray-300 bg-white hover:border-purple-400 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    selectedAnswer === index
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-800">{option}</span>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={handleAnswerSubmit}
            disabled={selectedAnswer === null}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-10 py-4 rounded-xl text-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:scale-100 transform"
          >
            Submit Answer ✓
          </button>
        </div>
      )}

      {/* Result Stage */}
      {stage === 'result' && (
        <div className={`rounded-2xl shadow-2xl p-10 border-4 ${
          isCorrect
            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400'
            : 'bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-400'
        }`}>
          <div className="text-center mb-8">
            <div className={`text-8xl mb-4 animate-bounce-slow ${isCorrect ? 'text-green-600' : 'text-orange-600'}`}>
              {isCorrect ? '✓' : '💡'}
            </div>
            <h3 className={`text-4xl font-bold mb-3 ${isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
              {isCorrect ? 'Excellent!' : 'Good Try!'}
            </h3>
            <p className="text-lg text-gray-600">
              {isCorrect ? 'You got it right!' : 'Let\'s learn from this!'}
            </p>
          </div>

          {quest.challenge.explanation && (
            <div className="bg-white/80 backdrop-blur-sm border-l-4 border-blue-600 rounded-lg p-6 mb-6 shadow-md">
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">💭</span>
                <p className="text-gray-800 leading-relaxed">{quest.challenge.explanation}</p>
              </div>
            </div>
          )}

          {!isCorrect && (
            <div className="mb-6 p-6 bg-white/80 backdrop-blur-sm border-l-4 border-green-600 rounded-lg shadow-md">
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">✓</span>
                <div>
                  <p className="font-bold text-green-700 mb-1">Correct answer:</p>
                  <p className="text-gray-800">{quest.challenge.options[quest.challenge.correctAnswer]}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl text-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
          >
            See Your Rewards →
          </button>
        </div>
      )}

      {/* Reward Stage */}
      {stage === 'reward' && (
        <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 rounded-2xl shadow-2xl p-10 text-center border-4 border-yellow-300">
          <div className="text-7xl mb-4 animate-bounce-slow">🎉</div>
          <h3 className="text-4xl font-bold mb-8 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Quest Complete!
          </h3>

          <div className="mb-10">
            <p className="text-xl mb-6 text-gray-700 font-semibold">You earned:</p>
            <div className="space-y-4">
              {quest.rewards.map((reward, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-yellow-200 to-orange-200 border-3 border-yellow-500 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform"
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl">
                      {reward.virtue === 'Faith' && '✝️'}
                      {reward.virtue === 'Mercy' && '❤️'}
                      {reward.virtue === 'Courage' && '🦁'}
                      {reward.virtue === 'Wisdom' && '📖'}
                    </span>
                    <span className="text-3xl font-bold text-yellow-800">
                      +{reward.points} {reward.virtue}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-5 rounded-xl text-2xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
          >
            Continue Your Journey →
          </button>
        </div>
      )}
    </div>
  );
}
