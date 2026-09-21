'use client';

import React from 'react';
import { useAudioStore } from '@/stores/useAudioStore';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1 
} from 'lucide-react';

export const PlayerControls: React.FC = () => {
  const { 
    isPlaying, 
    togglePlay, 
    nextTrack, 
    prevTrack, 
    isShuffle, 
    toggleShuffle, 
    repeatMode, 
    setRepeatMode 
  } = useAudioStore();

  const cycleRepeat = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  return (
    <div className="flex items-center gap-5">
      <button 
        onClick={toggleShuffle} 
        className={`transition-colors ${isShuffle ? 'text-green-500' : 'text-neutral-400 hover:text-white'}`}
        aria-label="Toggle Shuffle"
      >
        <Shuffle className="w-4 h-4" />
      </button>

      <button 
        onClick={prevTrack} 
        className="text-neutral-300 hover:text-white transition"
        aria-label="Previous Track"
      >
        <SkipBack className="w-5 h-5 fill-current" />
      </button>

      <button
        onClick={togglePlay}
        className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition text-black"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-black text-black" />
        ) : (
          <Play className="w-4 h-4 fill-black text-black ml-0.5" />
        )}
      </button>

      <button 
        onClick={nextTrack} 
        className="text-neutral-300 hover:text-white transition"
        aria-label="Next Track"
      >
        <SkipForward className="w-5 h-5 fill-current" />
      </button>

      <button 
        onClick={cycleRepeat} 
        className={`transition-colors ${repeatMode !== 'off' ? 'text-green-500' : 'text-neutral-400 hover:text-white'}`}
        aria-label="Repeat Mode"
      >
        {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
      </button>
    </div>
  );
};