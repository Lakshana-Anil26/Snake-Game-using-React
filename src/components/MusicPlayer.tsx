import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc } from 'lucide-react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
}

const PLAYLIST: Track[] = [
  {
    id: '1',
    title: 'VOID_RUNTIME',
    artist: 'ENTITY_01',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'MEM_LEAK',
    artist: 'ENTITY_02',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'BUFFER_UNDERRUN',
    artist: 'ENTITY_03',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const toggleMute = () => setIsMuted(!isMuted);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    handleNext();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const newTime = (percentage / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(percentage);
    }
  };

  return (
    <div className="flex flex-col bg-black border-2 border-[#f0f] p-4 w-full relative glitch-box">
      <div className="absolute top-0 left-0 bg-[#f0f] text-black text-xs font-mono px-2 py-1">AUDIO.EXE</div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
      
      {/* Track Info */}
      <div className="flex items-center space-x-4 mb-6 mt-6">
        <div className={`flex-shrink-0 w-12 h-12 border border-[#0ff] flex items-center justify-center ${isPlaying ? 'bg-[#0ff] text-black animate-[spin_3s_linear_infinite]' : 'bg-black text-[#0ff]'}`}>
          <Disc className="w-8 h-8" />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className={`font-mono font-bold truncate text-sm tracking-wide ${isPlaying ? 'text-[#f0f] glitch-text' : 'text-[#f0f]'}`} data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-[#0ff] text-xs truncate font-sans mt-1 opacity-80">
            AUTHOR: {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="w-full h-4 bg-black border border-[#0ff] mb-6 cursor-pointer relative"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-[#f0f] relative transition-none ease-linear"
          style={{ width: `${progress}%` }}
        />
        {/* Decorative ticks */}
        <div className="absolute inset-0 flex justify-between pointer-events-none opacity-30">
          {[...Array(10)].map((_, i) => (
             <div key={i} className="w-[1px] h-full bg-[#0ff]"></div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between border-t border-[#0ff]/50 pt-4">
        <button 
          onClick={toggleMute}
          className="p-2 text-[#0ff] border border-transparent hover:border-[#0ff] hover:bg-[#0ff] hover:text-black transition-colors focus:outline-none"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <div className="flex items-center space-x-2">
          <button 
            onClick={handlePrev}
            className="p-2 text-[#f0f] border border-transparent hover:border-[#f0f] hover:bg-[#f0f]/10 focus:outline-none active:scale-95"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center border-2 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-black transition-colors focus:outline-none active:scale-95"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
          
          <button 
            onClick={handleNext}
            className="p-2 text-[#f0f] border border-transparent hover:border-[#f0f] hover:bg-[#f0f]/10 focus:outline-none active:scale-95"
          >
            <SkipForward size={24} />
          </button>
        </div>
        
        {/* Placeholder for balance, keep symmetrical */}
        <div className="w-[40px]"></div>
      </div>
    </div>
  );
}
