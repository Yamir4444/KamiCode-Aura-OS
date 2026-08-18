import React, { useState } from 'react';
import { Gamepad2, Cpu, Mail, Sparkles, Menu, X, Layers, Github } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'INICIO', icon: Sparkles },
    { id: 'architecture', label: 'ARQUITECTURA', icon: Layers },
    { id: 'arcade', label: 'ARCADE', icon: Gamepad2 },
    { id: 'contact', label: 'CONTACTO', icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#07080f]/90 backdrop-blur-xl border-b border-red-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo / Brand */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 p-0.5 shadow-[0_0_20px_rgba(220,38,38,0.5)] group-hover:shadow-[0_0_30px_rgba(220,38,38,0.8)] transition-all">
            <div className="w-full h-full bg-[#07080f] rounded-[10px] flex items-center justify-center">
              <span className="text-red-500 font-black text-sm tracking-wider group-hover:scale-110 transition-transform font-mono">KC</span>
            </div>
          </div>
          <div>
            <span className="font-bold text-base text-white tracking-widest font-mono">
              KAMICODE
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-widest transition-all duration-300 ${
                  isActive
                    ? 'bg-red-600/20 text-red-400 border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden lg:flex items-center space-x-3">
          <a
            href="https://github.com/KamiCode"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center space-x-1.5 font-mono"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 border border-red-500/30 text-red-500 hover:bg-red-500/10"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#07080f]/95 border-b border-red-500/30 px-4 pt-2 pb-6 space-y-2 backdrop-blur-2xl">
          {mobileMenuOpen && navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-mono font-bold tracking-widest transition-all ${
                  isActive
                    ? 'bg-red-600/20 text-red-400 border border-red-500/50'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
