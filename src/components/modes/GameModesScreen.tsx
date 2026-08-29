import React, { useState } from 'react';
import {
  Smartphone, Users, ChevronRight, CheckCircle2
} from 'lucide-react';
import { PlayerProfileData } from '../profile/ProfileCreationScreen';
import { Avatar2D } from '../Avatar2D';
import { soundEffects } from '../../utils/audio';

interface GameModesScreenProps {
  userProfile: PlayerProfileData;
  onSelectPassPlay: () => void;
  onSelectLocalWifi: () => void;
}

export const GameModesScreen: React.FC<GameModesScreenProps> = ({
  userProfile,
  onSelectPassPlay,
  onSelectLocalWifi
}) => {
  const [selectedMode, setSelectedMode] = useState<'SINGLE' | 'MULTIPLE'>('SINGLE');

  const handleConfirmMode = () => {
    soundEffects.playTap();
    if (selectedMode === 'SINGLE') {
      onSelectPassPlay();
    } else {
      onSelectLocalWifi();
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#0D1117] relative">
      <div className="flex-1 overflow-y-auto p-5 pb-32">
        {/* Player Profile Quick Card */}
        <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-[#161B22] to-[#1F242C] border border-slate-800 flex items-center gap-3">
          <Avatar2D avatarType={userProfile.avatar} size={48} isGlowing={true} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {userProfile.title || 'Detective'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{userProfile.age} yrs</span>
            </div>
            <h3 className="text-sm font-black text-slate-100 truncate mt-0.5">
              {userProfile.name}
            </h3>
            {userProfile.catchphrase && (
              <p className="text-[10px] text-slate-400 italic truncate">
                "{userProfile.catchphrase}"
              </p>
            )}
          </div>
        </div>

        {/* 2 Game Modes Cards */}
        <div className="space-y-3">
          {/* Mode 1: Single Player */}
          <button
            id="btn-mode-single-player"
            onClick={() => {
              soundEffects.playTap();
              setSelectedMode('SINGLE');
            }}
            className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group shadow-lg ${
              selectedMode === 'SINGLE'
                ? 'bg-cyan-950/40 border-cyan-500 shadow-cyan-500/20 ring-2 ring-cyan-500/40'
                : 'bg-[#161B22] hover:bg-[#21262D] border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center flex-shrink-0 transition-transform ${
                selectedMode === 'SINGLE'
                  ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 scale-105'
                  : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400/80'
              }`}>
                <Smartphone className="w-6 h-6" />
              </div>
              <span className={`text-base font-black ${
                selectedMode === 'SINGLE' ? 'text-white' : 'text-slate-200'
              }`}>
                Single Player
              </span>
            </div>
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
              selectedMode === 'SINGLE'
                ? 'border-cyan-400 bg-cyan-500 text-white'
                : 'border-slate-700 bg-slate-800/60 text-transparent'
            }`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </button>

          {/* Mode 2: Multiple Player */}
          <button
            id="btn-mode-multiple-player"
            onClick={() => {
              soundEffects.playTap();
              setSelectedMode('MULTIPLE');
            }}
            className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group shadow-lg ${
              selectedMode === 'MULTIPLE'
                ? 'bg-purple-950/40 border-purple-500 shadow-purple-500/20 ring-2 ring-purple-500/40'
                : 'bg-[#161B22] hover:bg-[#21262D] border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center flex-shrink-0 transition-transform ${
                selectedMode === 'MULTIPLE'
                  ? 'bg-purple-500/25 border-purple-400 text-purple-300 scale-105'
                  : 'bg-purple-500/10 border-purple-500/20 text-purple-400/80'
              }`}>
                <Users className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className={`text-base font-black ${
                  selectedMode === 'MULTIPLE' ? 'text-white' : 'text-slate-200'
                }`}>
                  Multiple Player
                </span>
                <span className="text-[10px] text-purple-400/90 font-medium">
                  Connect via Wi-Fi & Hotspot
                </span>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
              selectedMode === 'MULTIPLE'
                ? 'border-purple-400 bg-purple-500 text-white'
                : 'border-slate-700 bg-slate-800/60 text-transparent'
            }`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Action Section with Select Game Mode Button */}
      <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-[#0D1117] via-[#0D1117] to-transparent pt-12">
        <button
          id="btn-select-game-mode"
          onClick={handleConfirmMode}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm tracking-wider uppercase shadow-xl shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>CONTINUE</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
