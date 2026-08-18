import React from 'react';
import { Mail, Phone, Github } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <section className="py-20 px-4 max-w-5xl mx-auto bg-transparent">
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 text-xs font-mono uppercase mb-4 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
          <Mail className="w-4 h-4" />
          <span>Contratación Directa</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-black text-white mb-4 tracking-tight uppercase">
          CONTACTO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#df2531] via-red-500 to-[#00f3ff]">DIRECTO</span>
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto text-base font-mono">
          Disponibilidad inmediata para entrevistas, evaluación técnica y arquitectura de sistemas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <a
          href="tel:2711248760"
          className="p-8 rounded-3xl bg-[#0a0f25] border border-red-500/30 hover:border-red-500/80 transition-all text-center group shadow-[0_0_30px_rgba(220,38,38,0.15)] flex flex-col items-center justify-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-red-950/60 border border-red-500/50 flex items-center justify-center text-red-400 mb-4 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(220,38,38,0.4)]">
            <Phone className="w-6 h-6" />
          </div>
          <span className="text-xs text-red-400 font-mono uppercase mb-1">Teléfono</span>
          <p className="text-lg font-bold text-white font-mono">2711248760</p>
        </a>

        <a
          href="mailto:eduardobolt4444@gmail.com"
          className="p-8 rounded-3xl bg-[#0a0f25] border border-red-500/30 hover:border-red-500/80 transition-all text-center group shadow-[0_0_30px_rgba(220,38,38,0.15)] flex flex-col items-center justify-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-rose-950/60 border border-rose-500/50 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(244,63,94,0.4)]">
            <Mail className="w-6 h-6" />
          </div>
          <span className="text-xs text-rose-400 font-mono uppercase mb-1">Correo</span>
          <p className="text-sm font-bold text-white font-mono break-all">eduardobolt4444@gmail.com</p>
        </a>

        <a
          href="https://github.com/KamiCode"
          target="_blank"
          rel="noopener noreferrer"
          className="p-8 rounded-3xl bg-[#0a0f25] border border-cyan-500/30 hover:border-cyan-500/80 transition-all text-center group shadow-[0_0_30px_rgba(0,243,255,0.15)] flex flex-col items-center justify-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,243,255,0.4)]">
            <Github className="w-6 h-6" />
          </div>
          <span className="text-xs text-cyan-400 font-mono uppercase mb-1">GitHub</span>
          <p className="text-sm font-bold text-white font-mono">github.com/KamiCode</p>
        </a>
      </div>
    </section>
  );
};
