import React from 'react';
import Link from 'next/link';
import { Home, Search, Library, PlusSquare, Heart } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-black flex flex-col gap-2 p-2 select-none">
      <div className="bg-neutral-900 rounded-lg p-4 flex flex-col gap-4">
        <Link href="/" className="flex items-center gap-4 text-neutral-400 hover:text-white font-semibold transition">
          <Home className="w-6 h-6" />
          <span>Home</span>
        </Link>
        <Link href="/search" className="flex items-center gap-4 text-neutral-400 hover:text-white font-semibold transition">
          <Search className="w-6 h-6" />
          <span>Search</span>
        </Link>
      </div>

      <div className="flex-1 bg-neutral-900 rounded-lg p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between text-neutral-400 hover:text-white transition">
          <Link href="/library" className="flex items-center gap-3 font-semibold">
            <Library className="w-6 h-6" />
            <span>Your Library</span>
          </Link>
          <button className="hover:text-white"><PlusSquare className="w-5 h-5" /></button>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <Link href="/playlist/liked" className="flex items-center gap-3 text-sm text-neutral-400 hover:text-white transition">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-600 to-blue-300 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-current" />
            </div>
            <span>Liked Songs</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};