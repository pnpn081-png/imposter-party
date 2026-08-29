import { AvatarType, Role } from './game';

export interface HistoryPlayerRecord {
  id: string;
  name: string;
  avatar: AvatarType;
  role: Role;
  totalScore: number;
  roundScoreDelta?: number;
}

export interface GameHistoryRecord {
  id: string;
  timestamp: number;
  dateFormatted: string;
  mode: 'SINGLE' | 'MULTIPLE';
  modeLabel: string;
  roundNumber: number;
  categoryName: string;
  secretWord: string;
  winner: 'CREWMATES' | 'IMPOSTERS';
  imposterNames: string[];
  eliminatedPlayerName?: string;
  players: HistoryPlayerRecord[];
}
