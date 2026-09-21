export interface Track {
  id: string;
  title: string;
  durationSec: number;
  audioKey: string;
  streamUrl: string;
  artist: {
    id: string;
    name: string;
  };
  album: {
    id: string;
    title: string;
    coverUrl: string;
  };
  isLiked?: boolean;
}

export type RepeatMode = 'off' | 'all' | 'one';