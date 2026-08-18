import React from 'react';
import { Rocket, ArrowRight } from 'lucide-react';

interface HeroProps {
  setActiveTab: (tab: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ setActiveTab }) => {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-[#07080f] px-4 py-16">
      {/* Background Red Glow & Minimal Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto w-full text-center space-y-8 z-10">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 text-xs font-mono uppercase shadow-[0_0_20px_rgba(220,38,38,0.3)]">
          <span>OUR VERSION • ARCHITECTURE & DATA</span>
        </div>

        <h1 className="text-6xl sm:text-8xl font-black tracking-tight text-white leading-none uppercase">
          SYSTEMS <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#df2531] via-red-500 to-[#00f3ff] drop-shadow-[0_0_40px_rgba(220,38,38,0.5)]">
            DESIGN
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-gray-400 text-base sm:text-xl font-light leading-relaxed font-mono">
          Eduardo Yamir Vera Ramos • Arquitectura de software de alto rendimiento y ciencia de datos. Diseños limpios, sin redundancias y calculados con precisión milimétrica.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
          <button
            onClick={() => setActiveTab('architecture')}
            className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-rose-500 hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all flex items-center space-x-3 text-sm tracking-wide"
          >
            <span>Ver Sistemas</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('arcade')}
            className="px-8 py-4 rounded-xl font-bold text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all flex items-center space-x-3 text-sm tracking-wide"
          >
            <Rocket className="w-4 h-4 text-red-500" />
            <span>Motores 60 FPS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
