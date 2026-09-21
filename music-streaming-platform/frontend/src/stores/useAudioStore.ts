import { create } from 'zustand';
import { Track, RepeatMode } from '@/types/audio';

interface AudioStore {
  audio: HTMLAudioElement | null;
  currentTrack: Track | null;
  queue: Track[];
  originalQueue: Track[];
  history: Track[];
  isPlaying: boolean;
  isBuffering: boolean;
  progress: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  isShuffle: boolean;

  initAudio: () => void;
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  toggleShuffle: () => void;
  reorderQueue: (newQueue: Track[]) => void;
}

const shuffle = <T>(arr: T[]): T[] => {
  const c = [...arr];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
};

export const useAudioStore = create<AudioStore>((set, get) => ({
  audio: null,
  currentTrack: null,
  queue: [],
  originalQueue: [],
  history: [],
  isPlaying: false,
  isBuffering: false,
  progress: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,
  repeatMode: 'off',
  isShuffle: false,

  initAudio: () => {
    if (typeof window === 'undefined' || get().audio) return;
    const a = new Audio();
    a.preload = 'metadata';

    a.addEventListener('timeupdate', () => set({ progress: a.currentTime }));
    a.addEventListener('durationchange', () => set({ duration: a.duration || 0 }));
    a.addEventListener('waiting', () => set({ isBuffering: true }));
    a.addEventListener('canplaythrough', () => set({ isBuffering: false }));
    a.addEventListener('ended', () => {
      const { repeatMode, nextTrack } = get();
      if (repeatMode === 'one') {
        a.currentTime = 0;
        a.play().catch(console.error);
      } else {
        nextTrack();
      }
    });

    set({ audio: a });
  },

  playTrack: (track, newQueue) => {
    const { audio, currentTrack, history } = get();
    if (!audio) return;

    if (currentTrack) set({ history: [currentTrack, ...history] });
    if (newQueue) set({ queue: newQueue, originalQueue: newQueue });

    audio.src = track.streamUrl;
    audio.currentTime = 0;
    audio.play().then(() => {
      set({ currentTrack: track, isPlaying: true, isBuffering: false });
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.title,
          artist: track.artist.name,
          album: track.album.title,
          artwork: [{ src: track.album.coverUrl, sizes: '512x512', type: 'image/jpeg' }],
        });
      }
    }).catch(() => set({ isPlaying: false }));
  },

  togglePlay: () => {
    const { audio, isPlaying } = get();
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      set({ isPlaying: false });
    } else {
      audio.play().then(() => set({ isPlaying: true })).catch(console.error);
    }
  },

  seek: (seconds) => {
    const { audio } = get();
    if (!audio) return;
    audio.currentTime = seconds;
    set({ progress: seconds });
  },

  setVolume: (val) => {
    const { audio } = get();
    if (!audio) return;
    const c = Math.max(0, Math.min(1, val));
    audio.volume = c;
    set({ volume: c, isMuted: c === 0 });
  },

  toggleMute: () => {
    const { audio, isMuted, volume } = get();
    if (!audio) return;
    audio.muted = !isMuted;
    set({ isMuted: !isMuted });
  },

  nextTrack: () => {
    const { queue, repeatMode, originalQueue, playTrack } = get();
    if (queue.length === 0) {
      if (repeatMode === 'all' && originalQueue.length > 0) {
        set({ queue: [...originalQueue] });
        playTrack(originalQueue[0]);
      } else {
        set({ isPlaying: false, progress: 0 });
      }
      return;
    }
    const [next, ...rest] = queue;
    set({ queue: rest });
    playTrack(next);
  },

  prevTrack: () => {
    const { audio, history, playTrack } = get();
    if (!audio) return;
    if (audio.currentTime > 3 || history.length === 0) {
      audio.currentTime = 0;
      set({ progress: 0 });
      return;
    }
    const [prev, ...rest] = history;
    set({ history: rest });
    playTrack(prev);
  },

  setRepeatMode: (mode) => set({ repeatMode: mode }),

  toggleShuffle: () => {
    const { isShuffle, queue, originalQueue } = get();
    set({
      isShuffle: !isShuffle,
      queue: !isShuffle ? shuffle(queue) : [...originalQueue],
    });
  },

  reorderQueue: (newQueue) => set({ queue: newQueue }),
}));