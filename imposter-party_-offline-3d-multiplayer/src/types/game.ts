export type Role = 'CREWMATE' | 'IMPOSTER';

export type AvatarType =
  | 'fox'
  | 'panda'
  | 'lion'
  | 'cat'
  | 'wolf'
  | 'bear'
  | 'owl'
  | 'rabbit'
  | 'tiger'
  | 'dragon'
  | 'shark'
  | 'eagle'
  | 'monkey'
  | 'raccoon'
  | 'frog'
  | 'penguin'
  | 'koala'
  | 'deer';

export type AvatarAnimationState = 'idle' | 'hold' | 'reveal' | 'eliminated' | 'winner';

export interface AvatarConfig {
  id: AvatarType;
  name: string;
  species: string;
  imageUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  glowColor: string;
  tagline: string;
}

export type GameMode = 'PASS_AND_PLAY' | 'LOCAL_WIFI_HOST' | 'LOCAL_WIFI_CLIENT';

export type GamePhase = 
  | 'MODE_SELECT'
  | 'SETUP'
  | 'PASS_PHONE'
  | 'HOLD_REVEAL'
  | 'CARD_CONFIRM'
  | 'DISCUSSION'
  | 'VOTING'
  | 'RESULTS'
  | 'LOBBY';

export interface Player {
  id: string;
  name: string;
  role: Role;
  secretWord: string;
  avatar: AvatarType;
  color: string;
  score?: number;
  roundScoreDelta?: number;
  isReady?: boolean;
  hasVoted?: boolean;
  votedForId?: string | null;
  isHost?: boolean;
  avatarSeed: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  words: string[];
}

export interface GameSettings {
  playerCount: number;
  imposterCount: number; // 1 or 2
  categoryId: string;
  discussionTimeSeconds: number; // 60 to 300
  showRoleHints: boolean; // Imposters get category hint
  allowPassSkip: boolean;
}

export interface GameState {
  mode: GameMode;
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  selectedCategory: Category;
  secretWord: string;
  imposterCount: number;
  timerSecondsLeft: number;
  isTimerRunning: boolean;
  eliminatedPlayerId?: string | null;
  winner?: 'CREWMATES' | 'IMPOSTERS' | null;
}

export interface NetworkPacket {
  type: 'LOBBY_UPDATE' | 'GAME_START' | 'PLAYER_ROLE' | 'TIMER_TICK' | 'PHASE_CHANGE' | 'VOTE_SUBMIT' | 'GAME_OVER';
  senderId: string;
  payload: any;
  timestamp: number;
}

