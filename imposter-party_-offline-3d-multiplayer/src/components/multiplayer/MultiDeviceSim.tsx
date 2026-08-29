import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wifi, Smartphone, ArrowLeft, Play, ShieldAlert, Check, Plus,
  Radio, Users, Vote, CheckCircle2, AlertCircle, Eye
} from 'lucide-react';
import { GAME_CATEGORIES } from '../../data/categories';
import { Category, Role, AvatarType } from '../../types/game';
import { HoldToReveal } from '../HoldToReveal';
import { DiscussionTimer } from '../DiscussionTimer';
import { GroupDiscussionChat } from './GroupDiscussionChat';
import { Avatar2D } from '../Avatar2D';
import { ScoreBoard } from '../ScoreBoard';
import { soundEffects } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { PlayerProfileData } from '../profile/ProfileCreationScreen';
import { saveGameHistoryRecord } from '../../utils/history';
import { ConfirmDialog } from '../ConfirmDialog';

interface VirtualPhone {
  id: string;
  name: string;
  avatar: AvatarType;
  isHost: boolean;
  role: Role;
  secretWord: string;
  categoryName: string;
  hasVoted: boolean;
  votedForId: string | null;
  score?: number;
  roundScoreDelta?: number;
}

interface MultiDeviceSimProps {
  onBackToHome: () => void;
  userProfile?: PlayerProfileData;
}

