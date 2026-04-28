import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans text-[#0ff] overflow-hidden relative selection:bg-[#f0f] selection:text-black">
      {/* Glitch & Noise Layers */}
      <div className="absolute inset-0 bg-noise z-0"></div>
      <div className="scanline z-0"></div>
      
      {/* Header */}
      <header className="p-4 md:p-6 flex flex-col sm:flex-row items-center sm:justify-between z-10 border-b-2 border-[#0ff] bg-black/80">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <Terminal className="w-8 h-8 text-[#f0f]" />
          <h1 className="text-2xl md:text-3xl font-mono font-black tracking-widest text-[#0ff] glitch-text" data-text="SYSTEM_OVERRIDE">
            SYSTEM_OVERRIDE
          </h1>
        </div>
        
        <div className="flex flex-col items-end border border-[#f0f] p-2 bg-[#f0f]/10">
          <span className="text-xs font-mono text-[#f0f] uppercase tracking-widest">DATA_COLLECTED</span>
          <span className="text-xl md:text-2xl font-mono font-bold text-[#0ff]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-4 md:p-8 gap-8 z-10 w-full max-w-7xl mx-auto">
        
        {/* Left Side: Game */}
        <div className="flex-1 flex justify-center w-full">
          <SnakeGame onScoreChange={setScore} />
        </div>
        
        {/* Right Side: Player & Info */}
        <div className="w-full lg:w-96 flex flex-col space-y-8">
          <div className="bg-black border-2 border-[#0ff] p-5 relative glitch-box">
            <div className="absolute top-0 right-0 bg-[#0ff] text-black text-xs font-mono px-2 py-1">INFO.SYS</div>
            <h2 className="text-lg font-mono font-bold text-[#f0f] uppercase tracking-widest mb-4 mt-2">INITIATE_SEQUENCE</h2>
            <ul className="text-sm space-y-3 font-sans">
              <li className="flex items-start space-x-2">
                <span className="text-[#f0f] mt-1 text-xs">{'>'}</span>
                <span className="text-[#0ff]">Execute directional keystrokes [ARROWS].</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#f0f] mt-1 text-xs">{'>'}</span>
                <span className="text-[#0ff]">Consume anomalous data blocks.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#f0f] mt-1 text-xs">{'>'}</span>
                <span className="text-[#f0f] underline decoration-[#0ff]">AVOID HARDWARE BOUNDARIES.</span>
              </li>
            </ul>
          </div>
          
          <MusicPlayer />
        </div>
        
      </main>
      
      {/* Footer */}
      <footer className="p-4 text-center text-xs font-sans text-[#0ff]/50 z-10 border-t border-[#f0f]/30 bg-black">
        SYSTEM_DIAGNOSTICS_RUNNING // STATUS: ANOMALOUS // SEED: 0x9F42A
      </footer>
    </div>
  );
}
