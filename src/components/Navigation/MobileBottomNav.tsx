import React from 'react';
import { Compass, Heart, Plus, Bell, User } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'explore' | 'favorites' | 'alerts' | 'profile';
  onSelectTab: (tab: 'explore' | 'favorites' | 'alerts' | 'profile') => void;
  onOpenPublish: () => void;
  favoritesCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenPublish,
  favoritesCount,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 safe-bottom md:hidden shadow-lg">
      <div className="flex items-center justify-around h-14 px-2">
        
        {/* Explorer */}
        <button
          onClick={() => onSelectTab('explore')}
          className={`flex flex-col items-center justify-center w-14 h-full transition-colors ${
            activeTab === 'explore' ? 'text-brand-600 font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <Compass className={`w-5 h-5 ${activeTab === 'explore' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5">Explorer</span>
        </button>

        {/* Favoris */}
        <button
          onClick={() => onSelectTab('favorites')}
          className={`flex flex-col items-center justify-center w-14 h-full relative transition-colors ${
            activeTab === 'favorites' ? 'text-brand-600 font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <Heart className={`w-5 h-5 ${activeTab === 'favorites' ? 'stroke-[2.5] text-rose-500 fill-rose-500' : 'stroke-2'}`} />
          {favoritesCount > 0 && (
            <span className="absolute top-1.5 right-2 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
          <span className="text-[10px] mt-0.5">Favoris</span>
        </button>

        {/* Center elevated + Publier button */}
        <div className="relative -top-3">
          <button
            onClick={onOpenPublish}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-700 to-emerald-500 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform border-2 border-white"
            aria-label="Publier une annonce"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Alertes */}
        <button
          onClick={() => onSelectTab('alerts')}
          className={`flex flex-col items-center justify-center w-14 h-full transition-colors ${
            activeTab === 'alerts' ? 'text-brand-600 font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <Bell className={`w-5 h-5 ${activeTab === 'alerts' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5">Alertes</span>
        </button>

        {/* Profil */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center w-14 h-full transition-colors ${
            activeTab === 'profile' ? 'text-brand-600 font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5">Profil</span>
        </button>

      </div>
    </div>
  );
};
