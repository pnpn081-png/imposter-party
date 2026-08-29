import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Users, ShieldAlert, ArrowLeft, ArrowRight, Play, Check, RotateCcw,
  Sparkles, Plus, Minus, Volume2, Timer, Award, UserCheck, Flame, Palette, Eye
} from 'lucide-react';
import { GAME_CATEGORIES, DEFAULT_PLAYERS } from '../../data/categories';
import { GamePhase, Player, Category, Role, AvatarType } from '../../types/game';
import { AVATAR_PRESETS } from '../../data/avatars';
import { HoldToReveal } from '../HoldToReveal';
import { DiscussionTimer } from '../DiscussionTimer';
import { Avatar2D } from '../Avatar2D';
import { ScoreBoard, ScoreBoardPlayer } from '../ScoreBoard';
import { ConfirmDialog } from '../ConfirmDialog';
import { soundEffects } from '../../utils/audio';
import { saveGameHistoryRecord } from '../../utils/history';

import { PlayerProfileData } from '../profile/ProfileCreationScreen';

interface PassPlayFlowProps {
  onBackToHome: () => void;
  userProfile?: PlayerProfileData;
}

const DEFAULT_AVATARS: AvatarType[] = [
  'fox', 'panda', 'lion', 'tiger', 'cat', 'wolf',
  'bear', 'owl', 'rabbit', 'dragon', 'shark', 'eagle',
  'monkey', 'raccoon', 'frog', 'penguin', 'koala', 'deer'
];

