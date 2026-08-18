import React, { useState } from 'react';
import { Layers } from 'lucide-react';

export const Universes: React.FC = () => {
  const [activePillar, setActivePillar] = useState<number>(0);

  const pillars = [
    {
      title: 'ARQUITECTURA DE SISTEMAS',
      subtitle: 'APIs RESTful • Tipado Estricto • TypeScript',
      icon: '🏛️',
      codeSnippet: `interface SystemNode {\n  id: string;\n  status: 'active' | 'syncing';\n}\nconst clusterSync = async (nodes: SystemNode[]) => {\n  return nodes.map(n => ({ ...n, status: 'active' }));\n};`
    },
    {
      title: 'CIENCIA DE DATOS & PIPELINES',
      subtitle: 'ETL Automated • Pandas • Scikit-Learn (PCA / K-Means)',
      icon: '📊',
      codeSnippet: `scaled_data = StandardScaler().fit_transform(df[cols])\npca_results = PCA(n_components=2).fit_transform(scaled_data)\n# [Basado en data_science_eda_pipeline.py]`
    },
    {
      title: 'MOTORES RENDER 60 FPS',
      subtitle: 'HTML5 Canvas • Colisiones Matriciales • Offscreen',
      icon: '⚡',
      codeSnippet: `const render = (timestamp: number) => {\n  ctx.clearRect(0, 0, width, height);\n  updatePhysics(timestamp);\n  requestAnimationFrame(render);\n};`
    },
    {
      title: 'LÓGICA ALGORÍTMICA',
      subtitle: 'Árboles de Decisión • Minimax • O(1) State',
      icon: '♟️',
      codeSnippet: `function minimax(node, depth, isMaximizing, alpha, beta) {\n  // Pruning execution & state evaluation\n  return bestScore;\n}`
    }
  ];

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto bg-transparent">
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 text-xs font-mono uppercase mb-4 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
          <Layers className="w-4 h-4" />
          <span>Pilares de Ingeniería</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase">
          PILARES <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#df2531] via-red-500 to-[#00f3ff]">TÉCNICOS</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((p, idx) => (
          <div
            key={idx}
            onClick={() => setActivePillar(idx)}
            className={`p-8 rounded-3xl border transition-all duration-300 cursor-pointer relative overflow-hidden group ${
              activePillar === idx
                ? 'bg-gradient-to-b from-red-950/40 to-[#07080f] border-red-500/60 shadow-[0_0_35px_rgba(223,37,49,0.3)] scale-[1.02]'
                : 'bg-black/40 border-white/10 hover:border-red-500/30'
            }`}
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{p.icon}</div>
            <h3 className="text-lg font-black text-white mb-2 tracking-wide font-mono uppercase">
              {p.title}
            </h3>
            <p className="text-xs text-gray-400 font-mono mb-6 leading-relaxed">
              {p.subtitle}
            </p>

            <div className="p-3 rounded-xl bg-black/80 border border-white/10 font-mono text-[10px] text-cyan-400 overflow-x-auto">
              <pre>{p.codeSnippet}</pre>
            </div>

            {activePillar === idx && (
              <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-[#df2531] to-[#00f3ff]" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
