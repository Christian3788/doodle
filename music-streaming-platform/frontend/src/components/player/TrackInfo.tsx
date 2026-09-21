import React from 'react';
import { Track } from '@/types/audio';
import { Heart } from 'lucide-react';

export const TrackInfo: React.FC<{ track: Track }> = ({ track }) => {
  return (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={track.album.coverUrl}
        alt={track.title}
        className="w-14 h-14 rounded-md object-cover border border-neutral-800"
      />
      <div className="flex flex-col truncate">
        <span className="text-sm font-medium text-white truncate hover:underline cursor-pointer">
          {track.title}
        </span>
        <span className="text-xs text-neutral-400 truncate hover:underline cursor-pointer">
          {track.artist.name}
        </span>
      </div>
      <button className="ml-2 text-neutral-400 hover:text-green-500 transition">
        <Heart className="w-4 h-4" />
      </button>
    </div>
  );
};