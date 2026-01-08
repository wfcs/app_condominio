
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
    { id: 'polls', label: 'Votações', icon: 'fa-square-check', roles: [UserRole.MORADOR, UserRole.SINDICO] },
    { id: 'board', label: 'Mural', icon: 'fa-clipboard-list', roles: Object.values(UserRole) },
    { id: 'gatehouse', label: 'Portaria', icon: 'fa-shield-halved', roles: [UserRole.PORTARIA, UserRole.SINDICO] },
    { id: 'operational', label: 'Operacional', icon: 'fa-tools', roles: [UserRole.MANUTENCAO, UserRole.SINDICO] },
    { id: 'management', label: 'Gestão de Usuários', icon: 'fa-users-gear', roles: [UserRole.SINDICO] },
  ];

  const visibleItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="bg-brand-1 text-white w-full md:w-64 flex flex-col shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-brand-3 p-2 rounded-lg">
            <i className="fa-solid fa-building text-xl text-brand-1"></i>
          </div>
          <span className="text-xl font-bold tracking-tight">CondoConnect</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {visibleItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === item.id ? 'bg-brand-2 text-white shadow-lg shadow-black/20' : 'text-brand-4/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-brand-4/60 hover:text-red-400 hover:bg-white/10 transition-colors"
        >
          <i className="fa-solid fa-right-from-bracket w-5 text-center"></i>
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
