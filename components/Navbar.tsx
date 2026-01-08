
import React, { useState } from 'react';
import { User, Notification } from '../types';

interface NavbarProps {
  user: User;
  notifications: Notification[];
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, notifications, isDarkMode, toggleTheme }) => {
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header className="bg-white dark:bg-brand-1/80 border-b border-slate-200 dark:border-white/10 h-16 flex items-center justify-between px-6 shrink-0 relative z-10 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white hidden md:block">Bem-vindo, {user.name}</h2>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-brand-4 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-all duration-300 transform hover:rotate-12"
          title={isDarkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
        >
          {isDarkMode ? (
            <i className="fa-solid fa-sun text-xl text-brand-3"></i>
          ) : (
            <i className="fa-solid fa-moon text-xl"></i>
          )}
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowNotif(!showNotif)}
            className="p-2 text-slate-500 dark:text-brand-4 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors relative"
          >
            <i className="fa-regular fa-bell text-xl"></i>
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-brand-1">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-xl rounded-xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-4 border-b dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                <span className="font-bold text-sm dark:text-white">Notificações</span>
                <button onClick={() => setShowNotif(false)} className="text-slate-400 hover:text-slate-600"><i className="fa-solid fa-times"></i></button>
              </div>
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm">Sem notificações</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-4 border-b dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                      <div className="flex gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${n.type === 'entrega' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                          <i className={`fa-solid ${n.type === 'entrega' ? 'fa-box' : 'fa-user'}`}></i>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{n.description}</p>
                          <p className="text-xs text-slate-400 mt-1">{new Date(n.timestamp).toLocaleTimeString('pt-BR')}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">{user.unit}</p>
            <p className="text-xs text-slate-500 dark:text-brand-4 leading-tight">{user.role}</p>
          </div>
          <div className="w-10 h-10 bg-indigo-100 dark:bg-brand-2 text-indigo-700 dark:text-white flex items-center justify-center rounded-full font-bold">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
