import React, { useState } from 'react';
import { Home, History, User } from 'lucide-react';
import appIcon from '../public/app-icon.jpg';
import { SplashScreen } from './components/profile/SplashScreen';
import { ProfileCreationScreen, PlayerProfileData } from './components/profile/ProfileCreationScreen';
import { GameModesScreen } from './components/modes/GameModesScreen';
import { PassPlayFlow } from './components/passplay/PassPlayFlow';
import { WifiHotspotMultiplayer } from './components/multiplayer/WifiHotspotMultiplayer';
import { GameHistoryScreen } from './components/history/GameHistoryScreen';
import { Avatar2D } from './components/Avatar2D';
import { soundEffects } from './utils/audio';
import { getSavedProfile, saveProfileRecord } from './utils/profile';

type ActiveScreen = 'SPLASH' | 'PROFILE_CREATION' | 'GAME_MODES' | 'PASS_PLAY' | 'LOCAL_WIFI' | 'HISTORY';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('SPLASH');
  
  const [userProfile, setUserProfile] = useState<PlayerProfileData>(() => {
    return getSavedProfile() || {
      name: '',
      avatar: 'fox',
      age: 18
    };
  });

  const handleSplashDone = () => {
    const saved = getSavedProfile();
    if (saved && saved.name) {
      setActiveScreen('GAME_MODES');
    } else {
      setActiveScreen('PROFILE_CREATION');
    }
  };

  const handleSaveProfile = (profile: PlayerProfileData) => {
    setUserProfile(profile);
    saveProfileRecord(profile);
    setActiveScreen('GAME_MODES');
  };

  const handleSelectMode = (mode: 'PASS_PLAY' | 'LOCAL_WIFI') => {
    soundEffects.playTap();
    setActiveScreen(mode);
  };

  return (
    <div className="h-[100dvh] bg-[#090D13] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col w-full h-full max-w-md mx-auto bg-[#0D1117] relative shadow-2xl overflow-hidden">
          
          {['GAME_MODES', 'HISTORY', 'PASS_PLAY', 'LOCAL_WIFI'].includes(activeScreen) && !!userProfile.name && (
            <header className="flex items-center justify-between px-4 py-3 bg-[#161B22] border-b border-slate-800 z-20 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-gradient-to-tr from-amber-500 via-rose-500 to-cyan-400 p-[1px]">
                  <img src={appIcon} alt="Logo" className="w-full h-full object-cover rounded-sm" />
                </div>
                <span className="text-[13px] font-black tracking-wider text-slate-100 uppercase">IMPOSTER PARTY</span>
              </div>
              
              <div className="flex items-center gap-2 bg-[#0D1117] px-2 py-1 rounded-full border border-slate-700/50">
                <Avatar2D avatarType={userProfile.avatar} size={20} className="w-5 h-5 rounded-full overflow-hidden" />
                <span className="text-[11px] font-bold text-slate-300 pr-1 truncate max-w-[80px]">{userProfile.name}</span>
              </div>
            </header>
          )}

          <div className="flex-1 overflow-hidden relative">
            {activeScreen === 'SPLASH' && (
              <SplashScreen onLoadingComplete={handleSplashDone} />
            )}

            {activeScreen === 'PROFILE_CREATION' && (
              <ProfileCreationScreen
                initialProfile={userProfile}
                onSaveProfile={handleSaveProfile}
                onBackToSplash={() => setActiveScreen('SPLASH')}
              />
            )}

            {activeScreen === 'GAME_MODES' && (
              <GameModesScreen
                userProfile={userProfile}
                onSelectPassPlay={() => handleSelectMode('PASS_PLAY')}
                onSelectLocalWifi={() => handleSelectMode('LOCAL_WIFI')}
              />
            )}

            {activeScreen === 'PASS_PLAY' && (
              <PassPlayFlow
                userProfile={userProfile}
                onBackToHome={() => setActiveScreen('GAME_MODES')}
              />
            )}

            {activeScreen === 'LOCAL_WIFI' && (
              <WifiHotspotMultiplayer
                userProfile={userProfile}
                onBackToHome={() => setActiveScreen('GAME_MODES')}
              />
            )}

            {activeScreen === 'HISTORY' && (
              <GameHistoryScreen
                onBack={() => setActiveScreen('GAME_MODES')}
                onPlayNewGame={() => setActiveScreen('GAME_MODES')}
              />
            )}
          </div>

          {['PROFILE_CREATION', 'GAME_MODES', 'HISTORY'].includes(activeScreen) && !!userProfile.name && (
            <div className="flex items-center justify-between px-6 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-[#161B22] border-t border-slate-800">
              <button
                onClick={() => {
                  soundEffects.playTap();
                  setActiveScreen('PROFILE_CREATION');
                }}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  activeScreen === 'PROFILE_CREATION' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="text-[10px] font-bold">Profile</span>
              </button>
              
              <button
                onClick={() => {
                  soundEffects.playTap();
                  setActiveScreen('GAME_MODES');
                }}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  activeScreen === 'GAME_MODES' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="text-[10px] font-bold">Modes</span>
              </button>
              
              <button
                onClick={() => {
                  soundEffects.playTap();
                  setActiveScreen('HISTORY');
                }}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  activeScreen === 'HISTORY' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <History className="w-5 h-5" />
                <span className="text-[10px] font-bold">History</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
