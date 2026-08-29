import { AvatarConfig, AvatarType } from '../types/game';

import animeFox from '../assets/images/anime_fox_avatar_1787976945743.jpg';
import animePanda from '../assets/images/anime_panda_avatar_1787976961405.jpg';
import animeCat from '../assets/images/anime_cat_avatar_1787976974745.jpg';
import animeWolf from '../assets/images/anime_wolf_avatar_1787976989947.jpg';
import animeLion from '../assets/images/anime_lion_avatar_1787977006830.jpg';
import animeTiger from '../assets/images/anime_tiger_avatar_1787977018517.jpg';
import animeBear from '../assets/images/anime_bear_avatar_1787977034888.jpg';
import animeOwl from '../assets/images/anime_owl_avatar_1787977051258.jpg';
import animeRabbit from '../assets/images/anime_rabbit_avatar_1787977060857.jpg';
import animeDragon from '../assets/images/anime_dragon_avatar_1787977078893.jpg';
import animeShark from '../assets/images/anime_shark_avatar_1787977094086.jpg';
import animeEagle from '../assets/images/anime_eagle_avatar_1787977106411.jpg';
import animeMonkey from '../assets/images/anime_monkey_avatar_1787977121428.jpg';
import animeRaccoon from '../assets/images/anime_raccoon_avatar_1787977134217.jpg';
import animeFrog from '../assets/images/anime_frog_avatar_1787977145760.jpg';
import animePenguin from '../assets/images/anime_penguin_avatar_1787977157749.jpg';
import animeKoala from '../assets/images/anime_koala_avatar_1787977171658.jpg';
import animeDeer from '../assets/images/anime_deer_avatar_1787977185639.jpg';

