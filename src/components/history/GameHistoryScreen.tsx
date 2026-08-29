import React, { useState, useEffect } from 'react';
import {
  History, ArrowLeft, Trash2, Trophy, ShieldCheck, ShieldAlert,
  Smartphone, Users, Calendar, Sparkles, Filter, ChevronRight
} from 'lucide-react';
import { GameHistoryRecord } from '../../types/history';
import { getGameHistory, clearGameHistory } from '../../utils/history';
import { Avatar2D } from '../Avatar2D';
import { soundEffects } from '../../utils/audio';

interface GameHistoryScreenProps {
  onBack: () => void;
  onPlayNewGame?: () => void;
}

export const GameHistoryScreen: React.FC<GameHistoryScreenProps> = ({ onBack, onPlayNewGame }) => {
  const [history, setHistory] = useState<GameHistoryRecord[]>([]);
  const [filterMode, setFilterMode] = useState<'ALL' | 'MULTIPLE' | 'SINGLE'>('ALL');
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  useEffect(() => {
    setHistory(getGameHistory());
  }, []);

  const handleClear = () => {
    soundEffects.playTap();
    clearGameHistory();
    setHistory([]);
    setShowClearConfirm(false);
  };

  const filteredHistory = history.filter(item => {
    if (filterMode === 'ALL') return true;
    return item.mode === filterMode;
  });

  const totalGames = history.length;
  const crewmateWins = history.filter(h => h.winner === 'CREWMATES').length;
  const imposterWins = history.filter(h => h.winner === 'IMPOSTERS').length;

  return (
    <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto bg-[#0D1117]">
      <div>
        {/* Top Navigation Header */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <button
              id="btn-history-back"
              onClick={() => {
                soundEffects.playTap();
                onBack();
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base font-black text-slate-100 flex items-center gap-1.5">
                <History className="w-4 h-4 text-amber-400" />
                Game History
              </h2>
              <span className="text-[10px] text-slate-400 font-medium">
                {totalGames} {totalGames === 1 ? 'Match Recorded' : 'Matches Recorded'}
              </span>
            </div>
          </div>

          {history.length > 0 && (
            <div>
              {!showClearConfirm ? (
                <button
                  id="btn-show-clear-history"
                  onClick={() => setShowClearConfirm(true)}
                  className="p-2 rounded-xl bg-slate-800/60 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700/60 transition-colors"
                  title="Clear History"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleClear}
                    className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 text-[10px] font-bold"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Stats Banner */}
        {totalGames > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="p-2.5 rounded-2xl bg-[#161B22] border border-slate-800 text-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Games
              </span>
              <span className="text-base font-black text-slate-100 mt-0.5 block">
                {totalGames}
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-[#161B22] border border-slate-800 text-center">
              <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider block">
                Crewmates
              </span>
              <span className="text-base font-black text-cyan-300 mt-0.5 block">
                {crewmateWins} Wins
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-[#161B22] border border-slate-800 text-center">
              <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider block">
                Imposters
              </span>
              <span className="text-base font-black text-rose-300 mt-0.5 block">
                {imposterWins} Wins
              </span>
            </div>
          </div>
        )}

        {/* Mode Filter Pills */}
        {totalGames > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <button
              onClick={() => {
                soundEffects.playTap();
                setFilterMode('ALL');
              }}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                filterMode === 'ALL'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-[#161B22] text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              All ({history.length})
            </button>

            <button
              onClick={() => {
                soundEffects.playTap();
                setFilterMode('MULTIPLE');
              }}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all ${
                filterMode === 'MULTIPLE'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-[#161B22] text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Users className="w-3 h-3" />
              Multiple Player
            </button>

            <button
              onClick={() => {
                soundEffects.playTap();
                setFilterMode('SINGLE');
              }}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all ${
                filterMode === 'SINGLE'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                  : 'bg-[#161B22] text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              Single Player
            </button>
          </div>
        )}

        {/* Match List */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-2xl bg-[#161B22]/60 border border-slate-800">
              <History className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <h3 className="text-xs font-bold text-slate-300">No Games in History</h3>
              <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] mx-auto">
                Completed matches will automatically appear here.
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const isCrewmateWin = item.winner === 'CREWMATES';

              return (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-[#161B22] border border-slate-800 hover:border-slate-700 transition-all text-xs"
                >
                  {/* Top Bar of Record Card */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${
                        item.mode === 'MULTIPLE'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                      }`}>
                        {item.modeLabel}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">
                        Round {item.roundNumber}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono">
                      {item.dateFormatted}
                    </span>
                  </div>

                  {/* Outcome Tag & Secret Word */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#0D1117] border border-slate-800/80 mb-2">
                    <div className="flex items-center gap-1.5">
                      {isCrewmateWin ? (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span className={`text-[11px] font-black ${
                        isCrewmateWin ? 'text-emerald-300' : 'text-rose-300'
                      }`}>
                        {isCrewmateWin ? 'Imposter Caught' : 'Imposter Escaped'}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-300">
                      <span className="text-slate-500 mr-1">{item.categoryName}:</span>
                      <strong className="text-slate-100 font-bold">{item.secretWord}</strong>
                    </div>
                  </div>

                  {/* Players list */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {item.players.map((p) => {
                      const isImp = p.role === 'IMPOSTER';
                      return (
                        <div
                          key={p.id}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-xl border flex-shrink-0 ${
                            isImp
                              ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                              : 'bg-slate-900 border-slate-800 text-slate-300'
                          }`}
                        >
                          <Avatar2D avatarType={p.avatar} size={20} />
                          <span className="text-[10px] font-bold">{p.name.split("'s")[0]}</span>
                          <span className="text-[9px] font-mono font-bold text-amber-400">
                            {p.totalScore}p
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="pt-3">
        <button
          id="btn-history-play-now"
          onClick={() => {
            soundEffects.playTap();
            if (onPlayNewGame) onPlayNewGame();
            else onBack();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-black text-xs tracking-wider uppercase shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Trophy className="w-4 h-4 stroke-[3]" />
          BACK TO MODES
        </button>
      </div>
    </div>
  );
};
