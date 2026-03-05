import React from 'react';
import { Palette, Users, Banknote, User, Users as UsersIcon, Landmark } from 'lucide-react';
import { useFilterStore } from '../store/useFilterStore';

export const ProfileSelector = () => {
  const { entityType, profile, setFiltro } = useFilterStore();

  const entities = [
    { id: 'Artistas', label: 'Artistas', icon: User },
    { id: 'Agrupaciones', label: 'Agrupaciones', icon: UsersIcon },
    { id: 'Entidades', label: 'Entidades', icon: Landmark },
  ];

  const tabs = [
    { id: 'artistico', label: 'Perfil Artístico', emoji: '', icon: Palette, color: 'text-accent-primary' },
    { id: 'demografico', label: 'Perfil Demográfico', emoji: '', icon: Users, color: 'text-accent-primary' },
    { id: 'socioeconomico', label: 'Perfil Socioeconómico', emoji: '', icon: Banknote, color: 'text-accent-primary' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-panel-bg/30 p-4 rounded-[2rem] border border-border-light">
        {/* Entity Type Selector */}
        <div className="flex bg-panel-bg p-1.5 rounded-2xl border border-border-light shadow-sm">
          {entities.map((entity) => {
            const Icon = entity.icon;
            const isActive = entityType === entity.id;
            return (
              <button
                key={entity.id}
                onClick={() => setFiltro('entityType', entity.id)}
                className={`
                  flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
                  ${isActive 
                    ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/20 scale-[1.05]' 
                    : 'text-text-muted hover:text-text-dark hover:bg-app-bg'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-text-muted'}`} />
                {entity.label}
              </button>
            );
          })}
        </div>

        {/* Profile Buttons - Only visible for Artistas */}
        <div className={`flex flex-wrap gap-3 transition-all duration-500 ${entityType === 'Artistas' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = profile === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setFiltro('profile', tab.id)}
                className={`
                  flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all duration-300
                  ${isActive 
                    ? 'bg-panel-bg shadow-md border-2 border-accent-primary scale-[1.02]' 
                    : 'bg-panel-bg/50 hover:bg-panel-bg border-2 border-transparent text-text-muted opacity-70 hover:opacity-100'
                  }
                  group
                `}
              >
                <div className={`p-1.5 rounded-xl ${isActive ? 'bg-app-bg' : 'bg-transparent'} transition-colors`}>
                  <Icon className={`w-4 h-4 ${isActive ? tab.color : 'text-text-muted'}`} />
                </div>
                <span className={`font-bold text-xs whitespace-nowrap ${isActive ? 'text-text-dark' : 'text-text-muted'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      
    </div>
  );
};
