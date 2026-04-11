import React, { useState, useEffect } from 'react';
import { Square, Volume2, Maximize, Play } from 'lucide-react';
import { globalAudio } from './audioManager';

const PAD_CONFIG = [
  { id: '7', keyLabel: '7', code: 'Numpad7', url: '/sounds/7.mp3' },
  { id: '8', keyLabel: '8', code: 'Numpad8', url: '/sounds/8.mp3' },
  { id: '9', keyLabel: '9', code: 'Numpad9', url: '/sounds/9.mp3' },
  { id: '4', keyLabel: '4', code: 'Numpad4', url: '/sounds/4.mp3' },
  { id: '5', keyLabel: '5', code: 'Numpad5', url: '/sounds/5.mp3' },
  { id: '6', keyLabel: '6', code: 'Numpad6', url: '/sounds/6.mp3' },
  { id: '1', keyLabel: '1', code: 'Numpad1', url: '/sounds/1.mp3' },
  { id: '2', keyLabel: '2', code: 'Numpad2', url: '/sounds/2.mp3' },
  { id: '3', keyLabel: '3', code: 'Numpad3', url: '/sounds/3.mp3' },
];

function App() {
  const [activePad, setActivePad] = useState(null);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    PAD_CONFIG.forEach(pad => globalAudio.loadSound(pad.url));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const pad = PAD_CONFIG.find(p => p.code === e.code || p.keyLabel === e.key); 
      if (pad) playPad(pad);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const playPad = (pad) => {
    globalAudio.playSound(pad.url);
    setActivePad(pad.id);
    setTimeout(() => setActivePad(null), 150);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex flex-col items-center justify-center p-6 text-[#e7e5e5] font-sans selection:bg-[#5C450B]">
      <div className="w-full max-w-4xl bg-[#191a1a] p-10 md:p-14 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.6)] border border-[#252626]">
        
        {/* Header - Editorial Style */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 pb-8 border-b border-[#252626]">
          <div className="flex items-center gap-6">
            <img src="/logo.jpg" alt="Sobre la Mesa Logo" className="w-24 h-24 md:w-32 md:h-32 object-contain filter drop-shadow-[0_0_15px_rgba(242,204,93,0.15)]" />
            <div className="hidden sm:block">
              <h1 className="text-4xl md:text-[2.75rem] font-medium tracking-tight text-[#fcf9f8] mb-2 font-serif">
                Sobre la Mesa
              </h1>
              <p className="text-[#F2CC5D] text-sm tracking-widest uppercase font-semibold">Studio Console</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-5 items-center">
            {/* Volume Control */}
            <div className="flex items-center gap-4 bg-[#131313] py-3 px-5 rounded-xl border border-[#252626]">
              <Volume2 size={18} className="text-[#5e5f62]" />
              <input 
                type="range" 
                min="0" max="1" step="0.01" 
                value={volume} 
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  globalAudio.setVolume(val);
                }}
                className="w-24 accent-[#F2CC5D] h-1.5 bg-[#252626] rounded-full appearance-none cursor-pointer"
              />
            </div>
            
            {/* Stop Button */}
            <button 
              onClick={() => globalAudio.stopAll()}
              className="group bg-[#131313] hover:bg-[#7f2927] text-[#acabaa] hover:text-[#ff9993] py-3 px-6 rounded-xl flex items-center gap-3 transition-colors duration-300 border border-[#252626] hover:border-[#bb5551]"
            >
              <Square fill="currentColor" size={14} className="group-hover:opacity-90" /> 
              <span className="font-semibold text-sm tracking-wide">Stop All</span>
            </button>
            
            {/* Fullscreen Button */}
            <button 
              onClick={toggleFullscreen}
              className="p-3.5 bg-[#131313] hover:bg-[#252626] text-[#acabaa] hover:text-[#fcf9f8] rounded-xl transition-colors border border-[#252626]"
              title="Toggle Fullscreen"
            >
              <Maximize size={18} />
            </button>
          </div>
        </header>

        {/* Pad Grid */}
        <div className="grid grid-cols-3 gap-6 md:gap-8 max-w-[500px] mx-auto">
          {PAD_CONFIG.map((pad) => {
            const isActive = activePad === pad.id;
            return (
              <button
                key={pad.id}
                onMouseDown={() => playPad(pad)}
                className={`
                  relative overflow-hidden aspect-square rounded-2xl flex flex-col items-center justify-center
                  transition-all duration-150 outline-none
                  ${isActive 
                    ? 'bg-[#F2CC5D] text-[#3D2E07] shadow-[inset_0_3px_8px_rgba(0,0,0,0.4)] scale-[0.96] border border-transparent' 
                    : 'bg-[#1f2020] text-[#e7e5e5] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] hover:bg-[#252626] border border-[#2b2c2c] shadow-lg'
                  }
                `}
              >
                <div className="flex flex-col items-center gap-4 z-10 pointer-events-none">
                   {isActive ? <Play size={28} className="opacity-90" /> : <Play size={28} className="text-[#5e5f62]" />}
                   <span className="font-bold text-2xl md:text-3xl font-mono tracking-tighter">
                     {pad.keyLabel}
                   </span>
                </div>
                
                {!isActive && (
                  <span className="absolute bottom-4 left-0 right-0 text-center text-[11px] uppercase tracking-widest text-[#484a4c] font-bold">
                    Pad
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-20 text-center">
          <p className="text-[#5e5f62] text-[11px] tracking-widest uppercase font-semibold">
            Use Numpad keys 1-9 to trigger sounds
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
