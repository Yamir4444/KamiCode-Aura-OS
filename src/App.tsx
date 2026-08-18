import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Universes } from './components/Universes';
import { ArcadeGames } from './components/ArcadeGames';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');

  return (
    <div className="min-h-screen bg-[#050814] text-gray-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <>
            <Hero setActiveTab={setActiveTab} />
            <Universes />
            <ArcadeGames />
            <Skills />
            <Contact />
          </>
        )}
        {activeTab === 'architecture' && <Universes />}
        {activeTab === 'arcade' && <ArcadeGames />}
        {activeTab === 'skills' && <Skills />}
        {activeTab === 'contact' && <Contact />}
      </main>

      {/* Footer with requested humor */}
      <footer className="bg-[#03050c] border-t border-cyan-500/20 py-10 px-4 text-center font-mono text-xs text-gray-400 space-y-2 mt-20 relative z-10">
        <p>© 2026 KamiCode / Eduardo Yamir Vera Ramos. Todos los derechos reservados.</p>
        <p className="text-cyan-400 italic">¿Alguien de verdad estará leyendo esto? (Si lo leíste, contrátame)</p>
      </footer>
    </div>
  );
}
