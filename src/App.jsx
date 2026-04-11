import React, { useState, useEffect } from 'react';
import { Square, Volume2, Maximize, Play, Plus, X } from 'lucide-react';
import { globalAudio } from './audioManager';
import { saveCustomPad, getCustomPads } from './utils/db';

const PAD_CONFIG = [
  { id: '7', keyLabel: '7', code: 'Numpad7', url: '/sounds/7.mp3' },
  { id: '8', keyLabel: '8', code: 'Numpad8', url: '/sounds/8.mp3' },
  { id: '9', keyLabel: '9', code: 'Numpad9', url: '/sounds/9.mp3' },
  { id: '*', keyLabel: '*', code: 'NumpadMultiply', url: null },
  { id: '4', keyLabel: '4', code: 'Numpad4', url: '/sounds/4.mp3' },
  { id: '5', keyLabel: '5', code: 'Numpad5', url: '/sounds/5.mp3' },
  { id: '6', keyLabel: '6', code: 'Numpad6', url: '/sounds/6.mp3' },
  { id: '-', keyLabel: '-', code: 'NumpadSubtract', url: null },
  { id: '1', keyLabel: '1', code: 'Numpad1', url: '/sounds/1.mp3' },
  { id: '2', keyLabel: '2', code: 'Numpad2', url: '/sounds/2.mp3' },
  { id: '3', keyLabel: '3', code: 'Numpad3', url: '/sounds/3.mp3' },
  { id: '+', keyLabel: '+', code: 'NumpadAdd', url: null },
  { id: '%', keyLabel: '%', code: 'NumpadDivide', url: null }, // Maps mapped natively to divide
];

function App() {
  const [pads, setPads] = useState(PAD_CONFIG);
  const [activePad, setActivePad] = useState(null);
  const [playingUrls, setPlayingUrls] = useState([]);
  const [volume, setVolume] = useState(0.8);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadKeyId, setUploadKeyId] = useState('1');

  useEffect(() => {
    // Load custom pads from DB
    getCustomPads().then(customPads => {
      if (customPads && customPads.length > 0) {
        setPads(prevPads => {
          const newPads = [...prevPads];
          customPads.forEach(cp => {
            const index = newPads.findIndex(p => p.id === cp.id);
            if (index !== -1) {
              const objectUrl = URL.createObjectURL(cp.blob);
              newPads[index] = {
                ...newPads[index],
                name: cp.name,
                url: objectUrl,
                isCustom: true
              };
            }
          });
          return newPads;
        });
      }
    }).catch(err => console.error("Error loading custom pads", err));
  }, []);

  useEffect(() => {
    pads.forEach(pad => {
      if (pad.url) globalAudio.loadSound(pad.url);
    });
  }, [pads]);

  useEffect(() => {
    globalAudio.onActiveSourcesChanged = (urls) => {
      setPlayingUrls(urls);
    };
    return () => {
      globalAudio.onActiveSourcesChanged = null;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isModalOpen) return; // Disable hotkeys when modal is open
      const pad = pads.find(p => p.code === e.code || p.keyLabel === e.key); 
      if (pad) playPad(pad);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pads, isModalOpen]);

  const playPad = (pad) => {
    if (!pad.url) return;
    globalAudio.toggleSound(pad.url);
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

  const handleSaveCustomPad = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    try {
      await saveCustomPad(uploadKeyId, uploadName || `Pad ${uploadKeyId}`, uploadFile);
      const objectUrl = URL.createObjectURL(uploadFile);
      
      setPads(prev => prev.map(p => {
        if (p.id === uploadKeyId) {
           return { ...p, name: uploadName || `Pad ${uploadKeyId}`, url: objectUrl, isCustom: true };
        }
        return p;
      }));
      setIsModalOpen(false);
      setUploadName('');
      setUploadFile(null);
    } catch (error) {
      console.error("Save error", error);
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
            
            {/* Add Sound Button */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group bg-[#F2CC5D] hover:bg-[#d6b24b] text-[#251e06] font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors duration-300 md:mr-2 shadow-[0_0_15px_rgba(242,204,93,0.15)] hover:shadow-[0_0_20px_rgba(242,204,93,0.3)]"
            >
              <Plus size={18} />
              <span>Agregar Sonido</span>
            </button>

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
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 md:gap-6 max-w-[650px] mx-auto">
          {pads.map((pad) => {
            const isPlaying = pad.url && playingUrls.includes(pad.url);
            const isActive = activePad === pad.id || isPlaying;
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
                  <span className="absolute bottom-4 left-0 right-0 text-center text-xs uppercase tracking-widest text-[#484a4c] font-bold px-2 truncate">
                    {pad.name || 'Pad'}
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

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#191a1a] rounded-3xl w-full max-w-md shadow-2xl border border-[#2b2c2c] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#252626] flex justify-between items-center bg-[#131313]">
              <h2 className="text-xl font-bold text-[#fcf9f8]">Agregar nuevo sonido</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#acabaa] hover:text-white p-1 rounded-lg hover:bg-[#252626] transition-colors"
                title="Cerrar"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveCustomPad} className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#acabaa] mb-2 uppercase tracking-wide">
                    Archivo de audio
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#2b2c2c] rounded-2xl cursor-pointer bg-[#131313] hover:bg-[#1a1b1b] hover:border-[#F2CC5D] transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                      <Volume2 className="w-8 h-8 mb-3 text-[#5e5f62]" />
                      {uploadFile ? (
                        <p className="text-sm font-medium text-[#F2CC5D] truncate w-full max-w-[250px]">
                          {uploadFile.name}
                        </p>
                      ) : (
                        <p className="text-sm text-[#5e5f62]">
                          <span className="font-semibold text-[#acabaa]">Click para cargar</span> (MP3, WAV)
                        </p>
                      )}
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="audio/mpeg, audio/wav" 
                      onChange={(e) => setUploadFile(e.target.files[0])}
                      required
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#acabaa] mb-2 uppercase tracking-wide">
                    Nombre (opcional)
                  </label>
                  <input 
                    type="text" 
                    value={uploadName}
                    onChange={(e) => setUploadName(e.target.value)}
                    placeholder="Ej: Aplausos, Risa..."
                    className="w-full bg-[#131313] border border-[#2b2c2c] text-[#fcf9f8] rounded-xl px-4 py-3 outline-none focus:border-[#F2CC5D] transition-colors placeholder:text-[#484a4c]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#acabaa] mb-2 uppercase tracking-wide">
                    Asignar a Tecla (Numpad)
                  </label>
                  <select 
                    value={uploadKeyId}
                    onChange={(e) => setUploadKeyId(e.target.value)}
                    className="w-full bg-[#131313] border border-[#2b2c2c] text-[#fcf9f8] rounded-xl px-4 py-3 outline-none focus:border-[#F2CC5D] transition-colors appearance-none"
                  >
                    {['7','8','9','*','4','5','6','-','1','2','3','+','%'].map(num => (
                      <option key={num} value={num}>Tecla {num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8">
                <button 
                  type="submit"
                  disabled={!uploadFile}
                  className="w-full bg-[#F2CC5D] text-[#251e06] font-bold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d6b24b] shadow-[0_4px_15px_rgba(242,204,93,0.15)] hover:shadow-[0_4px_25px_rgba(242,204,93,0.3)] disabled:shadow-none"
                >
                  Guardar y Asignar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
