import React, { useState } from 'react';
import { AvatarType, Role } from '../types/game';
import { getAvatarConfig } from '../data/avatars';
import { ShieldAlert, ShieldCheck, PawPrint } from 'lucide-react';

interface Avatar2DProps {
  avatarType: AvatarType;
  role?: Role;
  size?: number;
  className?: string;
  showRoleBadge?: boolean;
  isGlowing?: boolean;
  status?: 'normal' | 'selected' | 'eliminated' | 'imposter' | 'crewmate';
}

export const Avatar2D: React.FC<Avatar2DProps> = ({
  avatarType,
  role,
  size = 56,
  className = '',
  showRoleBadge = false,
  isGlowing = false,
  status = 'normal'
}) => {
  const config = getAvatarConfig(avatarType);
  const [imageError, setImageError] = useState(false);

  const getBorderColor = () => {
    if (status === 'eliminated') return '#64748B';
    if (status === 'imposter' || (role === 'IMPOSTER' && showRoleBadge)) return '#FF2A55';
    if (status === 'crewmate' || (role === 'CREWMATE' && showRoleBadge)) return '#00F0FF';
    if (status === 'selected') return '#F59E0B';
    return config.primaryColor;
  };

  const borderColor = getBorderColor();

  return (
    <div
      className={`relative rounded-full flex items-center justify-center select-none transition-all duration-200 shrink-0 ${className} ${
        status === 'eliminated' ? 'grayscale opacity-60' : ''
      }`}
      style={{
        width: size,
        height: size,
        backgroundColor: '#161B22',
        border: `${Math.max(2, Math.round(size / 24))}px solid ${borderColor}`,
        boxShadow: isGlowing || status === 'selected'
          ? `0 0 ${Math.round(size / 3.5)}px ${borderColor}99`
          : '0 3px 8px rgba(0,0,0,0.45)'
      }}
    >
      <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-slate-900 relative">
        {!imageError ? (
          <img
            src={config.imageUrl}
            alt={`${config.name} avatar`}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center select-none pointer-events-none transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center text-slate-200"
            style={{ backgroundColor: config.secondaryColor || '#1E293B' }}
          >
            <PawPrint style={{ width: size * 0.45, height: size * 0.45, color: config.primaryColor }} />
          </div>
        )}

        {/* Subtle vignette/rim gradient for premium realism */}
        <div className="absolute inset-0 rounded-full pointer-events-none shadow-[inset_0_0_6px_rgba(0,0,0,0.4)]" />
      </div>

      {/* Optional Role Badge */}
      {showRoleBadge && role && (
        <div
          className={`absolute -bottom-1 -right-1 rounded-full flex items-center justify-center border shadow-lg ${
            role === 'IMPOSTER'
              ? 'bg-rose-600 border-rose-400 text-white'
              : 'bg-cyan-500 border-cyan-300 text-slate-950'
          }`}
          style={{
            width: Math.max(16, Math.round(size * 0.36)),
            height: Math.max(16, Math.round(size * 0.36))
          }}
        >
          {role === 'IMPOSTER' ? (
            <ShieldAlert style={{ width: Math.round(size * 0.22), height: Math.round(size * 0.22) }} className="text-white" />
          ) : (
            <ShieldCheck style={{ width: Math.round(size * 0.22), height: Math.round(size * 0.22) }} className="text-slate-950" />
          )}
        </div>
      )}
    </div>
  );
};
