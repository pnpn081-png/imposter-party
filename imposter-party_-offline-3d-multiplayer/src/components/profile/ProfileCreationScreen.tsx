import React, { useState } from 'react';
import {
  User, Check, ArrowRight, Palette, Calendar,
  Sparkles, Award, MessageSquare, Flame, Volume2,
  VolumeX, Vibrate, ChevronRight, Compass, Shield
} from 'lucide-react';
import { AvatarType } from '../../types/game';
import { AVATAR_PRESETS, getAvatarConfig } from '../../data/avatars';
import { BASE_CATEGORIES, RANDOM_CATEGORY } from '../../data/categories';
import { Avatar2D } from '../Avatar2D';
import { ConfirmDialog } from '../ConfirmDialog';
import { soundEffects } from '../../utils/audio';

export interface PlayerProfileData {
  name: string;
  avatar: AvatarType;
  age: number;
  title?: string;
  catchphrase?: string;
  pronouns?: string;
  favoriteCategory?: string;
  playstyle?: 'ANALYTICAL' | 'DECEPTIVE' | 'INTERROGATOR' | 'WILDCARD';
  soundEnabled?: boolean;
  hapticsEnabled?: boolean;
}

interface ProfileCreationScreenProps {
  initialProfile: PlayerProfileData;
  onSaveProfile: (profile: PlayerProfileData) => void;
  onBackToSplash?: () => void;
}

const DETECTIVE_TITLES = [
  'Sharp Sleuth',
  'Master Mind',
  'The Chameleon',
  'Poker Face',
  'Silent Detective',
  'Chaos Agent',
  'Truth Seeker',
  'Grand Inquisitor'
];

const PRONOUN_OPTIONS = [
  'He/Him',
  'She/Her',
  'They/Them',
  'Prefer Not To Say'
];

const PLAYSTYLE_OPTIONS: {
  id: 'ANALYTICAL' | 'DECEPTIVE' | 'INTERROGATOR' | 'WILDCARD';
  label: string;
  icon: string;
  desc: string;
}[] = [
  {
    id: 'ANALYTICAL',
    label: 'Analytical',
    icon: '🔍',
    desc: 'Listens intently & catches logic flaws'
  },
  {
    id: 'DECEPTIVE',
    label: 'Deceptive',
    icon: '🎭',
    desc: 'Bluffs smoothly with calm confidence'
  },
  {
    id: 'INTERROGATOR',
    label: 'Interrogator',
    icon: '⚡',
    desc: 'Rapid-fire questions to break suspects'
  },
  {
    id: 'WILDCARD',
    label: 'Wildcard',
    icon: '🎲',
    desc: 'Unpredictable clues to confuse rivals'
  }
];

