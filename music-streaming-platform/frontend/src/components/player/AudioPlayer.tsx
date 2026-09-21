'use client';

import React, { useEffect } from 'react';
import { useAudioStore } from '@/stores/useAudioStore';
import { PlayerControls } from './PlayerControls';
import { ProgressBar } from './ProgressBar';
import { VolumeSlider } from './VolumeSlider';
import { TrackInfo } from './TrackInfo';

export const AudioPlayer: React.FC = () => {
  const { initAudio, currentTrack } = useAudioStore();

  useEffect(() => {
    initAudio();
  }, [initAudio]);

  if (!currentTrack) return null;

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-24 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800/60 px-4 flex items-center justify-between z-50 select-none">
      <div className="w-1/4 min-w-[200px]">
        <TrackInfo track={currentTrack} />
      </div>

      <div className="flex flex-col items-center max-w-2xl w-2/4 px-4 gap-1.5">
        <PlayerControls />
        <ProgressBar />
      </div>

      <div className="w-1/4 min-w-[180px] flex justify-end">
        <VolumeSlider />
      </div>
    </footer>
  );
};