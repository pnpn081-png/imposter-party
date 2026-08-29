import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wifi, Radio, Smartphone, ArrowLeft, Play, ShieldAlert, Check, Plus,
  Users, Vote, CheckCircle2, AlertCircle, Eye, Copy, Share2, Sparkles,
  QrCode, RefreshCw, LogOut, MessageSquare, Flame, Pause, ShieldCheck,
  ChevronRight, Settings2, Clock, UserPlus, Info, CheckCheck
} from 'lucide-react';
import { GAME_CATEGORIES } from '../../data/categories';
import { Category, Role, AvatarType } from '../../types/game';
import { HoldToReveal } from '../HoldToReveal';
import { GroupDiscussionChat } from './GroupDiscussionChat';
import { Avatar2D } from '../Avatar2D';
import { soundEffects } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { PlayerProfileData } from '../profile/ProfileCreationScreen';
import { ConfirmDialog } from '../ConfirmDialog';
import { saveGameHistoryRecord } from '../../utils/history';
import { networkHub, NetworkPlayer, NetworkMessage } from '../../utils/networkSync';

interface WifiHotspotMultiplayerProps {
  onBackToHome: () => void;
  userProfile?: PlayerProfileData;
}

type ScreenMode = 'SELECT' | 'HOST_LOBBY' | 'CLIENT_JOIN' | 'CLIENT_LOBBY' | 'GAME_ACTIVE';
type GamePhase = 'PLAYING' | 'DISCUSSION' | 'VOTING' | 'RESULTS';

