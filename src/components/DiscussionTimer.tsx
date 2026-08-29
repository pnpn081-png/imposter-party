import React, { useEffect } from 'react';
import { Play, Pause, Plus, Flame } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface DiscussionTimerProps {
  totalSeconds: number;
  secondsLeft: number;
  isRunning: boolean;
  onToggleRun: () => void;
  onAddSeconds: (sec: number) => void;
}

export const DiscussionTimer: React.FC<DiscussionTimerProps> = ({
  totalSeconds,
  secondsLeft,
  isRunning,
  onToggleRun,
  onAddSeconds
}) => {
  const isWarning = secondsLeft <= 15;
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const circumference = 2 * Math.PI * 58;
  const strokeDashoffset = circumference - progress * circumference;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Audio tick effect on low time
  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      if (isWarning) {
        soundEffects.playTick(true);
      } else if (secondsLeft % 5 === 0) {
        soundEffects.playTick(false);
      }
    }
  }, [secondsLeft, isRunning, isWarning]);

  return (
    <div className="flex flex-col items-center">
      {/* Circular Timer Visual */}
      <div className="relative w-44 h-44 flex items-center justify-center my-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
          {/* Background Track */}
          <circle
            cx="70"
            cy="70"
            r="58"
            className="stroke-[#21262D]"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Animated Progress Circle */}
          <circle
            cx="70"
            cy="70"
            r="58"
            className={`transition-all duration-1000 ease-linear ${
              isWarning ? 'stroke-rose-500' : 'stroke-cyan-400'
            }`}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Digital Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span
            className={`text-3xl font-black tracking-tight ${
              isWarning ? 'text-rose-400 animate-pulse' : 'text-slate-100'
            }`}
          >
            {formattedTime}
          </span>
          <span
            className={`text-[10px] font-bold tracking-widest uppercase mt-0.5 ${
              isWarning ? 'text-rose-400' : 'text-slate-500'
            }`}
          >
            {isWarning ? 'Hurry Up!' : 'Discussion'}
          </span>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center gap-2 mt-2">
        <button
          id="btn-timer-toggle"
          onClick={onToggleRun}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-slate-200 border border-slate-700 text-xs font-semibold transition-all active:scale-95"
        >
          {isRunning ? (
            <>
              <Pause className="w-3.5 h-3.5 text-cyan-400" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              Resume
            </>
          )}
        </button>

        <button
          id="btn-timer-add30"
          onClick={() => onAddSeconds(30)}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-cyan-400 border border-slate-700 text-xs font-semibold transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          +30s
        </button>
      </div>
    </div>
  );
};