export const MultiDeviceSim: React.FC<MultiDeviceSimProps> = ({ onBackToHome, userProfile }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(GAME_CATEGORIES[0]);
  const [gamePhase, setGamePhase] = useState<'LOBBY' | 'PLAYING' | 'DISCUSSION' | 'VOTING' | 'RESULTS'>('LOBBY');
  const [roundNumber, setRoundNumber] = useState<number>(1);
  
  // Connected phones
  const [phones, setPhones] = useState<VirtualPhone[]>(() => [
    {
      id: 'phone_host',
      name: `${userProfile?.name || 'Player 1'} (Host)`,
      avatar: userProfile?.avatar || 'fox',
      isHost: true,
      role: 'CREWMATE',
      secretWord: '',
      categoryName: '',
      hasVoted: false,
      votedForId: null,
      score: 0,
      roundScoreDelta: 0
    },
    { id: 'phone_2', name: 'Player 2', avatar: 'panda', isHost: false, role: 'CREWMATE', secretWord: '', categoryName: '', hasVoted: false, votedForId: null, score: 0, roundScoreDelta: 0 },
    { id: 'phone_3', name: 'Player 3', avatar: 'wolf', isHost: false, role: 'CREWMATE', secretWord: '', categoryName: '', hasVoted: false, votedForId: null, score: 0, roundScoreDelta: 0 },
    { id: 'phone_4', name: 'Player 4', avatar: 'cat', isHost: false, role: 'CREWMATE', secretWord: '', categoryName: '', hasVoted: false, votedForId: null, score: 0, roundScoreDelta: 0 }
  ]);

  const [activePhoneIndex, setActivePhoneIndex] = useState<number>(0);
  const [viewedPhoneIds, setViewedPhoneIds] = useState<Set<string>>(new Set());
  const [viewedToast, setViewedToast] = useState<{ id: string; name: string; avatar: AvatarType; count: number } | null>(null);
  const [secretWord, setSecretWord] = useState<string>('');
  const [timerSeconds, setTimerSeconds] = useState<number>(180);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [eliminatedPhone, setEliminatedPhone] = useState<VirtualPhone | null>(null);
  const [winner, setWinner] = useState<'CREWMATES' | 'IMPOSTERS' | null>(null);
  const [showConfirmBack, setShowConfirmBack] = useState(false);

  const activePhone = phones[activePhoneIndex] || phones[0];

  useEffect(() => {
    if (viewedToast) {
      const timer = setTimeout(() => {
        setViewedToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [viewedToast]);

  const handleAddClientPhone = () => {
    if (phones.length >= 10) return;
    const avs: AvatarType[] = ['bear', 'owl', 'rabbit', 'lion', 'fox', 'panda', 'tiger', 'dragon', 'shark', 'eagle'];
    const newIdx = phones.length;
    const randomName = `Player ${newIdx + 1}`;
    const randomAv = avs[newIdx % avs.length];
    const newPhone: VirtualPhone = {
      id: `phone_${Date.now()}`,
      name: randomName,
      avatar: randomAv,
      isHost: false,
      role: 'CREWMATE',
      secretWord: '',
      categoryName: '',
      hasVoted: false,
      votedForId: null,
      score: 0,
      roundScoreDelta: 0
    };

    setPhones(prev => [...prev, newPhone]);
    soundEffects.playTap();
  };

  const handleStartNetworkGame = () => {
    if (phones.length < 3) return;
    soundEffects.playTap();
    setRoundNumber(1);
    const resetPhones = phones.map(p => ({ ...p, score: 0, roundScoreDelta: 0 }));
    launchRound(1, resetPhones);
  };

  const launchRound = (targetRound: number, currentPhones: VirtualPhone[]) => {
    const word = selectedCategory.words[Math.floor(Math.random() * selectedCategory.words.length)];
    setSecretWord(word);

    const imposterIdx = Math.floor(Math.random() * currentPhones.length);
    const updated = currentPhones.map((p, idx) => {
      const isImp = idx === imposterIdx;
      return {
        ...p,
        role: (isImp ? 'IMPOSTER' : 'CREWMATE') as Role,
        secretWord: isImp ? '' : word,
        categoryName: selectedCategory.name,
        hasVoted: false,
        votedForId: null,
        roundScoreDelta: 0
      };
    });

    setPhones(updated);
    setViewedPhoneIds(new Set());
    setRoundNumber(targetRound);
    setGamePhase('PLAYING');
    setEliminatedPhone(null);
    setWinner(null);
    setActivePhoneIndex(0);
    setTimerSeconds(180);
    setIsTimerRunning(false);
  };

  const handleNextRound = () => {
    launchRound(roundNumber + 1, phones);
  };

  const handleVote = (suspectId: string) => {
    soundEffects.playTap();
    setPhones(prev => prev.map((p, idx) => {
      if (idx === activePhoneIndex) {
        return { ...p, hasVoted: true, votedForId: suspectId };
      }
      return p;
    }));
  };

  const handleTallyVotes = () => {
    soundEffects.playTap();
    const voteCounts: { [key: string]: number } = {};

    const resolvedPhones = phones.map(p => {
      if (p.hasVoted && p.votedForId) return p;
      const otherPhones = phones.filter(other => other.id !== p.id);
      const fallbackTarget = otherPhones[Math.floor(Math.random() * otherPhones.length)] || phones[0];
      return { ...p, hasVoted: true, votedForId: fallbackTarget.id };
    });

    resolvedPhones.forEach(p => {
      const vote = p.votedForId!;
      voteCounts[vote] = (voteCounts[vote] || 0) + 1;
    });

    let highestId = resolvedPhones[0].id;
    let maxVotes = -1;
    Object.entries(voteCounts).forEach(([id, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        highestId = id;
      }
    });

    const eliminated = resolvedPhones.find(p => p.id === highestId) || resolvedPhones[0];
    setEliminatedPhone(eliminated);

    const isImp = eliminated.role === 'IMPOSTER';
    setWinner(isImp ? 'CREWMATES' : 'IMPOSTERS');

    const updatedPhones = resolvedPhones.map(p => {
      let delta = 0;
      if (isImp) {
        if (p.role === 'CREWMATE') {
          delta = 1;
        }
      } else {
        if (p.role === 'IMPOSTER') {
          delta = 1;
        }
      }
      const newScore = (p.score || 0) + delta;
      return {
        ...p,
        score: newScore,
        roundScoreDelta: delta
      };
    });

    setPhones(updatedPhones);
    setGamePhase('RESULTS');

    // Save history record
    saveGameHistoryRecord({
      mode: 'MULTIPLE',
      modeLabel: 'Multiple Player',
      roundNumber: roundNumber,
      categoryName: selectedCategory?.name || 'Random',
      secretWord: secretWord,
      winner: isImp ? 'CREWMATES' : 'IMPOSTERS',
      imposterNames: updatedPhones.filter(p => p.role === 'IMPOSTER').map(p => p.name),
      eliminatedPlayerName: eliminated.name,
      players: updatedPhones.map(p => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        role: p.role,
        totalScore: p.score || 0,
        roundScoreDelta: p.roundScoreDelta
      }))
    });

    soundEffects.playWinner();

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  const currentVoteCounts: { [suspectId: string]: { count: number; voters: VirtualPhone[] } } = {};
  phones.forEach(p => {
    if (p.hasVoted && p.votedForId) {
      if (!currentVoteCounts[p.votedForId]) {
        currentVoteCounts[p.votedForId] = { count: 0, voters: [] };
      }
      currentVoteCounts[p.votedForId].count += 1;
      currentVoteCounts[p.votedForId].voters.push(p);
    }
  });

  const totalVotesCast = phones.filter(p => p.hasVoted).length;
  const allPhonesViewed = viewedPhoneIds.size === phones.length;

  return (
    <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto relative">
      {/* Top Pop-Up Notification when Player Views Card */}
      <AnimatePresence>
        {viewedToast && (
          <motion.div
            key={`toast-${viewedToast.id}-${viewedToast.count}`}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="mb-3 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-950/95 via-slate-900/95 to-emerald-950/95 border border-emerald-500/50 shadow-xl shadow-emerald-950/60 backdrop-blur-md flex items-center justify-between gap-3 text-xs z-30"
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
                  {viewedToast.count}/{phones.length} ready
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
              <Eye className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              id="btn-multiplayer-back"
              onClick={() => setShowConfirmBack(true)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-sm font-black text-slate-100 flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-purple-400" />
                Multiple Player
              </h2>
              <span className="text-[10px] text-slate-400 font-medium">
                Round {roundNumber}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] font-bold text-purple-300">
            <Users className="w-3 h-3 text-purple-400" />
            <span>{phones.length} Players</span>
          </div>
        </div>

        {/* Device Switcher Strip */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {gamePhase === 'PLAYING'
                ? `Active Device (${viewedPhoneIds.size}/${phones.length} Ready)`
                : gamePhase === 'VOTING'
                ? `Active Device (${totalVotesCast}/${phones.length} Voted)`
                : 'Players'}
            </span>
            {gamePhase === 'LOBBY' && phones.length < 10 && (
              <button
                id="btn-add-client-phone"
                onClick={handleAddClientPhone}
                className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Player
              </button>
            )}
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {phones.map((phone, idx) => {
              const isActive = activePhoneIndex === idx;
              const hasViewed = viewedPhoneIds.has(phone.id);
              const hasVoted = phone.hasVoted;

              return (
                <button
                  key={phone.id}
                  id={`tab-phone-${idx}`}
                  onClick={() => {
                    soundEffects.playTap();
                    setActivePhoneIndex(idx);
                  }}
                  className={`flex-shrink-0 px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                      : 'bg-[#161B22] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{phone.name.split("'s")[0] || `Player ${idx + 1}`}</span>

                  {gamePhase === 'PLAYING' && (
                    hasViewed ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    )
                  )}

                  {gamePhase === 'VOTING' && (
                    hasVoted ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                    )
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 1. LOBBY PHASE */}
      {gamePhase === 'LOBBY' && (
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            {/* Category selection */}
            <div className="mb-4">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mb-1.5">
                Category
              </label>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {GAME_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex-shrink-0 transition-all ${
                      selectedCategory.id === cat.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-[#161B22] border-slate-800 text-slate-400'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Connected players list */}
            <div className="mb-3">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mb-1.5">
                Players ({phones.length})
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {phones.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#161B22] border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar2D avatarType={p.avatar} size={28} />
                      <span className="font-semibold text-slate-200">{p.name}</span>
                    </div>
                    {p.isHost && (
                      <span className="text-[9px] font-black bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">
                        HOST
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Start button */}
          <button
            id="btn-start-network-game"
            onClick={handleStartNetworkGame}
            className="w-full py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wide shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            START GAME
          </button>
        </div>
      )}

      {/* 2. PLAYING / REVEAL PHASE */}
      {gamePhase === 'PLAYING' && (() => {
        const hasViewedActiveCard = viewedPhoneIds.has(activePhone.id);
        const allPlayersViewed = viewedPhoneIds.size === phones.length && phones.length > 0;
        const remainingCount = phones.length - viewedPhoneIds.size;

        return (
          <div className="flex-1 flex flex-col justify-between py-1">
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-xs font-bold text-slate-200">
                {activePhone.name}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  hasViewedActiveCard
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                {hasViewedActiveCard ? 'Viewed ✓' : 'Hold to View'}
              </span>
            </div>

            {/* Hold to reveal card */}
            <HoldToReveal
              playerName={activePhone.name}
              role={activePhone.role}
              secretWord={activePhone.secretWord}
              avatarType={activePhone.avatar}
              onRevealedChange={(isRev) => {
                if (isRev) {
                  setViewedPhoneIds(prev => {
                    const next = new Set([...prev, activePhone.id]);
                    setViewedToast({
                      id: activePhone.id,
                      name: activePhone.name,
                      avatar: activePhone.avatar,
                      count: next.size
                    });
                    return next;
                  });
                }
              }}
            />

            {/* Discussion Button */}
            <div className="w-full mt-2">
              <button
                id="btn-network-to-discussion"
                disabled={!allPlayersViewed}
                onClick={() => {
                  soundEffects.playTap();
                  setGamePhase('DISCUSSION');
                  setIsTimerRunning(true);
                }}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                  allPlayersViewed
                    ? 'bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 shadow-xl shadow-cyan-500/25 active:scale-[0.98]'
                    : 'bg-[#161B22] border border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <Check className={`w-4 h-4 ${allPlayersViewed ? 'text-slate-950' : 'text-slate-600'}`} />
                <span>
                  {allPlayersViewed
                    ? 'START DISCUSSION'
                    : `START DISCUSSION (${viewedPhoneIds.size}/${phones.length})`}
                </span>
              </button>

              {!allPlayersViewed && (
                <p className="text-[10px] text-center text-slate-400 font-medium mt-1.5">
                  {remainingCount} {remainingCount === 1 ? 'player' : 'players'} pending
                </p>
              )}
            </div>
          </div>
        );
      })()}

      {/* 3. DISCUSSION PHASE */}
      {gamePhase === 'DISCUSSION' && (
        <GroupDiscussionChat
          activePhone={activePhone}
          phones={phones}
          categoryName={selectedCategory.name}
          secretWord={secretWord}
          roundNumber={roundNumber}
          timerSeconds={timerSeconds}
          isTimerRunning={isTimerRunning}
          onToggleRun={() => setIsTimerRunning(!isTimerRunning)}
          onAddSeconds={(s) => setTimerSeconds(prev => prev + s)}
          onOpenVoting={() => {
            setIsTimerRunning(false);
            setGamePhase('VOTING');
          }}
        />
      )}

      {/* 4. VOTING PHASE */}
      {gamePhase === 'VOTING' && (
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="text-center mb-3">
              <span className="text-[10px] font-bold tracking-[0.2em] text-rose-400 uppercase">
                {activePhone.name}
              </span>
              <h3 className="text-base font-black text-slate-100 mt-0.5">Vote For The Imposter</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
              {phones.map(p => {
                const isSelectedByActive = activePhone.votedForId === p.id;
                const voteData = currentVoteCounts[p.id];
                const voteCount = voteData ? voteData.count : 0;

                return (
                  <button
                    key={p.id}
                    onClick={() => handleVote(p.id)}
                    className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center relative ${
                      isSelectedByActive
                        ? 'bg-rose-950/40 border-rose-500 text-rose-300 font-bold shadow-md shadow-rose-950/50'
                        : 'bg-[#161B22] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {voteCount > 0 && (
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-rose-600 text-white font-black text-[9px] shadow">
                        {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
                      </div>
                    )}

                    <Avatar2D avatarType={p.avatar} size={42} status={isSelectedByActive ? 'selected' : 'normal'} />
                    <span className="text-xs font-semibold block mt-1">{p.name.split("'s")[0]}</span>
                    
                    {isSelectedByActive && (
                      <span className="text-[9px] font-black text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-full mt-1 border border-rose-500/30">
                        VOTED ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-2">
            <button
              id="btn-network-tally-results"
              onClick={handleTallyVotes}
              className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-slate-100 font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-950/40 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              CONFIRM VOTES ({totalVotesCast}/{phones.length})
            </button>
          </div>
        </div>
      )}

      {/* 5. RESULTS PHASE WITH SCOREBOARD */}
      {gamePhase === 'RESULTS' && (
        <div className="flex-1 flex flex-col min-h-0">
          <ScoreBoard
            roundNumber={roundNumber}
            players={phones.map(p => ({
              id: p.id,
              name: p.name,
              avatar: p.avatar,
              role: p.role,
              totalScore: p.score || 0,
              roundScoreDelta: p.roundScoreDelta || 0
            }))}
            imposterFound={eliminatedPhone?.role === 'IMPOSTER'}
            imposterNames={phones.filter(p => p.role === 'IMPOSTER').map(p => p.name)}
            eliminatedPlayerName={eliminatedPhone?.name}
            secretWord={secretWord}
            categoryName={selectedCategory.name}
            onNextRound={handleNextRound}
            onExitGame={onBackToHome}
          />
        </div>
      )}

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
};