export const AVATAR_PRESETS: AvatarConfig[] = [
  {
    id: 'fox',
    name: 'Fox',
    species: 'Fox',
    imageUrl: animeFox,
    primaryColor: '#F97316',
    secondaryColor: '#FFFFFF',
    accentColor: '#00F0FF',
    glowColor: 'rgba(249, 115, 22, 0.6)',
    tagline: 'Cunning & Agile'
  },
  {
    id: 'panda',
    name: 'Panda',
    species: 'Panda',
    imageUrl: animePanda,
    primaryColor: '#F8FAFC',
    secondaryColor: '#0F172A',
    accentColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    tagline: 'Calm & Inscrutable'
  },
  {
    id: 'lion',
    name: 'Lion',
    species: 'Lion',
    imageUrl: animeLion,
    primaryColor: '#EAB308',
    secondaryColor: '#78350F',
    accentColor: '#EF4444',
    glowColor: 'rgba(234, 179, 8, 0.6)',
    tagline: 'Commanding & Regal'
  },
  {
    id: 'tiger',
    name: 'Tiger',
    species: 'Tiger',
    imageUrl: animeTiger,
    primaryColor: '#EA580C',
    secondaryColor: '#18181B',
    accentColor: '#F59E0B',
    glowColor: 'rgba(234, 88, 12, 0.6)',
    tagline: 'Fierce & Fearless'
  },
  {
    id: 'cat',
    name: 'Cat',
    species: 'Cat',
    imageUrl: animeCat,
    primaryColor: '#A855F7',
    secondaryColor: '#E9D5FF',
    accentColor: '#EC4899',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    tagline: 'Stealthy & Mysterious'
  },
  {
    id: 'wolf',
    name: 'Wolf',
    species: 'Wolf',
    imageUrl: animeWolf,
    primaryColor: '#38BDF8',
    secondaryColor: '#1E293B',
    accentColor: '#06B6D4',
    glowColor: 'rgba(56, 189, 248, 0.6)',
    tagline: 'Leader of the Pack'
  },
  {
    id: 'bear',
    name: 'Bear',
    species: 'Bear',
    imageUrl: animeBear,
    primaryColor: '#B45309',
    secondaryColor: '#78350F',
    accentColor: '#F59E0B',
    glowColor: 'rgba(180, 83, 9, 0.6)',
    tagline: 'Powerful & Warm'
  },
  {
    id: 'owl',
    name: 'Owl',
    species: 'Owl',
    imageUrl: animeOwl,
    primaryColor: '#818CF8',
    secondaryColor: '#312E81',
    accentColor: '#FACC15',
    glowColor: 'rgba(129, 140, 248, 0.6)',
    tagline: 'Wise & All-Seeing'
  },
  {
    id: 'rabbit',
    name: 'Rabbit',
    species: 'Rabbit',
    imageUrl: animeRabbit,
    primaryColor: '#FB7185',
    secondaryColor: '#FFE4E6',
    accentColor: '#E11D48',
    glowColor: 'rgba(251, 113, 133, 0.6)',
    tagline: 'Quick-Witted & Cute'
  },
  {
    id: 'dragon',
    name: 'Dragon',
    species: 'Dragon',
    imageUrl: animeDragon,
    primaryColor: '#10B981',
    secondaryColor: '#064E3B',
    accentColor: '#F59E0B',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    tagline: 'Ancient & Mythical'
  },
  {
    id: 'shark',
    name: 'Shark',
    species: 'Shark',
    imageUrl: animeShark,
    primaryColor: '#0EA5E9',
    secondaryColor: '#0C4A6E',
    accentColor: '#38BDF8',
    glowColor: 'rgba(14, 165, 233, 0.6)',
    tagline: 'Sharp Ocean Hunter'
  },
  {
    id: 'eagle',
    name: 'Eagle',
    species: 'Eagle',
    imageUrl: animeEagle,
    primaryColor: '#FBBF24',
    secondaryColor: '#451A03',
    accentColor: '#38BDF8',
    glowColor: 'rgba(251, 191, 36, 0.6)',
    tagline: 'Sharp-Eyed Detective'
  },
  {
    id: 'monkey',
    name: 'Monkey',
    species: 'Monkey',
    imageUrl: animeMonkey,
    primaryColor: '#D97706',
    secondaryColor: '#78350F',
    accentColor: '#10B981',
    glowColor: 'rgba(217, 119, 6, 0.6)',
    tagline: 'Playful & Clever'
  },
  {
    id: 'raccoon',
    name: 'Raccoon',
    species: 'Raccoon',
    imageUrl: animeRaccoon,
    primaryColor: '#94A3B8',
    secondaryColor: '#0F172A',
    accentColor: '#CBD5E1',
    glowColor: 'rgba(148, 163, 184, 0.6)',
    tagline: 'Master of Sleight'
  },
  {
    id: 'frog',
    name: 'Frog',
    species: 'Frog',
    imageUrl: animeFrog,
    primaryColor: '#22C55E',
    secondaryColor: '#14532D',
    accentColor: '#EF4444',
    glowColor: 'rgba(34, 197, 94, 0.6)',
    tagline: 'Vibrant & Nimble'
  },
  {
    id: 'penguin',
    name: 'Penguin',
    species: 'Penguin',
    imageUrl: animePenguin,
    primaryColor: '#38BDF8',
    secondaryColor: '#0F172A',
    accentColor: '#F59E0B',
    glowColor: 'rgba(56, 189, 248, 0.6)',
    tagline: 'Cool & Analytical'
  },
  {
    id: 'koala',
    name: 'Koala',
    species: 'Koala',
    imageUrl: animeKoala,
    primaryColor: '#94A3B8',
    secondaryColor: '#334155',
    accentColor: '#22C55E',
    glowColor: 'rgba(148, 163, 184, 0.6)',
    tagline: 'Calm & Perceptive'
  },
  {
    id: 'deer',
    name: 'Deer',
    species: 'Deer',
    imageUrl: animeDeer,
    primaryColor: '#EC4899',
    secondaryColor: '#831843',
    accentColor: '#F472B6',
    glowColor: 'rgba(236, 72, 153, 0.6)',
    tagline: 'Noble & Gentle'
  }
];

export const getAvatarConfig = (type: AvatarType): AvatarConfig => {
  return AVATAR_PRESETS.find(a => a.id === type) || AVATAR_PRESETS[0];
};
