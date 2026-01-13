
import React from 'react';
import { User, UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: 'fa-chart-line', roles: Object.values(UserRole) },
    { id: 'visitors', label: 'Visitantes', icon: 'fa-id-card-clip', roles: [UserRole.PORTARIA, UserRole.SINDICO] },
    { id: 'polls', label: 'Votações', icon: 'fa-square-check', roles: [UserRole.MORADOR, UserRole.SINDICO] },
    { id: 'board', label: 'Mural', icon: 'fa-clipboard-list', roles: [UserRole.MORADOR, UserRole.SINDICO] },
    { id: 'gatehouse', label: 'Portaria', icon: 'fa-shield-halved', roles: [UserRole.PORTARIA, UserRole.SINDICO] },
    { id: 'operational', label: 'Operacional', icon: 'fa-tools', roles: [UserRole.MANUTENCAO, UserRole.SINDICO] },
    { id: 'management', label: user.role === UserRole.SINDICO ? 'Administração' : 'Gestão', icon: 'fa-briefcase', roles: [UserRole.SINDICO] },
  ];

  const visibleItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="bg-brand-1 text-white w-full md:w-64 flex flex-col shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-brand-3 p-2 rounded-lg">
            <i className="fa-solid fa-building text-xl text-brand-1"></i>
          </div>
          <span className="text-xl font-black tracking-tight uppercase text-[15px]">CondoConnect</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {visibleItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-gradient-to-r from-brand-2 to-brand-3 text-white shadow-lg shadow-black/20 transform scale-[1.02]' 
                : 'text-brand-4/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5 text-center text-sm`}></i>
            <span className="font-bold text-[13px] uppercase tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="bg-white/5 p-4 rounded-2xl mb-4 text-center">
           <p className="text-[9px] font-black text-brand-3 uppercase tracking-widest mb-1">Licença Fluxibi</p>
           <p className="text-[10px] text-white/50 font-bold italic">Standard Plan</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-brand-4/60 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <i className="fa-solid fa-power-off w-5 text-center"></i>
          <span className="font-bold text-[13px] uppercase tracking-wide">Encerrar Sessão</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
