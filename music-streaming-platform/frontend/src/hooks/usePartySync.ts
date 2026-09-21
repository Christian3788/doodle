import { useEffect, useRef } from 'react';
import { useAudioStore } from '@/stores/useAudioStore';
import { PartyEvent } from '@/types/party';

export function usePartySync(roomId: string, userId: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const { seek, togglePlay, isPlaying, playTrack, queue } = useAudioStore();

  useEffect(() => {
    if (!roomId || !userId) return;

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws'}?roomId=${roomId}&userId=${userId}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data: PartyEvent = JSON.parse(event.data);
        const networkLagSec = (Date.now() - data.sentAt) / 1000;

        switch (data.type) {
          case 'PLAY':
            seek(data.position + networkLagSec);
            if (!isPlaying) togglePlay();
            break;
          case 'PAUSE':
            seek(data.position);
            if (isPlaying) togglePlay();
            break;
          case 'SEEK':
            seek(data.position + networkLagSec);
            break;
          case 'TRACK_CHANGE':
            if (data.trackId) {
              const target = queue.find((t) => t.id === data.trackId);
              if (target) playTrack(target);
            }
            break;
        }
      } catch (err) {
        console.error('Failed to parse party sync message', err);
      }
    };

    return () => {
      ws.close();
    };
  }, [roomId, userId, isPlaying, seek, togglePlay, playTrack, queue]);

  const broadcastEvent = (type: PartyEvent['type'], position: number, trackId?: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const payload: PartyEvent = {
        type,
        roomId,
        userId,
        trackId,
        position,
        sentAt: Date.now(),
      };
      wsRef.current.send(JSON.stringify(payload));
    }
  };

  return { broadcastEvent };
}