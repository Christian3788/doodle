import React from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { AudioPlayer } from '@/components/player/AudioPlayer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 bg-gradient-to-b from-neutral-900 to-black rounded-lg m-2 ml-0 overflow-y-auto pb-28">
          {children}
        </main>
      </div>
      <AudioPlayer />
    </div>
  );
}