export const WifiHotspotMultiplayer: React.FC<WifiHotspotMultiplayerProps> = ({
  onBackToHome,
  userProfile
}) => {
  // Screen and role states
  const [screenMode, setScreenMode] = useState<ScreenMode>('SELECT');
  const [isHost, setIsHost] = useState<boolean>(true);
  const [roomCode, setRoomCode] = useState<string>('');
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [joinStatus, setJoinStatus] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    message: string;
    action: (() => void) | null;
  }>({ isOpen: false, message: '', action: null });

  // Host Configuration Settings
  const [selectedCategory, setSelectedCategory] = useState<Category>(GAME_CATEGORIES[0] || { id: 'food', name: 'Food & Drinks', icon: '🍕', words: ['Pizza', 'Burger', 'Sushi', 'Taco', 'Pasta'] });
  const [imposterCount, setImposterCount] = useState<number>(1);
  const [discussionDuration, setDiscussionDuration] = useState<number>(180); // seconds

  // Game active states
  const [gamePhase, setGamePhase] = useState<GamePhase>('PLAYING');
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [secretWord, setSecretWord] = useState<string>('');
  const [timerSeconds, setTimerSeconds] = useState<number>(180);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [eliminatedPlayer, setEliminatedPlayer] = useState<NetworkPlayer | null>(null);
  const [winner, setWinner] = useState<'CREWMATES' | 'IMPOSTERS' | null>(null);

  // Connected players list
  const [players, setPlayers] = useState<NetworkPlayer[]>([]);
  const [myPlayerId] = useState<string>(() => `p_${Date.now()}_${Math.floor(Math.random() * 1000)}`);
  const [viewedPlayerIds, setViewedPlayerIds] = useState<Set<string>>(new Set());
  const [viewedToast, setViewedToast] = useState<{ id: string; name: string; avatar: AvatarType; count: number } | null>(null);

  // Generate random 4-digit code
  const generateRoomCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  // Safe active player resolution
  const myPlayer: NetworkPlayer = players.find(p => p.id === myPlayerId) || players[0] || {
    id: myPlayerId,
    name: userProfile?.name || 'Player',
    avatar: userProfile?.avatar || 'fox',
    isHost: isHost,
    role: 'CREWMATE' as Role,
    secretWord: '',
    categoryName: selectedCategory.name,
    hasVoted: false,
    votedForId: null,
    score: 0,
    roundScoreDelta: 0
  };

  const activeViewingPlayer = myPlayer;

  // Subscribe to network sync events
  useEffect(() => {
    const unsubscribe = networkHub.subscribe((msg: NetworkMessage) => {
      handleNetworkMessage(msg);
    });

    return () => {
      unsubscribe();
    };
  }, [isHost, players, myPlayerId, roundNumber, selectedCategory, secretWord, roomCode]);

  // Handle incoming network packets
  const handleNetworkMessage = (msg: NetworkMessage) => {
    switch (msg.type) {
      case 'JOIN_REQUEST': {
        if (isHost && msg.payload?.player) {
          const reqPlayer = msg.payload.player;
          const newPlayer: NetworkPlayer = {
            id: reqPlayer.id,
            name: reqPlayer.name || 'Friend',
            avatar: reqPlayer.avatar || 'cat',
            isHost: false,
            role: 'CREWMATE',
            secretWord: '',
            categoryName: selectedCategory.name,
            hasVoted: false,
            votedForId: null,
            score: 0,
            roundScoreDelta: 0
          };

          setPlayers(prev => {
            if (prev.some(p => p.id === newPlayer.id)) {
              // Resend lobby update in case client rejoined
              networkHub.sendMessage({
                type: 'LOBBY_UPDATE',
                senderId: myPlayerId,
                senderName: userProfile?.name || 'Host',
                roomCode: roomCode,
                payload: {
                  players: prev,
                  category: selectedCategory
                }
              });
              return prev;
            }
            const updated = [...prev, newPlayer];
            // Broadcast updated lobby immediately
            networkHub.sendMessage({
              type: 'LOBBY_UPDATE',
              senderId: myPlayerId,
              senderName: userProfile?.name || 'Host',
              roomCode: roomCode,
              payload: {
                players: updated,
                category: selectedCategory
              }
            });
            return updated;
          });
          soundEffects.playTap();
        }
        break;
      }

      case 'LOBBY_UPDATE': {
        if (msg.payload?.players) {
          setPlayers(msg.payload.players);
          if (msg.payload.category) {
            setSelectedCategory(msg.payload.category);
          }
          if (screenMode === 'CLIENT_JOIN') {
            setScreenMode('CLIENT_LOBBY');
            setIsConnecting(false);
          }
        }
        break;
      }

      case 'START_GAME': {
        if (msg.payload) {
          const { players: roundPlayers, category, word, round, duration } = msg.payload;
          setPlayers(roundPlayers);
          if (category) setSelectedCategory(category);
          setSecretWord(word || '');
          setRoundNumber(round || 1);
          setViewedPlayerIds(new Set());
          setEliminatedPlayer(null);
          setWinner(null);
          setTimerSeconds(duration || 180);
          setIsTimerRunning(false);
          setGamePhase('PLAYING');
          setScreenMode('GAME_ACTIVE');
          soundEffects.playTap();
        }
        break;
      }

      case 'VIEWED_CARD': {
        if (msg.senderId) {
          setViewedPlayerIds(prev => {
            const next = new Set(prev);
            next.add(msg.senderId);
            return next;
          });
          setViewedToast({
            id: msg.senderId,
            name: msg.senderName || 'Player',
            avatar: (msg.senderAvatar || 'fox') as AvatarType,
            count: viewedPlayerIds.size + 1
          });
        }
        break;
      }

      case 'CAST_VOTE': {
        if (msg.senderId && msg.payload?.suspectId) {
          setPlayers(prev => prev.map(p => {
            if (p.id === msg.senderId) {
              return { ...p, hasVoted: true, votedForId: msg.payload.suspectId };
            }
            return p;
          }));
        }
        break;
      }

      case 'TALLY_VOTES': {
        if (msg.payload) {
          setEliminatedPlayer(msg.payload.eliminated);
          setWinner(msg.payload.winner);
          setPlayers(msg.payload.updatedPlayers);
          setGamePhase('RESULTS');
          soundEffects.playWinner();
          try {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          } catch {}
        }
        break;
      }

      case 'NEXT_ROUND': {
        if (msg.payload) {
          setPlayers(msg.payload.players);
          if (msg.payload.category) setSelectedCategory(msg.payload.category);
          setSecretWord(msg.payload.word || '');
          setRoundNumber(msg.payload.round || 2);
          setViewedPlayerIds(new Set());
          setEliminatedPlayer(null);
          setWinner(null);
          setTimerSeconds(discussionDuration);
          setIsTimerRunning(false);
          setGamePhase('PLAYING');
          soundEffects.playTap();
        }
        break;
      }

      case 'PHASE_CHANGE': {
        if (msg.payload?.phase) {
          setGamePhase(msg.payload.phase);
          if (msg.payload.phase === 'DISCUSSION') {
            setIsTimerRunning(true);
          } else if (msg.payload.phase === 'VOTING') {
            setIsTimerRunning(false);
          }
        }
        break;
      }

      case 'HOST_LEFT': {
        handleLeaveRoom(true);
        break;
      }
    }
  };

  // Start Hosting a Wi-Fi / Hotspot Room
  const handleStartHosting = async () => {
    soundEffects.playTap();
    const newCode = generateRoomCode();
    setRoomCode(newCode);
    setIsHost(true);

    const hostRecord: NetworkPlayer = {
      id: myPlayerId,
      name: `${userProfile?.name || 'Player 1'} (Host)`,
      avatar: userProfile?.avatar || 'fox',
      isHost: true,
      role: 'CREWMATE',
      secretWord: '',
      categoryName: selectedCategory.name,
      hasVoted: false,
      votedForId: null,
      score: 0,
      roundScoreDelta: 0
    };

    // Only host in the room initially - other players join using Wi-Fi / Hotspot PIN
    const initialPlayers: NetworkPlayer[] = [hostRecord];

    setPlayers(initialPlayers);
    setScreenMode('HOST_LOBBY');

    try {
      await networkHub.hostRoom(newCode, hostRecord);
    } catch (e) {
      console.warn('Network hub setup note:', e);
    }
  };

  // Remove Player from Lobby
  const handleRemovePlayer = (id: string) => {
    soundEffects.playTap();
    const updated = players.filter(p => p.id !== id);
    setPlayers(updated);
    networkHub.sendMessage({
      type: 'LOBBY_UPDATE',
      senderId: myPlayerId,
      senderName: userProfile?.name || 'Host',
      roomCode: roomCode,
      payload: { players: updated, category: selectedCategory }
    });
  };

  // Join Room over Wi-Fi / Hotspot
  const handleJoinRoom = async () => {
    const cleanCode = joinCodeInput.trim().toUpperCase();
    if (!cleanCode || cleanCode.length < 4) {
      setJoinStatus('Please enter a valid 4-digit Room Code');
      return;
    }

    soundEffects.playTap();
    setIsConnecting(true);
    setJoinStatus('Connecting via Wi-Fi / Hotspot...');
    setIsHost(false);
    setRoomCode(cleanCode);

    const clientPlayer = {
      id: myPlayerId,
      name: userProfile?.name || `Player ${Math.floor(Math.random() * 100)}`,
      avatar: userProfile?.avatar || 'fox'
    };

    try {
      await networkHub.joinRoom(cleanCode, clientPlayer);
      setJoinStatus('Connected! Waiting for host to start...');
      setScreenMode('CLIENT_LOBBY');
      setIsConnecting(false);
    } catch (e) {
      setJoinStatus('Connection ready. Waiting for host...');
      setScreenMode('CLIENT_LOBBY');
      setIsConnecting(false);
    }
  };

  // Host launches game round
  const handleHostStartGame = () => {
    if (players.length < 3) return;
    soundEffects.playTap();

    const wordsList = selectedCategory?.words?.length ? selectedCategory.words : ['Pizza', 'Burger', 'Sushi', 'Taco'];
    const word = wordsList[Math.floor(Math.random() * wordsList.length)];
    
    // Assign Imposters
    const numImposters = Math.min(imposterCount, Math.floor(players.length / 2));
    const shuffledIndices = players.map((_, i) => i).sort(() => Math.random() - 0.5);
    const imposterIndices = new Set(shuffledIndices.slice(0, numImposters));

    const assignedPlayers = players.map((p, idx) => {
      const isImp = imposterIndices.has(idx);
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

    setPlayers(assignedPlayers);
    setSecretWord(word);
    setRoundNumber(1);
    setViewedPlayerIds(new Set());
    setEliminatedPlayer(null);
    setWinner(null);
    setTimerSeconds(discussionDuration);
    setIsTimerRunning(false);
    setGamePhase('PLAYING');
    setScreenMode('GAME_ACTIVE');

    networkHub.sendMessage({
      type: 'START_GAME',
      senderId: myPlayerId,
      senderName: userProfile?.name || 'Host',
      roomCode: roomCode,
      payload: {
        players: assignedPlayers,
        category: selectedCategory,
        word: word,
        round: 1,
        duration: discussionDuration
      }
    });
  };

  // Player confirms they viewed their secret card
  const handleCardViewed = (playerId: string) => {
    const targetPlayer = players.find(p => p.id === playerId) || myPlayer;
    setViewedPlayerIds(prev => {
      const next = new Set(prev);
      next.add(playerId);
      return next;
    });

    setViewedToast({
      id: playerId,
      name: targetPlayer.name,
      avatar: targetPlayer.avatar,
      count: viewedPlayerIds.size + 1
    });

    networkHub.sendMessage({
      type: 'VIEWED_CARD',
      senderId: playerId,
      senderName: targetPlayer.name,
      senderAvatar: targetPlayer.avatar,
      roomCode: roomCode
    });
  };

  // Cast a vote
  const handleCastVote = (suspectId: string) => {
    soundEffects.playTap();
    const votingId = activeViewingPlayer.id;

    setPlayers(prev => prev.map(p => {
      if (p.id === votingId) {
        return { ...p, hasVoted: true, votedForId: suspectId };
      }
      return p;
    }));

    networkHub.sendMessage({
      type: 'CAST_VOTE',
      senderId: votingId,
      senderName: activeViewingPlayer.name,
      roomCode: roomCode,
      payload: { suspectId }
    });
  };

  // Host tallies votes
  const handleTallyVotes = () => {
    soundEffects.playTap();
    const voteCounts: { [key: string]: number } = {};

    const resolved = players.map(p => {
      if (p.hasVoted && p.votedForId) return p;
      const otherPlayers = players.filter(o => o.id !== p.id);
      const fallback = otherPlayers[Math.floor(Math.random() * otherPlayers.length)] || players[0];
      return { ...p, hasVoted: true, votedForId: fallback.id };
    });

    resolved.forEach(p => {
      const vote = p.votedForId!;
      voteCounts[vote] = (voteCounts[vote] || 0) + 1;
    });

    let highestId = resolved[0].id;
    let maxVotes = -1;
    Object.entries(voteCounts).forEach(([id, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        highestId = id;
      }
    });

    const eliminated = resolved.find(p => p.id === highestId) || resolved[0];
    setEliminatedPlayer(eliminated);

    const isImp = eliminated.role === 'IMPOSTER';
    const outcome = isImp ? 'CREWMATES' : 'IMPOSTERS';
    setWinner(outcome);

    const updated = resolved.map(p => {
      let delta = 0;
      if (isImp && p.role === 'CREWMATE') delta = 1;
      if (!isImp && p.role === 'IMPOSTER') delta = 1;
      return {
        ...p,
        score: (p.score || 0) + delta,
        roundScoreDelta: delta
      };
    });

    setPlayers(updated);
    setGamePhase('RESULTS');

    // Broadcast results
    networkHub.sendMessage({
      type: 'TALLY_VOTES',
      senderId: myPlayerId,
      senderName: userProfile?.name || 'Host',
      roomCode: roomCode,
      payload: {
        eliminated,
        winner: outcome,
        updatedPlayers: updated
      }
    });

    // Save Game History
    saveGameHistoryRecord({
      mode: 'MULTIPLE',
      modeLabel: 'Multiple Player',
      roundNumber: roundNumber,
      categoryName: selectedCategory?.name || 'Random',
      secretWord: secretWord,
      winner: outcome,
      imposterNames: updated.filter(p => p.role === 'IMPOSTER').map(p => p.name),
      eliminatedPlayerName: eliminated.name,
      players: updated.map(p => ({
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

  // Host launches next round
  const handleHostNextRound = () => {
    soundEffects.playTap();
    const wordsList = selectedCategory?.words?.length ? selectedCategory.words : ['Pizza', 'Burger', 'Sushi', 'Taco'];
    const word = wordsList[Math.floor(Math.random() * wordsList.length)];
    const numImposters = Math.min(imposterCount, Math.floor(players.length / 2));
    const shuffledIndices = players.map((_, i) => i).sort(() => Math.random() - 0.5);
    const imposterIndices = new Set(shuffledIndices.slice(0, numImposters));
    const nextRoundNum = roundNumber + 1;

    const nextRoundPlayers = players.map((p, idx) => {
      const isImp = imposterIndices.has(idx);
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

    setPlayers(nextRoundPlayers);
    setSecretWord(word);
    setRoundNumber(nextRoundNum);
    setViewedPlayerIds(new Set());
    setEliminatedPlayer(null);
    setWinner(null);
    setTimerSeconds(discussionDuration);
    setIsTimerRunning(false);
    setGamePhase('PLAYING');

    networkHub.sendMessage({
      type: 'NEXT_ROUND',
      senderId: myPlayerId,
      senderName: userProfile?.name || 'Host',
      roomCode: roomCode,
      payload: {
        players: nextRoundPlayers,
        category: selectedCategory,
        word: word,
        round: nextRoundNum
      }
    });
  };

  const handleCopyCode = () => {
    soundEffects.playTap();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(roomCode);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = roomCode;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch {}
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleLeaveRoom = (force: any = false) => {
    const isForce = force === true;
    if (!isForce) {
      setConfirmDialog({
        isOpen: true,
        message: isHost ? 'Are you sure you want to close the room? All players will be disconnected.' : 'Are you sure you want to leave the room?',
        action: () => executeLeaveRoom(false)
      });
      return;
    }
    executeLeaveRoom(true);
  };

  const executeLeaveRoom = (isForce: boolean) => {
    soundEffects.playTap();
    if (isHost && !isForce) {
      networkHub.sendMessage({
        type: 'HOST_LEFT',
        senderId: myPlayerId,
        senderName: userProfile?.name || 'Host',
        roomCode: roomCode
      });
    }
    networkHub.cleanup();
    setScreenMode('SELECT');
    setRoomCode('');
    setPlayers([]);
    setIsHost(false);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto relative bg-[#0D1117]">
      
      {/* Card Viewed Toast Notification */}
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
                  {viewedToast.count}/{players.length} ready
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
              <Eye className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. SELECT HOST OR JOIN */}
      {screenMode === 'SELECT' && (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <button
                id="btn-network-back-home"
                onClick={() => {
                  soundEffects.playTap();
                  setConfirmDialog({
                    isOpen: true,
                    message: 'Are you sure you want to return to the main menu?',
                    action: onBackToHome
                  });
                }}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h1 className="text-base font-black text-slate-100 flex items-center gap-2">
                <Wifi className="w-4 h-4 text-purple-400" />
                Multiplayer
              </h1>
            </div>

            {/* Selection Buttons */}
            <div className="space-y-3">
              {/* Option 1: Host Room */}
              <button
                id="btn-mode-host-room"
                onClick={handleStartHosting}
                className="w-full p-4 rounded-2xl bg-[#161B22] hover:bg-[#21262D] border border-slate-800 hover:border-purple-500/50 text-left transition-all group shadow-md flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Radio className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-slate-100 group-hover:text-purple-300 transition-colors">
                    Host a Room
                  </h4>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Option 2: Join Room */}
              <button
                id="btn-mode-join-room"
                onClick={() => {
                  soundEffects.playTap();
                  setScreenMode('CLIENT_JOIN');
                }}
                className="w-full p-4 rounded-2xl bg-[#161B22] hover:bg-[#21262D] border border-slate-800 hover:border-cyan-500/50 text-left transition-all group shadow-md flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-slate-100 group-hover:text-cyan-300 transition-colors">
                    Join a Room
                  </h4>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. HOST LOBBY */}
      {screenMode === 'HOST_LOBBY' && (
        <div className="flex-1 flex flex-col justify-between relative">
          <div className="flex-1 overflow-y-auto pb-28 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  id="btn-host-leave-lobby"
                  onClick={() => handleLeaveRoom(false)}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-sm font-black text-slate-100 flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  Host Lobby
                </h2>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                {players.length} Players
              </span>
            </div>

            {/* Room Code Card */}
            <div className="bg-gradient-to-br from-[#161B22] to-[#1C2128] border border-purple-500/40 rounded-3xl p-3 text-center shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-black font-mono tracking-widest text-slate-100 bg-slate-900/90 px-5 py-1 rounded-2xl border border-slate-700/60 shadow-inner">
                  {roomCode}
                </span>
                <button
                  id="btn-copy-room-code"
                  onClick={handleCopyCode}
                  className="p-2.5 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 transition-colors"
                  title="Copy code"
                >
                  {copiedCode ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Room Settings Config */}
            <div className="grid grid-cols-2 gap-2">
              {/* Imposter Count */}
              <div className="p-2.5 rounded-xl bg-[#161B22] border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block mb-1.5 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-rose-400" /> Imposters
                </span>
                <div className="flex gap-1">
                  {[1, 2].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        soundEffects.playTap();
                        setImposterCount(num);
                      }}
                      className={`flex-1 py-1 rounded-lg text-xs font-black transition-all ${
                        imposterCount === num
                          ? 'bg-rose-500 text-white shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timer Duration */}
              <div className="p-2.5 rounded-xl bg-[#161B22] border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block mb-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" /> Timer
                </span>
                <div className="flex gap-1">
                  {[120, 180, 240].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => {
                        soundEffects.playTap();
                        setDiscussionDuration(sec);
                      }}
                      className={`flex-1 py-1 rounded-lg text-xs font-black transition-all ${
                        discussionDuration === sec
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {sec / 60}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Selector */}
            <div>
              <span className="text-[11px] font-bold text-slate-300 block mb-1.5">
                Category
              </span>
              <div className="grid grid-cols-2 gap-1.5 max-h-[110px] overflow-y-auto pr-1">
                {GAME_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    id={`btn-cat-${cat.id}`}
                    onClick={() => {
                      soundEffects.playTap();
                      setSelectedCategory(cat);
                      networkHub.sendMessage({
                        type: 'LOBBY_UPDATE',
                        senderId: myPlayerId,
                        senderName: userProfile?.name || 'Host',
                        roomCode: roomCode,
                        payload: { players, category: cat }
                      });
                    }}
                    className={`p-2 rounded-xl border text-left text-xs font-bold transition-all flex items-center gap-2 ${
                      selectedCategory.id === cat.id
                        ? 'bg-purple-950/40 border-purple-500 text-purple-200 shadow-md ring-1 ring-purple-500/50'
                        : 'bg-[#161B22] border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-sm">{cat.icon}</span>
                    <span className="truncate text-[11px]">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Players in Lobby */}
            <div>
              <span className="text-[11px] font-bold text-slate-300 block mb-1.5">
                Players ({players.length})
              </span>

              <div className="grid grid-cols-2 gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                {players.map((p) => (
                  <div
                    key={p.id}
                    className="p-2 rounded-xl bg-[#161B22] border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar2D avatarType={p.avatar} size={24} />
                      <span className="text-xs font-bold text-slate-200 truncate">
                        {p.name}
                      </span>
                    </div>
                    {!p.isHost && (
                      <button
                        onClick={() => handleRemovePlayer(p.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 text-[10px]"
                        title="Remove player"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Host Start Game Button */}
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#0D1117] via-[#0D1117] to-transparent pt-8">
            <button
              id="btn-host-start-game"
              onClick={handleHostStartGame}
              disabled={players.length < 3}
              className={`w-full py-3.5 rounded-2xl font-black text-xs tracking-wider uppercase shadow-xl transition-all flex items-center justify-center gap-2 ${
                players.length >= 3
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25 active:scale-[0.98]'
                  : 'bg-[#161B22] border border-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{players.length >= 3 ? `START GAME (${players.length} PLAYERS)` : `WAITING FOR PLAYERS (${players.length}/3)`}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. CLIENT JOIN SCREEN */}
      {screenMode === 'CLIENT_JOIN' && (
        <div className="flex-1 flex flex-col justify-between relative">
          <div className="flex-1 overflow-y-auto pb-28">
            <div className="flex items-center gap-2 mb-6">
              <button
                id="btn-client-back-select"
                onClick={() => {
                  soundEffects.playTap();
                  setConfirmDialog({
                    isOpen: true,
                    message: 'Are you sure you want to go back?',
                    action: () => setScreenMode('SELECT')
                  });
                }}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-base font-black text-slate-100">Join Room</h2>
            </div>

            {/* PIN Input */}
            <div className="bg-[#161B22] border border-slate-800 rounded-3xl p-6 mb-4 text-center shadow-lg">
              <input
                id="input-room-code"
                type="text"
                maxLength={4}
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="0000"
                className="w-full text-center text-4xl font-mono font-black tracking-widest py-3 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-2xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition-all shadow-inner"
              />

              {joinStatus && (
                <p className={`text-xs mt-3 ${joinStatus.includes('Connected') ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {joinStatus}
                </p>
              )}
            </div>

            {/* Player Preview */}
            <div className="p-3.5 rounded-2xl bg-[#161B22] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar2D avatarType={userProfile?.avatar || 'fox'} size={36} />
                <span className="text-xs font-bold text-slate-200">
                  {userProfile?.name || 'Player'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#0D1117] via-[#0D1117] to-transparent pt-8">
            <button
              id="btn-client-submit-join"
              onClick={handleJoinRoom}
              disabled={joinCodeInput.length < 4 || isConnecting}
              className={`w-full py-3.5 rounded-2xl font-black text-xs tracking-wider uppercase shadow-xl transition-all flex items-center justify-center gap-2 ${
                joinCodeInput.length >= 4 && !isConnecting
                  ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 shadow-cyan-500/25 active:scale-[0.98]'
                  : 'bg-[#161B22] border border-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>CONNECTING...</span>
                </>
              ) : (
                <>
                  <span>JOIN ROOM</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 4. CLIENT WAITING LOBBY */}
      {screenMode === 'CLIENT_LOBBY' && (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  id="btn-client-leave-room"
                  onClick={() => handleLeaveRoom(false)}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-sm font-black text-slate-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Room #{roomCode}
                </h2>
              </div>
            </div>

            {/* Radar waiting animation */}
            <div className="bg-[#161B22] border border-slate-800 rounded-3xl p-6 mb-4 text-center shadow-lg relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3 text-cyan-400 relative">
                <Radio className="w-7 h-7 animate-pulse" />
                <span className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping" />
              </div>
              <h3 className="text-sm font-black text-slate-100">Waiting for Host...</h3>
              <p className="text-xs text-slate-400 mt-1">
                {selectedCategory.name}
              </p>
            </div>

            {/* Players list */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-2">
                Players ({players.length})
              </span>
              <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1">
                {players.map((p) => (
                  <div
                    key={p.id}
                    className="p-2 rounded-xl bg-[#161B22] border border-slate-800 flex items-center gap-2"
                  >
                    <Avatar2D avatarType={p.avatar} size={28} />
                    <span className="text-xs font-bold text-slate-200 truncate">
                      {p.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. ACTIVE GAME STATE */}
      {screenMode === 'GAME_ACTIVE' && (
        <div className="flex-1 flex flex-col justify-between">
          {/* Top Active Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <button
                  id="btn-game-leave"
                  onClick={() => handleLeaveRoom(false)}
                  className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 text-xs transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
                <div>
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                    Room #{roomCode} • R{roundNumber}
                  </span>
                  <span className="text-xs font-black text-slate-200">
                    {selectedCategory.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                  {players.length}P
                </span>
              </div>
            </div>
          </div>

          {/* Phase 1: Card Hold-to-Reveal */}
          {gamePhase === 'PLAYING' && (
            <div className="flex-1 flex flex-col justify-between py-1">
              <div className="my-auto">
                <HoldToReveal
                  role={activeViewingPlayer.role}
                  secretWord={activeViewingPlayer.secretWord}
                  categoryName={selectedCategory.name}
                  playerName={activeViewingPlayer.name}
                  avatar={activeViewingPlayer.avatar}
                  onRevealed={() => handleCardViewed(activeViewingPlayer.id)}
                />
              </div>

              <div className="pt-2">
                {activeViewingPlayer.isHost ? (
                  <button
                    id="btn-network-start-discussion"
                    onClick={() => {
                      soundEffects.playTap();
                      setGamePhase('DISCUSSION');
                      setIsTimerRunning(true);
                      networkHub.sendMessage({
                        type: 'PHASE_CHANGE',
                        senderId: myPlayerId,
                        senderName: userProfile?.name || 'Host',
                        roomCode: roomCode,
                        payload: { phase: 'DISCUSSION' }
                      });
                    }}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 font-black text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    START DISCUSSION ({viewedPlayerIds.size}/{players.length} Ready)
                  </button>
                ) : (
                  <div className="w-full py-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-500 font-bold text-[10px] tracking-wider uppercase flex items-center justify-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5" />
                    WAITING FOR HOST TO START DISCUSSION
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Phase 2: Live Discussion & Real-Time Chat */}
          {gamePhase === 'DISCUSSION' && (
            <GroupDiscussionChat
              activePhone={{
                id: activeViewingPlayer.id,
                name: activeViewingPlayer.name,
                avatar: activeViewingPlayer.avatar,
                isHost: activeViewingPlayer.isHost,
                role: activeViewingPlayer.role,
                secretWord: activeViewingPlayer.secretWord,
                categoryName: selectedCategory.name
              }}
              phones={players.map(p => ({
                id: p.id,
                name: p.name,
                avatar: p.avatar,
                isHost: p.isHost,
                role: p.role,
                secretWord: p.secretWord,
                categoryName: selectedCategory.name
              }))}
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
                networkHub.sendMessage({
                  type: 'PHASE_CHANGE',
                  senderId: myPlayerId,
                  senderName: userProfile?.name || 'Host',
                  roomCode: roomCode,
                  payload: { phase: 'VOTING' }
                });
              }}
            />
          )}

          {/* Phase 3: Voting */}
          {gamePhase === 'VOTING' && (
            <div className="flex-1 flex flex-col justify-between py-1">
              <div className="text-center">
                <h3 className="text-base font-black text-slate-100">
                  Who is the Imposter?
                </h3>
              </div>

              <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1 my-auto">
                {players.map((suspect) => {
                  const isSelf = suspect.id === activeViewingPlayer.id;
                  const isSelected = activeViewingPlayer.votedForId === suspect.id;

                  return (
                    <button
                      key={suspect.id}
                      id={`btn-vote-${suspect.id}`}
                      onClick={() => handleCastVote(suspect.id)}
                      disabled={isSelf}
                      className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between ${
                        isSelf
                          ? 'bg-[#161B22]/40 border-slate-800/40 opacity-40 cursor-not-allowed'
                          : isSelected
                          ? 'bg-rose-950/50 border-rose-500 ring-2 ring-rose-500/40 text-rose-200'
                          : 'bg-[#161B22] border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar2D avatarType={suspect.avatar} size={32} />
                        <span className="text-xs font-bold block">{suspect.name}</span>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-black text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30">
                          VOTED
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  id="btn-tally-votes"
                  onClick={handleTallyVotes}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-slate-100 font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-950/50 transition-all flex items-center justify-center gap-2"
                >
                  <Vote className="w-4 h-4" />
                  REVEAL RESULTS
                </button>
              </div>
            </div>
          )}

          {/* Phase 4: Results */}
          {gamePhase === 'RESULTS' && (
            <div className="flex-1 flex flex-col justify-between py-1">
              <div className="text-center">
                <span className={`text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full border ${
                  winner === 'CREWMATES'
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                }`}>
                  {winner === 'CREWMATES' ? 'CREWMATES WON!' : 'IMPOSTER WON!'}
                </span>
                <p className="text-xs text-slate-400 mt-2">
                  Secret Word: <strong className="text-slate-100 font-bold">{secretWord}</strong>
                </p>
              </div>

              {/* Imposter Reveal Card */}
              <div className="bg-[#161B22] border border-slate-800 rounded-3xl p-3.5 text-center my-auto">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">
                  Imposter:
                </span>
                <div className="flex items-center justify-center gap-2">
                  {players.filter(p => p.role === 'IMPOSTER').map(imp => (
                    <div key={imp.id} className="flex items-center gap-2 bg-rose-950/40 border border-rose-500/40 px-3 py-1.5 rounded-2xl">
                      <Avatar2D avatarType={imp.avatar} size={28} status="imposter" />
                      <span className="text-xs font-black text-rose-300">{imp.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leaderboard Scoreboard */}
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                {players.map(p => (
                  <div
                    key={p.id}
                    className="px-3 py-2 rounded-xl bg-[#161B22] border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar2D avatarType={p.avatar} size={24} />
                      <span className="font-bold text-slate-200">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.roundScoreDelta > 0 && (
                        <span className="text-[10px] font-bold text-emerald-400">
                          +{p.roundScoreDelta}
                        </span>
                      )}
                      <span className="font-mono font-black text-amber-400">
                        {p.score} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-2">
                <button
                  id="btn-results-lobby"
                  onClick={() => handleLeaveRoom(false)}
                  className="flex-1 py-3 rounded-xl bg-[#161B22] hover:bg-[#21262D] border border-slate-800 text-slate-300 font-bold text-xs"
                >
                  Lobby
                </button>
                {isHost && (
                  <button
                    id="btn-results-next-round"
                    onClick={handleHostNextRound}
                    className="flex-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-purple-950/40"
                  >
                    Next Round
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        message={confirmDialog.message}
        onConfirm={() => {
          if (confirmDialog.action) confirmDialog.action();
          setConfirmDialog({ isOpen: false, message: '', action: null });
        }}
        onCancel={() => setConfirmDialog({ isOpen: false, message: '', action: null })}
      />
    </div>
  );
};
