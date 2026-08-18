import React, { useState } from 'react';
import { Gamepad2, Play, Sparkles } from 'lucide-react';
import { BreakoutGame } from './BreakoutGame';
import { TetrisGame } from './TetrisGame';
import { GalagaGame } from './GalagaGame';

export const ArcadeGames: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'breakout' | 'tetris' | 'galaga' | null>(null);

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto bg-transparent">
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 text-xs font-mono uppercase mb-4 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
          <Gamepad2 className="w-4 h-4 text-red-500" />
          <span>MOTORES DE ARCADE (PANTALLA COMPLETA)</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-black text-white mb-4 tracking-tight uppercase">
          SIMULADORES <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#df2531] via-red-500 to-[#00f3ff]">60 FPS</span>
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto text-base font-mono">
          Selecciona un motor de juego interactivo. Se abrirá en pantalla completa con físicas avanzadas, power-ups y dificultad escalonada. Presiona ESC en cualquier momento para salir.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* NeoBreakout Card */}
        <div 
          onClick={() => setActiveGame('breakout')}
          className="group rounded-3xl bg-gradient-to-b from-[#0a0f25] to-[#03050c] border border-red-500/30 hover:border-red-500/80 p-8 transition-all duration-300 hover:shadow-[0_0_50px_rgba(220,38,38,0.3)] cursor-pointer relative overflow-hidden flex flex-col justify-between hover:scale-[1.02]"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#df2531] to-[#00f3ff]" />
          <div>
            <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/50 flex items-center justify-center mb-6 text-red-400 shadow-[0_0_25px_rgba(220,38,38,0.4)] group-hover:scale-110 transition-transform">
              <span className="text-3xl">🕹️</span>
            </div>
            <h3 className="text-2xl font-black text-white mb-3 font-mono uppercase group-hover:text-red-400 transition-colors">
              NeoBreakout Evolved
            </h3>
            <p className="text-gray-400 text-sm font-mono mb-6 leading-relaxed">
              Física de rebote, bloques con hasta 10 impactos y power-ups dinámicos (multibola, escudo protector, expansión de plataforma).
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-xs text-red-400 font-mono uppercase font-bold">Pantalla Completa</span>
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)] group-hover:scale-105 transition-transform">
              <Play className="w-4 h-4 fill-current" />
            </div>
          </div>
        </div>

        {/* Tetris Card */}
        <div 
          onClick={() => setActiveGame('tetris')}
          className="group rounded-3xl bg-gradient-to-b from-[#0a0f25] to-[#03050c] border border-red-500/30 hover:border-red-500/80 p-8 transition-all duration-300 hover:shadow-[0_0_50px_rgba(220,38,38,0.3)] cursor-pointer relative overflow-hidden flex flex-col justify-between hover:scale-[1.02]"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-cyan-400" />
          <div>
            <div className="w-16 h-16 rounded-2xl bg-purple-950/60 border border-purple-500/50 flex items-center justify-center mb-6 text-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.4)] group-hover:scale-110 transition-transform">
              <span className="text-3xl">🧱</span>
            </div>
            <h3 className="text-2xl font-black text-white mb-3 font-mono uppercase group-hover:text-purple-400 transition-colors">
              Tetris Algorítmico
            </h3>
            <p className="text-gray-400 text-sm font-mono mb-6 leading-relaxed">
              Motor lógico de bloques en TypeScript con rotación matricial O(1), eliminación de filas y renderizado neón fluido.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-xs text-purple-400 font-mono uppercase font-bold">Pantalla Completa</span>
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:scale-105 transition-transform">
              <Play className="w-4 h-4 fill-current" />
            </div>
          </div>
        </div>

        {/* Galaga Card */}
        <div 
          onClick={() => setActiveGame('galaga')}
          className="group rounded-3xl bg-gradient-to-b from-[#0a0f25] to-[#03050c] border border-red-500/30 hover:border-red-500/80 p-8 transition-all duration-300 hover:shadow-[0_0_50px_rgba(220,38,38,0.3)] cursor-pointer relative overflow-hidden flex flex-col justify-between hover:scale-[1.02]"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600" />
          <div>
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center mb-6 text-cyan-400 shadow-[0_0_25px_rgba(0,243,255,0.4)] group-hover:scale-110 transition-transform">
              <span className="text-3xl">🚀</span>
            </div>
            <h3 className="text-2xl font-black text-white mb-3 font-mono uppercase group-hover:text-cyan-400 transition-colors">
              Galaga Retro Shooter
            </h3>
            <p className="text-gray-400 text-sm font-mono mb-6 leading-relaxed">
              Shooter espacial clásico de oleadas enemigas con láseres, movimiento dinámico y destrucción total a 60 FPS.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-xs text-cyan-400 font-mono uppercase font-bold">Pantalla Completa</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.5)] group-hover:scale-105 transition-transform">
              <Play className="w-4 h-4 fill-current" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Game Fullscreen Modal */}
      {activeGame === 'breakout' && <BreakoutGame onClose={() => setActiveGame(null)} />}
      {activeGame === 'tetris' && <TetrisGame onClose={() => setActiveGame(null)} />}
      {activeGame === 'galaga' && <GalagaGame onClose={() => setActiveGame(null)} />}
    </section>
  );
};
