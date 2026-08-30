import React, { useState, useEffect } from 'react';
import { ShieldAlert, Sparkles, Cpu, CheckCircle } from 'lucide-react';
import appIcon from '../../../public/app-icon.jpg';
import { soundEffects } from '../../utils/audio';

interface SplashScreenProps {
  onLoadingComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const intervalTime = 30; // 30ms * 100 steps = 3000ms = 3 seconds
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            soundEffects.playTap();
            onLoadingComplete();
          }, 100); // 100ms finish delay so the bar visually hits 100%
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  const handleSkip = () => {
    soundEffects.playTap();
    onLoadingComplete();
  };

  return (
    <div
      onClick={handleSkip}
      className="flex-1 flex flex-col relative h-full cursor-pointer select-none bg-gradient-to-b from-[#0D1117] via-[#090D13] to-[#0D1117]"
    >
      {/* Main Hero & Profile Picture */}
      <div className="flex-1 flex flex-col items-center justify-center pb-20">
        <div className="relative mb-5 group">
          {/* Ambient Glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-500 animate-pulse" />

          {/* App Profile Picture */}
          <div className="relative w-28 h-28 rounded-3xl bg-slate-900 border-2 border-amber-500/70 p-1.5 shadow-2xl shadow-amber-500/30">
            <img
              src={appIcon}
              alt="Imposter Party App Profile"
              className="w-full h-full object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <h1 className="text-3xl font-black tracking-wider text-slate-100 uppercase">
          IMPOSTER PARTY
        </h1>
      </div>

      {/* Bottom Loading Area */}
      <div className="absolute bottom-0 left-0 w-full flex flex-col items-center bg-gradient-to-t from-[#090D13] via-[#090D13] to-transparent pt-12 pb-[max(0px,env(safe-area-inset-bottom))]">
        <div className="flex flex-col items-center justify-center text-xs mb-1.5 gap-1">
          <span className="text-xs font-black font-mono text-amber-400">{progress}%</span>
        </div>

        <p className="text-[10px] text-center text-slate-500 mb-1.5 opacity-60">
          Tap anywhere to continue
        </p>

        {/* Full-width Progress Bar */}
        <div className="w-full h-1.5 bg-slate-900">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-400 transition-all duration-[30ms] ease-linear shadow-[0_0_10px_rgba(34,211,238,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
