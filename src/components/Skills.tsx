import React from 'react';
import { Terminal, Cpu, Database, Shield, Code, Server, GitBranch } from 'lucide-react';

export const Skills: React.FC = () => {
  const skillCategories = [
    {
      title: 'Arquitectura & Lenguajes',
      icon: <Terminal className="w-6 h-6 text-red-500" />,
      skills: ['TypeScript (Estricto)', 'JavaScript (ESNext)', 'Python 3.12', 'HTML5 / CSS3', 'Node.js']
    },
    {
      title: 'Ciencia de Datos & Tuberías',
      icon: <Database className="w-6 h-6 text-rose-500" />,
      skills: ['Pandas & NumPy', 'Scikit-Learn (PCA / K-Means)', 'ETL Automated Pipelines', 'RESTful APIs', 'SQL / PostgreSQL']
    },
    {
      title: 'Motores & Rendimiento',
      icon: <Cpu className="w-6 h-6 text-red-400" />,
      skills: ['HTML5 Canvas (60 FPS)', 'Colisiones Matriciales', 'Algoritmos de Decisión', 'Optimización de Memoria', 'Gestión de Estado']
    },
    {
      title: 'Herramientas & Entornos',
      icon: <Shield className="w-6 h-6 text-rose-400" />,
      skills: ['Git / GitHub Workflows', 'Docker Containers', 'Tailwind CSS', 'Vite Build Systems']
    }
  ];

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto bg-transparent">
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-950/50 border border-red-500/30 text-red-400 text-xs font-mono uppercase mb-4">
          <Code className="w-4 h-4" />
          <span>Stack Tecnológico</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tight">
          HABILIDADES DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">INGENIERÍA</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-base">
          Herramientas y tecnologías dominadas para crear sistemas robustos, rápidos y escalables.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {skillCategories.map((cat, idx) => (
          <div
            key={idx}
            className="p-8 rounded-3xl bg-[#0a0f25] border border-red-500/30 hover:border-red-500/60 shadow-[0_0_30px_rgba(220,38,38,0.1)] transition-all relative overflow-hidden group"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.2)] group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-white">{cat.title}</h3>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {cat.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-200 text-xs font-mono tracking-wider hover:border-red-500/50 hover:bg-red-950/20 transition-all"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
