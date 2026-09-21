'use client';

import React from 'react';
import { useAudioStore } from '@/stores/useAudioStore';
import { formatTime } from '@/lib/utils';

export const ProgressBar: React.FC = () => {
  const { progress, duration, seek } = useAudioStore();

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  return (
    <div className="w-full flex items-center gap-2 text-xs text-neutral-400 font-mono">
      <span className="w-10 text-right">{formatTime(progress)}</span>
      <input
        type="range"
        min={0}
        max={duration || 100}
        value={progress}
        onChange={handleSeek}
        className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white hover:accent-green-500 transition"
      />
      <span className="w-10">{formatTime(duration)}</span>
    </div>
  );
};