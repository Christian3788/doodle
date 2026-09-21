export type PartyAction = 'PLAY' | 'PAUSE' | 'SEEK' | 'TRACK_CHANGE' | 'JOIN_ROOM';

export interface PartyEvent {
  type: PartyAction;
  roomId: string;
  userId: string;
  trackId?: string;
  position: number;
  sentAt: number;
}