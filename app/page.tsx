'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-20 left-20 text-9xl animate-float">✝️</div>
        <div className="absolute bottom-20 right-20 text-9xl animate-float-delayed">🌟</div>
        <div className="absolute top-40 right-40 text-7xl animate-float">❤️</div>
        <div className="absolute bottom-40 left-40 text-7xl animate-float-delayed">📖</div>
      </div>

      <div className="relative text-center max-w-3xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12">
        {/* Logo/Title */}
        <div className="mb-6">
          <div className="text-7xl mb-4 animate-bounce-slow">✨</div>
          <h1 className="text-7xl font-black mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Saint Quest
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-4"></div>
        </div>

        <p className="text-3xl mb-4 text-gray-800 font-bold">
          Journey to Sainthood
        </p>
        <p className="text-lg mb-10 text-gray-600 max-w-xl mx-auto leading-relaxed">
          Embark on a journey with the saints. Complete quests, grow in virtue,
          and discover what it means to become an everyday saint.
        </p>

        <div className="space-y-6">
          <Link
            href="/saints"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-16 py-5 rounded-2xl text-2xl font-bold transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform"
          >
            Begin Your Quest →
          </Link>

          <div className="pt-10">
            <h3 className="text-sm font-bold text-gray-500 mb-5 tracking-wider">GROW IN VIRTUE</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                <span className="text-4xl block mb-2">✝️</span>
                <p className="text-sm font-bold text-blue-800">Faith</p>
              </div>
              <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl p-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                <span className="text-4xl block mb-2">❤️</span>
                <p className="text-sm font-bold text-pink-800">Mercy</p>
              </div>
              <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-2xl p-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                <span className="text-4xl block mb-2">🦁</span>
                <p className="text-sm font-bold text-red-800">Courage</p>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                <span className="text-4xl block mb-2">📖</span>
                <p className="text-sm font-bold text-purple-800">Wisdom</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