export const ProfileCreationScreen: React.FC<ProfileCreationScreenProps> = ({
  initialProfile,
  onSaveProfile,
  onBackToSplash
}) => {
  const [name, setName] = useState<string>(initialProfile.name || '');
  const [avatar, setAvatar] = useState<AvatarType>(initialProfile.avatar || 'fox');
  const [age, setAge] = useState<number>(initialProfile.age || 18);
  const [title, setTitle] = useState<string>(initialProfile.title || 'Sharp Sleuth');
  const [catchphrase, setCatchphrase] = useState<string>(
    initialProfile.catchphrase || 'Always innocent until proven guilty!'
  );
  const [pronouns, setPronouns] = useState<string>(initialProfile.pronouns || 'He/Him');
  const [favoriteCategory, setFavoriteCategory] = useState<string>(
    initialProfile.favoriteCategory || 'fruits_food'
  );
  const [playstyle, setPlaystyle] = useState<'ANALYTICAL' | 'DECEPTIVE' | 'INTERROGATOR' | 'WILDCARD'>(
    initialProfile.playstyle || 'ANALYTICAL'
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(initialProfile.soundEnabled !== false);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(initialProfile.hapticsEnabled !== false);

  const [errors, setErrors] = useState<{ name?: string }>({});
  const [showConfirmBack, setShowConfirmBack] = useState<boolean>(false);

  const selectedPreset = getAvatarConfig(avatar);

  const handleAvatarSelect = (avId: AvatarType) => {
    if (soundEnabled) soundEffects.playTap();
    setAvatar(avId);
  };

  const handleAgeChange = (newAge: number) => {
    const clamped = Math.max(5, Math.min(99, newAge));
    if (soundEnabled) soundEffects.playTap();
    setAge(clamped);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrors({ name: 'Please enter your player name' });
      return;
    }
    if (soundEnabled) soundEffects.playTap();
    onSaveProfile({
      name: name.trim(),
      avatar,
      age,
      title,
      catchphrase: catchphrase.trim() || 'Always innocent until proven guilty!',
      pronouns,
      favoriteCategory,
      playstyle,
      soundEnabled,
      hapticsEnabled
    });
  };

  const AGE_QUICK_PRESETS = [12, 16, 18, 21, 25, 30, 40];
  const allCategories = [RANDOM_CATEGORY, ...BASE_CATEGORIES];

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#0D1117] relative h-full">
      <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-5 pb-32">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase text-amber-400">
                DETECTIVE CREDENTIALS
              </span>
              <h2 className="text-xl font-black text-slate-100">Player Profile</h2>
            </div>
            {onBackToSplash && (
              <button
                type="button"
                id="btn-profile-back"
                onClick={() => {
                  if (soundEnabled) soundEffects.playTap();
                  setShowConfirmBack(true);
                }}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 transition-colors"
              >
                Back
              </button>
            )}
          </div>

          {/* Detective ID Passport Card (Live Preview) */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#161B22] via-[#1C2128] to-[#0D1117] border border-amber-500/30 shadow-lg shadow-black/40 mb-4 relative overflow-hidden">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <Avatar2D
                  avatarType={avatar}
                  size={76}
                  isGlowing={true}
                  status="selected"
                />
                <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 rounded-full text-slate-950 shadow-md">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {pronouns} • {age}y
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-100 truncate">
                  {name.trim() || 'Your Name Here'}
                </h3>

                <p className="text-[11px] text-slate-300 italic truncate mt-0.5">
                  "{catchphrase || 'Always innocent until proven guilty!'}"
                </p>

                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 font-semibold text-emerald-400">
                    <Shield className="w-3 h-3" />
                    {selectedPreset.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 1. Player Name Input */}
          <div className="mb-4">
            <label className="text-[10px] font-black text-slate-300 tracking-wider uppercase block mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-amber-400" />
                Player Name <span className="text-rose-400">*</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">{name.length}/20</span>
            </label>
            <div className="relative">
              <input
                id="input-player-name"
                type="text"
                maxLength={20}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({});
                }}
                placeholder="Enter detective / player name..."
                className={`w-full py-2.5 px-3.5 rounded-xl bg-[#161B22] border text-xs font-bold text-slate-100 placeholder-slate-500 outline-none transition-all ${
                  errors.name
                    ? 'border-rose-500 ring-1 ring-rose-500/50'
                    : 'border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50'
                }`}
              />
            </div>
            {errors.name && (
              <span className="text-[10px] text-rose-400 font-semibold mt-1 block">
                {errors.name}
              </span>
            )}
          </div>

          {/* 2. Animal Avatar Selection */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-black text-slate-300 tracking-wider uppercase flex items-center gap-1">
                <Palette className="w-3 h-3 text-cyan-400" />
                Select Avatar
              </label>
              <span className="text-[10px] text-amber-400 font-bold">
                {selectedPreset.name}
              </span>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-1">
              {AVATAR_PRESETS.map((preset) => {
                const isSelected = avatar === preset.id;
                return (
                  <button
                    key={preset.id}
                    id={`avatar-option-${preset.id}`}
                    type="button"
                    onClick={() => handleAvatarSelect(preset.id)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/20 scale-[1.03]'
                        : 'bg-[#161B22] border-slate-800 hover:border-slate-700 hover:bg-[#21262D]'
                    }`}
                  >
                    <Avatar2D avatarType={preset.id} size={46} />
                    <span className="text-[11px] font-black text-slate-200 mt-1.5 truncate w-full text-center">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Detective Rank / Title */}
          <div className="mb-4">
            <label className="text-[10px] font-black text-slate-300 tracking-wider uppercase block mb-1.5 flex items-center gap-1">
              <Award className="w-3 h-3 text-purple-400" />
              Detective Rank / Title
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DETECTIVE_TITLES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    if (soundEnabled) soundEffects.playTap();
                    setTitle(t);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                    title === t
                      ? 'bg-purple-500/25 border-purple-400 text-purple-200 shadow-sm'
                      : 'bg-[#161B22] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Bluff Catchphrase / Motto */}
          <div className="mb-4">
            <label className="text-[10px] font-black text-slate-300 tracking-wider uppercase block mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-emerald-400" />
                Bluff Catchphrase / Motto
              </span>
              <span className="text-[10px] font-mono text-slate-500">{catchphrase.length}/60</span>
            </label>
            <input
              id="input-player-catchphrase"
              type="text"
              maxLength={60}
              value={catchphrase}
              onChange={(e) => setCatchphrase(e.target.value)}
              placeholder="e.g. Always innocent until proven guilty!"
              className="w-full py-2 px-3 rounded-xl bg-[#161B22] border border-slate-800 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 text-xs font-semibold text-slate-100 placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {/* 5. Player Age & Pronouns Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {/* Age */}
            <div>
              <label className="text-[10px] font-black text-slate-300 tracking-wider uppercase block mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-purple-400" />
                  Age
                </span>
                <span className="text-[10px] font-black text-purple-300 font-mono">{age} yrs</span>
              </label>

              <div className="flex items-center justify-between p-1.5 rounded-xl bg-[#161B22] border border-slate-800 mb-1.5">
                <button
                  type="button"
                  id="btn-age-decrease"
                  disabled={age <= 5}
                  onClick={() => handleAgeChange(age - 1)}
                  className="w-7 h-7 rounded-lg bg-[#21262D] disabled:opacity-40 flex items-center justify-center text-purple-400 font-bold hover:bg-slate-700 transition-colors text-xs"
                >
                  -
                </button>

                <span className="text-sm font-black font-mono text-slate-100">{age} yrs</span>

                <button
                  type="button"
                  id="btn-age-increase"
                  disabled={age >= 99}
                  onClick={() => handleAgeChange(age + 1)}
                  className="w-7 h-7 rounded-lg bg-[#21262D] disabled:opacity-40 flex items-center justify-center text-purple-400 font-bold hover:bg-slate-700 transition-colors text-xs"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                {AGE_QUICK_PRESETS.map((presetAge) => (
                  <button
                    key={presetAge}
                    type="button"
                    onClick={() => handleAgeChange(presetAge)}
                    className={`px-2 py-0.5 rounded text-[9px] font-bold border transition-all shrink-0 ${
                      age === presetAge
                        ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                        : 'bg-[#161B22] border-slate-800 text-slate-400'
                    }`}
                  >
                    {presetAge}+
                  </button>
                ))}
              </div>
            </div>

            {/* Pronouns */}
            <div>
              <label className="text-[10px] font-black text-slate-300 tracking-wider uppercase block mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Pronouns
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {PRONOUN_OPTIONS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      if (soundEnabled) soundEffects.playTap();
                      setPronouns(p);
                    }}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-all text-center truncate ${
                      pronouns === p
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-[#161B22] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 6. Playstyle Archetype */}
          <div className="mb-4">
            <label className="text-[10px] font-black text-slate-300 tracking-wider uppercase block mb-1.5 flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-400" />
              Playing Style Archetype
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PLAYSTYLE_OPTIONS.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => {
                    if (soundEnabled) soundEffects.playTap();
                    setPlaystyle(style.id);
                  }}
                  className={`p-2.5 rounded-xl border flex items-start gap-2 text-left transition-all ${
                    playstyle === style.id
                      ? 'bg-rose-500/15 border-rose-400 shadow-sm'
                      : 'bg-[#161B22] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-base">{style.icon}</span>
                  <div className="min-w-0">
                    <span className="text-[11px] font-black text-slate-100 block">
                      {style.label}
                    </span>
                    <span className="text-[9px] text-slate-400 block leading-tight">
                      {style.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 7. Favorite Category */}
          <div className="mb-4">
            <label className="text-[10px] font-black text-slate-300 tracking-wider uppercase block mb-1.5 flex items-center gap-1">
              <Compass className="w-3 h-3 text-amber-400" />
              Favorite Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {allCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    if (soundEnabled) soundEffects.playTap();
                    setFavoriteCategory(cat.id);
                  }}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    favoriteCategory === cat.id
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-[#161B22] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-xs">{cat.name.split(' ')[0]}</span>
                  <span className="text-[10px] font-bold truncate">
                    {cat.name.replace(/^[^a-zA-Z0-9]+/, '')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 8. Audio & Haptics Toggles */}
          <div className="p-3 rounded-xl bg-[#161B22] border border-slate-800 mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">
              Game Preferences
            </span>
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  if (!soundEnabled) soundEffects.playTap();
                }}
                className={`flex-1 p-2 rounded-lg border flex items-center justify-center gap-2 text-[11px] font-bold transition-all ${
                  soundEnabled
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-[#21262D] border-slate-700 text-slate-400'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                Sound: {soundEnabled ? 'ON' : 'OFF'}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) soundEffects.playTap();
                  setHapticsEnabled(!hapticsEnabled);
                }}
                className={`flex-1 p-2 rounded-lg border flex items-center justify-center gap-2 text-[11px] font-bold transition-all ${
                  hapticsEnabled
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-[#21262D] border-slate-700 text-slate-400'
                }`}
              >
                <Vibrate className="w-3.5 h-3.5" />
                Vibration: {hapticsEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Action Button */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#0D1117] via-[#0D1117] to-transparent pt-10 z-10">
          <button
            id="btn-save-profile"
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-black text-xs tracking-wider uppercase shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            SAVE & CONTINUE
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      <ConfirmDialog
        isOpen={showConfirmBack}
        message="Are you sure you want to go back? Unsaved profile changes will be lost."
        onConfirm={() => {
          setShowConfirmBack(false);
          if (onBackToSplash) onBackToSplash();
        }}
        onCancel={() => setShowConfirmBack(false)}
      />
    </div>
  );
};
