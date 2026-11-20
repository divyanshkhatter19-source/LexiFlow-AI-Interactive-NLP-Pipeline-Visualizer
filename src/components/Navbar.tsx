// src/components/Navbar.tsx
import React from "react";
import { Book, Info, Cpu } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#0b0d1a]/90 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="flex items-center space-x-2">
        <Cpu className="w-6 h-6 text-cyan-400" />
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Lexi<span className="text-cyan-400">Flow</span> <span className="text-purple-400">AI</span>
        </h1>
      </div>
      <nav className="flex space-x-6 text-sm font-medium">
        <a href="#vocab" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center space-x-1">
          <span>Pipeline</span>
        </a>
        <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center space-x-1">
          <Book className="w-4 h-4" />
          <span>Documentation</span>
        </a>
        <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center space-x-1">
          <Info className="w-4 h-4" />
          <span>About</span>
        </a>
      </nav>
    </header>
  );
};

export default Navbar;
