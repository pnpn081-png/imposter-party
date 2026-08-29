import React, { useState } from 'react';
import { Trophy, ArrowRight, RotateCcw, Home, Award, Star, ShieldAlert, ShieldCheck, Sparkles } from 'lucide-react';
import { Player, Role } from '../types/game';
import { Avatar2D } from './Avatar2D';
import { ConfirmDialog } from './ConfirmDialog';
import { soundEffects } from '../utils/audio';

export interface ScoreBoardPlayer {
  id: string;
  name: string;
  avatar: any;
  role: Role;
  totalScore: number;
  roundScoreDelta: number; // +1 or 0
}

interface ScoreBoardProps {
  roundNumber: number;
  players: ScoreBoardPlayer[];
  imposterFound: boolean;
  imposterNames: string[];
  eliminatedPlayerName?: string;
  secretWord: string;
  categoryName: string;
  onNextRound: () => void;
  onExitGame: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  roundNumber,
  players,
  imposterFound,
  imposterNames,
  eliminatedPlayerName,
  secretWord,
  categoryName,
  onNextRound,
  onExitGame
}) => {
  const [showConfirmExit, setShowConfirmExit] = useState(false);
  // Sort players by totalScore descending, then by name
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }
    return a.name.localeCompare(b.name);
  });

  const highestScore = sortedPlayers.length > 0 ? sortedPlayers[0].totalScore : 0;

  return (
    <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto bg-[#0D1117]">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-100 leading-tight">
                Round {roundNumber} Scoreboard
              </h2>
            </div>
          </div>
        </div>

        {/* Round Outcome Banner */}
        <div
          className={`p-3 rounded-2xl border mb-3 text-center transition-all ${
            imposterFound
              ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200'
              : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 mb-1">
            {imposterFound ? (
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            )}
            <span className="text-xs font-black tracking-wider uppercase">
              {imposterFound ? 'Imposter Caught!' : 'Imposter Escaped!'}
            </span>
          </div>

          <p className="text-[11px] text-slate-300">
            {imposterFound ? (
              <span>
                <strong className="text-cyan-300">{eliminatedPlayerName || imposterNames.join(', ')}</strong> was caught.
                <span className="text-emerald-400 font-bold ml-1">+1 pt to Crewmates</span>
              </span>
            ) : (
              <span>
                <strong className="text-rose-300">{imposterNames.join(', ')}</strong> won.
                <span className="text-amber-400 font-bold ml-1">+1 pt to Imposter</span>
              </span>
            )}
          </p>

          <div className="mt-1.5 pt-1.5 border-t border-slate-800/60 flex items-center justify-center gap-2 text-[10px] text-slate-400">
            <span>Word: <strong className="text-slate-200 font-semibold">{secretWord}</strong></span>
          </div>
        </div>

        {/* Leaderboard Roster */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Player Standings
            </span>
            <span className="text-[10px] text-slate-500">
              {players.length} Players
            </span>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {sortedPlayers.map((player, index) => {
              const isLeader = player.totalScore > 0 && player.totalScore === highestScore;
              const isImposter = player.role === 'IMPOSTER';
              const gainedPoint = player.roundScoreDelta > 0;

              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                    isLeader
                      ? 'bg-amber-950/20 border-amber-500/30'
                      : 'bg-[#161B22] border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Rank Badge */}
                    <div className="w-5 text-center flex-shrink-0">
                      {index === 0 && player.totalScore > 0 ? (
                        <span className="text-xs">🥇</span>
                      ) : index === 1 && player.totalScore > 0 ? (
                        <span className="text-xs">🥈</span>
                      ) : index === 2 && player.totalScore > 0 ? (
                        <span className="text-xs">🥉</span>
                      ) : (
                        <span className="text-[10px] font-mono font-bold text-slate-500">
                          #{index + 1}
                        </span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <Avatar2D avatarType={player.avatar} size={32} />
                      {isLeader && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center text-[8px] text-slate-950 font-black">
                          ★
                        </div>
                      )}
                    </div>

                    {/* Name & Role */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-100 truncate">
                          {player.name}
                        </span>
                        {isLeader && (
                          <span className="text-[8px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 py-0.2 rounded">
                            LEADER
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[9px]">
                        <span
                          className={`font-bold ${
                            isImposter ? 'text-rose-400' : 'text-cyan-400'
                          }`}
                        >
                          {isImposter ? 'Imposter' : 'Crewmate'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Points Breakdown */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Round Delta */}
                    {gainedPoint ? (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                        +1 pt
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-600 px-1">
                        +0
                      </span>
                    )}

                    {/* Total Score */}
                    <div className="min-w-[48px] text-right">
                      <span className="text-sm font-black text-slate-100">
                        {player.totalScore}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold ml-0.5">
                        {player.totalScore === 1 ? 'pt' : 'pts'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actions: Next Round & Exit Game */}
      <div className="pt-3 space-y-2">
        <button
          id="btn-next-round"
          onClick={() => {
            soundEffects.playTap();
            onNextRound();
          }}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>NEXT ROUND (ROUND {roundNumber + 1})</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          id="btn-exit-game"
          onClick={() => {
            soundEffects.playTap();
            setShowConfirmExit(true);
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-[#161B22] hover:bg-[#21262D] border border-slate-800 text-slate-400 hover:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Exit to Modes</span>
        </button>
      </div>

      <ConfirmDialog
        isOpen={showConfirmExit}
        message="Are you sure you want to exit the game?"
        onConfirm={() => {
          setShowConfirmExit(false);
          onExitGame();
        }}
        onCancel={() => setShowConfirmExit(false)}
      />
    </div>
  );
};
