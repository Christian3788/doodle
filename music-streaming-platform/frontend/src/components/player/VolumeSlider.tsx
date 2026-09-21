'use client';

import React from 'react';
import { useAudioStore } from '@/stores/useAudioStore';
import { Volume2, VolumeX } from 'lucide-react';

export const VolumeSlider: React.FC = () => {
  const { volume, isMuted, setVolume, toggleMute } = useAudioStore();

  return (
    <div className="flex items-center gap-2">
      <button onClick={toggleMute} className="text-neutral-400 hover:text-white transition">
        {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={isMuted ? 0 : volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-24 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white hover:accent-green-500 transition"
      />
    </div>
  );
};