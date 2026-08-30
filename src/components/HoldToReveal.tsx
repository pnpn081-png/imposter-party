import React, { useState } from 'react';
import { Fingerprint, ShieldAlert, UserCheck } from 'lucide-react';
import { Role, AvatarType } from '../types/game';
import { soundEffects } from '../utils/audio';
import { Avatar2D } from './Avatar2D';
import { motion } from 'motion/react';

interface HoldToRevealProps {
  playerName: string;
  role: Role;
  secretWord: string;
  categoryName?: string;
  avatarType?: AvatarType;
  avatar?: AvatarType;
  onRevealedChange?: (isRevealed: boolean) => void;
  onRevealed?: () => void;
}

export const HoldToReveal: React.FC<HoldToRevealProps> = ({
  playerName,
  role,
  secretWord,
  categoryName,
  avatarType,
  avatar,
  onRevealedChange,
  onRevealed
}) => {
  const [isHolding, setIsHolding] = useState(false);
  const isImposter = role === 'IMPOSTER';
  const effectiveAvatar: AvatarType = avatar || avatarType || 'fox';

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsHolding(true);
    soundEffects.playDoorOpen();
    soundEffects.startHold();
    soundEffects.playReveal();
    onRevealedChange?.(true);
    onRevealed?.();

    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([40, 30, 40]);
      } catch {}
    }
  };

  const handlePointerUpOrLeave = () => {
    if (isHolding) {
      setIsHolding(false);
      soundEffects.stopHold();
      soundEffects.playDoorClose();
      onRevealedChange?.(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      {/* Animal Avatar positioned atop the card */}
      <div className="relative -mb-9 z-30 pointer-events-none transition-transform duration-150">
        <Avatar2D
          avatarType={effectiveAvatar}
          role={role}
          size={84}
          isGlowing={isHolding}
          status={isHolding ? (isImposter ? 'imposter' : 'crewmate') : 'normal'}
        />
      </div>

      {/* Main Iron Door Vault Card Container */}
      <div
        id={`hold-card-${playerName.toLowerCase().replace(/\s+/g, '-')}`}
        className="w-full h-[360px] cursor-pointer select-none relative rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-700 bg-[#0B0E14] touch-none"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUpOrLeave}
        onPointerLeave={handlePointerUpOrLeave}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* ========================================================= */}
        {/* INTERIOR CHAMBER (Revealed when iron doors slide open)   */}
        {/* ========================================================= */}
        <div
          className={`absolute inset-0 p-6 flex flex-col justify-center items-center text-center transition-colors duration-150 ${
            isImposter
              ? 'bg-gradient-to-b from-[#1C0F14] via-[#2B0E17] to-[#12070B]'
              : 'bg-gradient-to-b from-[#0A1626] via-[#0E2238] to-[#07111D]'
          }`}
        >
          {/* Subtle Ambient Radial Lighting */}
          <div
            className={`absolute inset-0 blur-3xl opacity-40 pointer-events-none transition-opacity duration-150 ${
              isImposter ? 'bg-rose-600' : 'bg-cyan-500'
            }`}
          />

          {/* Chamber Content */}
          {isImposter ? (
            <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-100 z-10 pointer-events-none">
              <div className="w-20 h-20 rounded-2xl bg-rose-500/20 border-2 border-rose-500/60 flex items-center justify-center text-rose-400 mb-4 shadow-xl shadow-rose-950/80">
                <ShieldAlert className="w-11 h-11 text-rose-400 animate-pulse" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-rose-400 tracking-wider drop-shadow-md uppercase">
                IMPOSTER
              </h2>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-100 z-10 pointer-events-none w-full px-2">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border-2 border-cyan-500/50 flex items-center justify-center text-cyan-400 mb-3 shadow-lg shadow-cyan-950/70">
                <UserCheck className="w-7 h-7 text-cyan-400" />
              </div>

              {categoryName && (
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">
                  {categoryName}
                </span>
              )}

              <div className="py-2 px-6 rounded-2xl bg-cyan-950/50 border border-cyan-500/40 shadow-inner max-w-full">
                <h2 className="text-3xl sm:text-4xl font-black text-cyan-200 tracking-wide drop-shadow truncate">
                  {secretWord}
                </h2>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* HEAVY SLIDING IRON DOORS (Left Door & Right Door)        */}
        {/* ========================================================= */}

        {/* 1. LEFT IRON DOOR PANEL */}
        <motion.div
          className="absolute top-0 left-0 bottom-0 w-1/2 z-20 overflow-hidden border-r border-slate-900 pointer-events-none"
          animate={{
            x: isHolding ? '-102%' : '0%'
          }}
          transition={{
            type: 'spring',
            stiffness: 450,
            damping: 28,
            mass: 0.4
          }}
          style={{
            background: 'linear-gradient(135deg, #2D333B 0%, #22272E 40%, #161B22 100%)',
            boxShadow: isHolding ? 'none' : 'inset -4px 0 12px rgba(0,0,0,0.6)'
          }}
        >
          {/* Industrial Iron Rivets along Left Edge */}
          <div className="absolute left-2.5 top-4 bottom-4 flex flex-col justify-between py-2 pointer-events-none opacity-60">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-[#373E47] border border-[#161B22] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.8)]"
              />
            ))}
          </div>

          {/* Top Hazard Caution Stripe */}
          <div
            className="absolute top-0 left-0 right-0 h-3 opacity-75 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #EAB308 0, #EAB308 8px, #1E293B 8px, #1E293B 16px)'
            }}
          />

          {/* Bottom Hazard Caution Stripe */}
          <div
            className="absolute bottom-0 left-0 right-0 h-3 opacity-75 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #EAB308 0, #EAB308 8px, #1E293B 8px, #1E293B 16px)'
            }}
          />

          {/* Left Half of Central Lock Wheel */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 pointer-events-none">
            <div className="w-14 h-28 rounded-l-full bg-[#1C2128] border-2 border-r-0 border-amber-500/60 flex items-center justify-end pr-1 shadow-lg">
              <div className="w-8 h-16 rounded-l-full bg-[#2D333B] border border-r-0 border-slate-600 flex items-center justify-end pr-1">
                <div className="w-2 h-8 rounded-full bg-amber-400/80 shadow-[0_0_8px_#F59E0B]" />
              </div>
            </div>
          </div>

          {/* Interlocking Steel Seam Teeth */}
          <div className="absolute right-0 top-1/4 bottom-1/4 w-1.5 flex flex-col justify-around pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-full h-4 bg-slate-950 rounded-l border-y border-slate-700" />
            ))}
          </div>
        </motion.div>

        {/* 2. RIGHT IRON DOOR PANEL */}
        <motion.div
          className="absolute top-0 right-0 bottom-0 w-1/2 z-20 overflow-hidden border-l border-slate-900 pointer-events-none"
          animate={{
            x: isHolding ? '102%' : '0%'
          }}
          transition={{
            type: 'spring',
            stiffness: 450,
            damping: 28,
            mass: 0.4
          }}
          style={{
            background: 'linear-gradient(225deg, #2D333B 0%, #22272E 40%, #161B22 100%)',
            boxShadow: isHolding ? 'none' : 'inset 4px 0 12px rgba(0,0,0,0.6)'
          }}
        >
          {/* Industrial Iron Rivets along Right Edge */}
          <div className="absolute right-2.5 top-4 bottom-4 flex flex-col justify-between py-2 pointer-events-none opacity-60">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-[#373E47] border border-[#161B22] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.8)]"
              />
            ))}
          </div>

          {/* Top Hazard Caution Stripe */}
          <div
            className="absolute top-0 left-0 right-0 h-3 opacity-75 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(-45deg, #EAB308 0, #EAB308 8px, #1E293B 8px, #1E293B 16px)'
            }}
          />

          {/* Bottom Hazard Caution Stripe */}
          <div
            className="absolute bottom-0 left-0 right-0 h-3 opacity-75 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(-45deg, #EAB308 0, #EAB308 8px, #1E293B 8px, #1E293B 16px)'
            }}
          />

          {/* Right Half of Central Lock Wheel */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 pointer-events-none">
            <div className="w-14 h-28 rounded-r-full bg-[#1C2128] border-2 border-l-0 border-amber-500/60 flex items-center justify-start pl-1 shadow-lg">
              <div className="w-8 h-16 rounded-r-full bg-[#2D333B] border border-l-0 border-slate-600 flex items-center justify-start pl-1">
                <div className="w-2 h-8 rounded-full bg-amber-400/80 shadow-[0_0_8px_#F59E0B]" />
              </div>
            </div>
          </div>

          {/* Interlocking Steel Seam Teeth */}
          <div className="absolute left-0 top-1/4 bottom-1/4 w-1.5 flex flex-col justify-around pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-full h-4 bg-slate-950 rounded-r border-y border-slate-700" />
            ))}
          </div>
        </motion.div>

        {/* 3. FRONT PLAYER NAME & HOLD PROMPT (Fades out when doors slide open) */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-between p-5 pt-14"
          animate={{
            opacity: isHolding ? 0 : 1,
            scale: isHolding ? 0.92 : 1
          }}
          transition={{ duration: 0.1 }}
        >
          <div />

          {/* Center Plate: Player Name */}
          <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-b from-[#21262D] to-[#161B22] border-2 border-amber-500/60 shadow-2xl flex items-center justify-center max-w-[220px]">
            <h3 className="text-xl font-black text-slate-100 truncate">
              {playerName}
            </h3>
          </div>

          {/* Bottom Plate: Hold prompt */}
          <div className="w-full pb-1">
            <div className="flex items-center justify-center gap-2 text-xs font-black text-cyan-300 bg-slate-950/95 border border-cyan-500/50 py-2.5 px-4 rounded-xl shadow-lg shadow-black/60">
              <Fingerprint className="w-4 h-4 animate-pulse text-cyan-400" />
              <span>HOLD</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
