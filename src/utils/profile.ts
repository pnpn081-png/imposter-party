import { PlayerProfileData } from '../components/profile/ProfileCreationScreen';

const PROFILE_STORAGE_KEY = 'imposter_party_user_profile_v2';

export const DEFAULT_PROFILE: PlayerProfileData = {
  name: '',
  avatar: 'fox',
  age: 18,
  title: 'Sharp Sleuth',
  catchphrase: 'Always innocent until proven guilty!',
  pronouns: 'He/Him',
  favoriteCategory: 'fruits_food',
  playstyle: 'ANALYTICAL',
  soundEnabled: true,
  hapticsEnabled: true
};

export function getSavedProfile(): PlayerProfileData | null {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY) || localStorage.getItem('imposter_party_user_profile_v1');
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.name === 'string' && parsed.name.trim().length > 0) {
      return {
        name: parsed.name.trim(),
        avatar: parsed.avatar || 'fox',
        age: typeof parsed.age === 'number' ? parsed.age : 18,
        title: parsed.title || 'Sharp Sleuth',
        catchphrase: parsed.catchphrase || 'Always innocent until proven guilty!',
        pronouns: parsed.pronouns || 'He/Him',
        favoriteCategory: parsed.favoriteCategory || 'fruits_food',
        playstyle: parsed.playstyle || 'ANALYTICAL',
        soundEnabled: parsed.soundEnabled !== false,
        hapticsEnabled: parsed.hapticsEnabled !== false
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function saveProfileRecord(profile: PlayerProfileData): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save profile:', error);
  }
}
