import { GameHistoryRecord } from '../types/history';

const HISTORY_STORAGE_KEY = 'imposter_party_game_history_v1';

const INITIAL_SEEDED_HISTORY: GameHistoryRecord[] = [
  {
    id: 'rec_seed_1',
    timestamp: Date.now() - 1000 * 60 * 18, // 18 mins ago
    dateFormatted: 'Today, 10:48 AM',
    mode: 'MULTIPLE',
    modeLabel: 'Multiple Player',
    roundNumber: 2,
    categoryName: 'Animals',
    secretWord: 'Giraffe',
    winner: 'CREWMATES',
    imposterNames: ['Player 2'],
    eliminatedPlayerName: 'Player 2',
    players: [
      { id: 'p1', name: 'Player 1', avatar: 'fox', role: 'CREWMATE', totalScore: 2, roundScoreDelta: 1 },
      { id: 'p2', name: 'Player 2', avatar: 'panda', role: 'IMPOSTER', totalScore: 0, roundScoreDelta: 0 },
      { id: 'p3', name: 'Player 3', avatar: 'wolf', role: 'CREWMATE', totalScore: 2, roundScoreDelta: 1 },
      { id: 'p4', name: 'Player 4', avatar: 'cat', role: 'CREWMATE', totalScore: 1, roundScoreDelta: 1 }
    ]
  },
  {
    id: 'rec_seed_2',
    timestamp: Date.now() - 1000 * 60 * 45, // 45 mins ago
    dateFormatted: 'Today, 10:21 AM',
    mode: 'SINGLE',
    modeLabel: 'Single Player',
    roundNumber: 1,
    categoryName: 'Food & Drinks',
    secretWord: 'Sushi',
    winner: 'IMPOSTERS',
    imposterNames: ['Player 3'],
    eliminatedPlayerName: 'Player 1',
    players: [
      { id: 'p1', name: 'Player 1', avatar: 'fox', role: 'CREWMATE', totalScore: 0, roundScoreDelta: 0 },
      { id: 'p2', name: 'Player 2', avatar: 'bear', role: 'CREWMATE', totalScore: 0, roundScoreDelta: 0 },
      { id: 'p3', name: 'Player 3', avatar: 'lion', role: 'IMPOSTER', totalScore: 1, roundScoreDelta: 1 },
      { id: 'p4', name: 'Player 4', avatar: 'rabbit', role: 'CREWMATE', totalScore: 0, roundScoreDelta: 0 }
    ]
  }
];

export function getGameHistory(): GameHistoryRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) {
      // Seed default items
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(INITIAL_SEEDED_HISTORY));
      return INITIAL_SEEDED_HISTORY;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SEEDED_HISTORY;
  } catch {
    return INITIAL_SEEDED_HISTORY;
  }
}

export function saveGameHistoryRecord(record: Omit<GameHistoryRecord, 'id' | 'timestamp' | 'dateFormatted'>): GameHistoryRecord {
  const current = getGameHistory();
  const now = new Date();
  
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateFormatted = `Today, ${timeString}`;

  const newRecord: GameHistoryRecord = {
    ...record,
    id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: Date.now(),
    dateFormatted
  };

  const updated = [newRecord, ...current].slice(0, 50); // Keep last 50 games
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  return newRecord;
}

export function clearGameHistory(): void {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([]));
  } catch {}
}