export const PassPlayFlow: React.FC<PassPlayFlowProps> = ({ onBackToHome, userProfile }) => {
  // Settings State
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [imposterCount, setImposterCount] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<Category>(GAME_CATEGORIES[0]);
  const [playerNames, setPlayerNames] = useState<string[]>(() => {
    const names = [...DEFAULT_PLAYERS.slice(0, 4)];
    if (userProfile?.name) names[0] = userProfile.name;
    return names;
  });
  const [playerAvatars, setPlayerAvatars] = useState<AvatarType[]>(() => {
    const avs = [...DEFAULT_AVATARS.slice(0, 4)];
    if (userProfile?.avatar) avs[0] = userProfile.avatar;
    return avs;
  });
  const [showConfirmBack, setShowConfirmBack] = useState(false);
  const [editingAvatarIndex, setEditingAvatarIndex] = useState<number | null>(null);
  const [timerDuration, setTimerDuration] = useState<number>(180);

  // Round & Score State
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [scores, setScores] = useState<Record<number, number>>({});

  // Active Game State
  const [phase, setPhase] = useState<GamePhase>('SETUP');
  const [players, setPlayers] = useState<Player[]>([]);
  const [secretWord, setSecretWord] = useState<string>('');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [hasViewedCurrentCard, setHasViewedCurrentCard] = useState<boolean>(false);
  const [viewedToast, setViewedToast] = useState<{ name: string; avatar: AvatarType; index: number } | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(180);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [suspectedPlayerId, setSuspectedPlayerId] = useState<string | null>(null);
  const [eliminatedPlayer, setEliminatedPlayer] = useState<Player | null>(null);
  const [winner, setWinner] = useState<'CREWMATES' | 'IMPOSTERS' | null>(null);

  useEffect(() => {
    if (viewedToast) {
      const timer = setTimeout(() => {
        setViewedToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [viewedToast]);

  // Synchronize player names & avatars with count
  const handlePlayerCountChange = (newCount: number) => {
    const clamped = Math.max(3, Math.min(12, newCount));
    setPlayerCount(clamped);
    if (imposterCount === 2 && clamped < 6) {
      setImposterCount(1);
    }
    const current = [...playerNames];
    const currentAvs = [...playerAvatars];
    while (current.length < clamped) {
      current.push(DEFAULT_PLAYERS[current.length] || `Player ${current.length + 1}`);
      currentAvs.push(DEFAULT_AVATARS[currentAvs.length % DEFAULT_AVATARS.length]);
    }
    setPlayerNames(current.slice(0, clamped));
    setPlayerAvatars(currentAvs.slice(0, clamped));
  };

  const handleNameEdit = (index: number, name: string) => {
    const next = [...playerNames];
    next[index] = name;
    setPlayerNames(next);
  };

  const handleAvatarSelect = (index: number, av: AvatarType) => {
    soundEffects.playTap();
    const next = [...playerAvatars];
    next[index] = av;
    setPlayerAvatars(next);
    setEditingAvatarIndex(null);
  };

  // Start a fresh game session (Round 1)
  const startGame = () => {
    soundEffects.playTap();
    setRoundNumber(1);
    const initialScores: Record<number, number> = {};
    for (let i = 0; i < playerCount; i++) {
      initialScores[i] = 0;
    }
    setScores(initialScores);

    startRoundWithScores(1, initialScores);
  };

  // Internal helper to launch a specific round with scores
  const startRoundWithScores = (targetRound: number, currentScores: Record<number, number>) => {
    const word = selectedCategory.words[Math.floor(Math.random() * selectedCategory.words.length)];
    setSecretWord(word);

    // Pick random imposters
    const imposterIndices = new Set<number>();
    while (imposterIndices.size < imposterCount) {
      imposterIndices.add(Math.floor(Math.random() * playerCount));
    }

    const newPlayers: Player[] = playerNames.map((name, index) => {
      const isImposter = imposterIndices.has(index);
      const av = playerAvatars[index] || 'fox';
      return {
        id: `p_${index}`,
        name: name.trim() || `Player ${index + 1}`,
        role: isImposter ? 'IMPOSTER' : 'CREWMATE',
        secretWord: isImposter ? '' : word,
        avatar: av,
        color: AVATAR_PRESETS.find(a => a.id === av)?.primaryColor || '#00F0FF',
        avatarSeed: index,
        score: currentScores[index] || 0,
        roundScoreDelta: 0
      };
    });

    setPlayers(newPlayers);
    setRoundNumber(targetRound);
    setCurrentPlayerIndex(0);
    setHasViewedCurrentCard(false);
    setTimerSecondsLeft(timerDuration);
    setIsTimerRunning(false);
    setSuspectedPlayerId(null);
    setEliminatedPlayer(null);
    setWinner(null);
    setPhase('PASS_PHONE');
  };

  // Start Next Round while preserving scores and player customizations
  const handleNextRound = () => {
    startRoundWithScores(roundNumber + 1, scores);
  };

  // Reveal next player or move to discussion
  const handleNextPlayer = () => {
    soundEffects.playTap();
    if (currentPlayerIndex + 1 < players.length) {
      setCurrentPlayerIndex(prev => prev + 1);
      setHasViewedCurrentCard(false);
      setPhase('PASS_PHONE');
    } else {
      setPhase('DISCUSSION');
      setIsTimerRunning(true);
    }
  };

  // Discussion countdown loop
  useEffect(() => {
    let interval: any = null;
    if (phase === 'DISCUSSION' && isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [phase, isTimerRunning, timerSecondsLeft]);

  // Execute voting outcome and calculate scores
  const handleConfirmVote = () => {
    if (!suspectedPlayerId) return;
    soundEffects.playTap();

    const eliminated = players.find(p => p.id === suspectedPlayerId) || null;
    setEliminatedPlayer(eliminated);

    const wasImposter = eliminated?.role === 'IMPOSTER';
    const remainingImposters = players.filter(p => p.role === 'IMPOSTER' && p.id !== suspectedPlayerId);
    const imposterCaught = wasImposter && remainingImposters.length === 0;

    const outcome = imposterCaught ? 'CREWMATES' : 'IMPOSTERS';
    setWinner(outcome);

    // Calculate score updates based on rules:
    // - If Imposter is found: +1 point to all other (crewmate) players, imposter gets 0
    // - If Imposter is NOT found: +1 point to Imposter(s), other players get 0
    const updatedScores = { ...scores };
    const updatedPlayers = players.map((p, idx) => {
      let delta = 0;
      if (imposterCaught) {
        if (p.role === 'CREWMATE') {
          delta = 1;
        }
      } else {
        if (p.role === 'IMPOSTER') {
          delta = 1;
        }
      }

      const newTotal = (updatedScores[idx] || 0) + delta;
      updatedScores[idx] = newTotal;

      return {
        ...p,
        score: newTotal,
        roundScoreDelta: delta
      };
    });

    setScores(updatedScores);
    setPlayers(updatedPlayers);
    setPhase('RESULTS');

    // Save to history
    saveGameHistoryRecord({
      mode: 'SINGLE',
      modeLabel: 'Single Player',
      roundNumber: roundNumber,
      categoryName: selectedCategory.name,
      secretWord: secretWord,
      winner: outcome,
      imposterNames: players.filter(p => p.role === 'IMPOSTER').map(p => p.name),
      eliminatedPlayerName: eliminated?.name,
      players: updatedPlayers.map((p, idx) => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        role: p.role,
        totalScore: p.score || updatedScores[idx] || 0,
        roundScoreDelta: p.roundScoreDelta
      }))
    });

    // Trigger celebration effects
    soundEffects.playWinner();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  // RENDER PHASES

  // 1. SETUP PHASE WITH 2D AVATAR CUSTOMIZATION
  if (phase === 'SETUP') {
    return (
      <div className="flex-1 flex flex-col justify-between relative">
        <div className="flex-1 overflow-y-auto p-4 pb-32">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <button
              id="btn-passplay-back"
              onClick={() => {
                soundEffects.playTap();
                setShowConfirmBack(true);
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base font-black text-slate-100">Single Player</h2>
            </div>
          </div>

          {/* Player Count Stepper */}
          <div className="mb-3.5">
            <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mb-1">
              Player Count ({playerCount})
            </label>
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#161B22] border border-slate-800">
              <button
                id="btn-decrease-players"
                disabled={playerCount <= 3}
                onClick={() => handlePlayerCountChange(playerCount - 1)}
                className="w-8 h-8 rounded-xl bg-[#21262D] disabled:opacity-40 flex items-center justify-center text-cyan-400 font-bold"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <div className="text-center">
                <span className="text-xl font-black text-slate-100">{playerCount}</span>
                <span className="text-[11px] text-slate-400 ml-1 font-medium">Players</span>
              </div>
              <button
                id="btn-increase-players"
                disabled={playerCount >= 12}
                onClick={() => handlePlayerCountChange(playerCount + 1)}
                className="w-8 h-8 rounded-xl bg-[#21262D] disabled:opacity-40 flex items-center justify-center text-cyan-400 font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Imposter Count Selector */}
          <div className="mb-3.5">
            <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mb-1">
              Imposters
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2].map(count => {
                const isSelected = imposterCount === count;
                const isAvailable = count === 1 || playerCount >= 6;
                return (
                  <button
                    key={count}
                    id={`btn-imposter-${count}`}
                    disabled={!isAvailable}
                    onClick={() => setImposterCount(count)}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-rose-950/30 border-rose-500 text-rose-300 font-bold shadow-sm'
                        : isAvailable
                        ? 'bg-[#161B22] border-slate-800 text-slate-300 hover:border-slate-700'
                        : 'bg-[#161B22]/40 border-slate-800/40 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      {count} {count === 1 ? 'Imposter' : 'Imposters'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Selector */}
          <div className="mb-3.5">
            <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mb-1">
              Secret Word Category
            </label>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {GAME_CATEGORIES.map(cat => {
                const isSelected = selectedCategory.id === cat.id;
                return (
                  <button
                    key={cat.id}
                    id={`cat-${cat.id}`}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-[#161B22] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Player Profiles Customization */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
                Player Avatars & Names
              </label>
            </div>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {playerNames.map((name, idx) => {
                const currentAv = playerAvatars[idx] || 'fox';
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2 rounded-2xl bg-[#161B22] border border-slate-800"
                  >
                    {/* Avatar Selector button */}
                    <button
                      type="button"
                      onClick={() => setEditingAvatarIndex(editingAvatarIndex === idx ? null : idx)}
                      className="relative w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden hover:border-cyan-400 transition-colors flex-shrink-0"
                    >
                      <Avatar2D avatarType={currentAv} size={36} />
                    </button>

                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => handleNameEdit(idx, e.target.value)}
                        className="w-full bg-transparent text-xs text-slate-100 outline-none font-bold placeholder-slate-500"
                        placeholder={`Player ${idx + 1}`}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setEditingAvatarIndex(editingAvatarIndex === idx ? null : idx)}
                      className="p-1.5 rounded-lg bg-[#21262D] text-cyan-400 hover:text-cyan-300"
                    >
                      <Palette className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Avatar Selector Drawer Modal if opened */}
            {editingAvatarIndex !== null && (
              <div className="mt-2.5 p-3 rounded-2xl bg-[#0D1117] border border-cyan-500/40 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-cyan-300">
                    Choose Avatar for {playerNames[editingAvatarIndex]}:
                  </span>
                  <button
                    onClick={() => setEditingAvatarIndex(null)}
                    className="text-[10px] text-slate-400 hover:text-slate-200"
                  >
                    Done
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                  {AVATAR_PRESETS.map(av => (
                    <button
                      key={av.id}
                      onClick={() => handleAvatarSelect(editingAvatarIndex, av.id)}
                      className={`p-1.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        playerAvatars[editingAvatarIndex] === av.id
                          ? 'bg-cyan-500/20 border-cyan-400 shadow-md'
                          : 'bg-[#161B22] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <Avatar2D avatarType={av.id} size={38} />
                      <span className="text-[9px] font-bold text-slate-300 mt-1 truncate w-full text-center">
                        {av.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Start Game Action */}
        <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-[#0D1117] via-[#0D1117] to-transparent pt-12">
          <button
            id="btn-start-passplay"
            onClick={startGame}
            className="w-full py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs tracking-wide shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 uppercase"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            START GAME
          </button>
        </div>

        <ConfirmDialog
          isOpen={showConfirmBack}
          message="Are you sure you want to return to the main menu?"
          onConfirm={() => {
            setShowConfirmBack(false);
            onBackToHome();
          }}
          onCancel={() => setShowConfirmBack(false)}
        />
      </div>
    );
  }

  // 2. PASS PHONE / REVEAL PHASE
  if (phase === 'PASS_PHONE' || phase === 'HOLD_REVEAL') {
    const current = players[currentPlayerIndex];
    const progressPercent = ((currentPlayerIndex + 1) / players.length) * 100;

    return (
      <div className="flex-1 flex flex-col justify-between p-4 relative">
        {/* Top Pop-Up Notification when Player Views Card */}
        <AnimatePresence>
          {viewedToast && (
            <motion.div
              key={`toast-passplay-${viewedToast.index}`}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="mb-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-950/95 via-slate-900/95 to-emerald-950/95 border border-emerald-500/50 shadow-xl shadow-emerald-950/60 backdrop-blur-md flex items-center justify-between gap-3 text-xs z-30"
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Avatar2D avatarType={viewedToast.avatar} size={28} status="crewmate" />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[8px] font-black text-slate-950">
                    ✓
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-slate-100">{viewedToast.name}</span>
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-500/30">
                      Card Viewed ✓
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    {currentPlayerIndex + 1}/{players.length} confirmed
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                <Eye className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          {/* Header & Step progress */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-400">
              Player {currentPlayerIndex + 1} of {players.length}
            </span>
            <span className="text-xs font-bold text-slate-400">
              Round {roundNumber}
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Pass to Prompt */}
          <div className="text-center mb-2">
            <h2 className="text-xl font-black text-slate-100">{current.name}</h2>
          </div>
        </div>

        {/* Hold to Reveal Card with animal avatar */}
        <HoldToReveal
          playerName={current.name}
          role={current.role}
          secretWord={current.secretWord}
          categoryName={selectedCategory.name}
          avatarType={current.avatar}
          onRevealedChange={(isRev) => {
            if (isRev) {
              setHasViewedCurrentCard(true);
              setViewedToast({
                name: current.name,
                avatar: current.avatar,
                index: currentPlayerIndex
              });
            }
          }}
        />

        {/* Done / Next Player button activated only after viewing */}
        <div className="w-full mt-3">
          <button
            id="btn-next-player-reveal"
            disabled={!hasViewedCurrentCard}
            onClick={handleNextPlayer}
            className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
              hasViewedCurrentCard
                ? 'bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 shadow-xl shadow-cyan-500/25 active:scale-[0.98]'
                : 'bg-[#161B22] border border-slate-800 text-slate-500 cursor-not-allowed opacity-50'
            }`}
          >
            {currentPlayerIndex + 1 < players.length ? (
              <>
                <Check className={`w-4 h-4 ${hasViewedCurrentCard ? 'text-slate-950' : 'text-slate-600'}`} />
                <span>NEXT PLAYER</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Check className={`w-4 h-4 ${hasViewedCurrentCard ? 'text-slate-950' : 'text-slate-600'}`} />
                <span>START DISCUSSION</span>
              </>
            )}
          </button>

          {!hasViewedCurrentCard && (
            <p className="text-[10px] text-center text-slate-500 font-medium mt-1.5 animate-pulse">
              Hold card to view role
            </p>
          )}
        </div>
      </div>
    );
  }

  // 3. DISCUSSION PHASE
  if (phase === 'DISCUSSION') {
    return (
      <div className="flex-1 flex flex-col justify-between relative">
        <div className="flex-1 overflow-y-auto p-4 pb-32 text-center">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase">
              Discussion
            </span>
            <h2 className="text-lg font-black text-slate-100 mt-0.5">Find the Imposter</h2>
          </div>

          {/* Animated Countdown Timer */}
          <DiscussionTimer
            totalSeconds={timerDuration}
            secondsLeft={timerSecondsLeft}
            isRunning={isTimerRunning}
            onToggleRun={() => setIsTimerRunning(!isTimerRunning)}
            onAddSeconds={(sec) => setTimerSecondsLeft(prev => prev + sec)}
          />
        </div>

        {/* Emergency Vote trigger button */}
        <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-[#0D1117] via-[#0D1117] to-transparent pt-12">
          <button
            id="btn-call-emergency-vote"
            onClick={() => {
              soundEffects.playTap();
              setIsTimerRunning(false);
              setPhase('VOTING');
            }}
            className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-slate-100 font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-950/40 transition-all flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            CALL VOTE
          </button>
        </div>
      </div>
    );
  }

  // 4. VOTING PHASE
  if (phase === 'VOTING') {
    return (
      <div className="flex-1 flex flex-col justify-between relative">
        <div className="flex-1 overflow-y-auto p-4 pb-32">
          <div className="text-center mb-3">
            <span className="text-[10px] font-bold tracking-[0.2em] text-rose-400 uppercase">
              Voting
            </span>
            <h2 className="text-lg font-black text-slate-100 mt-0.5">Vote For The Imposter</h2>
          </div>

          {/* Suspect Selection Grid */}
          <div className="grid grid-cols-2 gap-2 pr-1">
            {players.map(p => {
              const isSelected = suspectedPlayerId === p.id;
              return (
                <button
                  key={p.id}
                  id={`vote-player-${p.id}`}
                  onClick={() => {
                    soundEffects.playTap();
                    setSuspectedPlayerId(p.id);
                  }}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-500 text-rose-300 shadow-md shadow-rose-950/40 scale-[1.02]'
                      : 'bg-[#161B22] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <Avatar2D
                    avatarType={p.avatar}
                    size={48}
                    status={isSelected ? 'selected' : 'normal'}
                  />
                  <span className="text-xs font-bold text-slate-100 mt-1.5">{p.name}</span>
                  {isSelected && (
                    <span className="text-[9px] font-black text-rose-400 tracking-wider uppercase mt-0.5">
                      VOTED ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Confirm Elimination */}
        <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-[#0D1117] via-[#0D1117] to-transparent pt-12">
          <button
            id="btn-confirm-vote"
            disabled={!suspectedPlayerId}
            onClick={handleConfirmVote}
            className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-slate-100 font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-950/40 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            CONFIRM VOTE
          </button>
        </div>
      </div>
    );
  }

  // 5. RESULTS & REVEAL PHASE WITH SCOREBOARD
  if (phase === 'RESULTS') {
    const wasImposter = eliminatedPlayer?.role === 'IMPOSTER';
    const remainingImposters = players.filter(p => p.role === 'IMPOSTER' && p.id !== suspectedPlayerId);
    const imposterCaught = wasImposter && remainingImposters.length === 0;

    const imposterNames = players.filter(p => p.role === 'IMPOSTER').map(p => p.name);

    const scoreBoardPlayers: ScoreBoardPlayer[] = players.map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      role: p.role,
      totalScore: p.score || 0,
      roundScoreDelta: p.roundScoreDelta || 0
    }));

    return (
      <ScoreBoard
        roundNumber={roundNumber}
        players={scoreBoardPlayers}
        imposterFound={imposterCaught}
        imposterNames={imposterNames}
        eliminatedPlayerName={eliminatedPlayer?.name}
        secretWord={secretWord}
        categoryName={selectedCategory.name}
        onNextRound={handleNextRound}
        onExitGame={onBackToHome}
      />
    );
  }

  return null;
};
