import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  phoneLabel?: string;
  isHost?: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, phoneLabel, isHost }) => {
  return (
    <div className="flex flex-col items-center">
      {phoneLabel && (
        <div className="flex items-center gap-2 mb-2 px-3 py-1 bg-slate-800/80 border border-slate-700 rounded-full text-xs font-semibold text-slate-300">
          <div className={`w-2 h-2 rounded-full ${isHost ? 'bg-purple-400 animate-pulse' : 'bg-cyan-400'}`} />
          {phoneLabel}
        </div>
      )}
      
      {/* Android Device Mockup */}
      <div className="relative w-[340px] sm:w-[380px] h-[720px] bg-[#0D1117] border-[10px] border-[#21262D] rounded-[44px] shadow-2xl shadow-cyan-950/20 flex flex-col overflow-hidden select-none">
        
        {/* Device punch hole camera */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-50 ring-1 ring-slate-800/60" />

        {/* Android Status Bar */}
        <div className="h-7 w-full bg-[#0D1117] flex items-center justify-between px-6 pt-1 text-[11px] font-medium text-slate-400 z-40">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3 text-cyan-400" />
            <BatteryMedium className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 w-full bg-[#0D1117] overflow-y-auto text-slate-100 flex flex-col relative scrollbar-none">
          {children}
        </div>

        {/* Android Bottom Navigation Pill */}
        <div className="h-5 w-full bg-[#0D1117] flex items-center justify-center pb-1 z-40">
          <div className="w-32 h-1 bg-slate-600/70 rounded-full" />
        </div>
      </div>
    </div>
  );
};
