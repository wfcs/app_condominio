
import React, { useState } from 'react';
import { User, Notification } from '../types';

interface NavbarProps {
  user: User;
  notifications: Notification[];
}

const Navbar: React.FC<NavbarProps> = ({ user, notifications }) => {
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 relative z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-800 hidden md:block">Bem-vindo, {user.name}</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button 
            onClick={() => setShowNotif(!showNotif)}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative"
          >
            <i className="fa-regular fa-bell text-xl"></i>
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                <span className="font-bold text-sm">Notificações</span>
                <button onClick={() => setShowNotif(false)} className="text-slate-400 hover:text-slate-600"><i className="fa-solid fa-times"></i></button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm">Sem notificações</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-4 border-b hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${n.type === 'entrega' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                          <i className={`fa-solid ${n.type === 'entrega' ? 'fa-box' : 'fa-user'}`}></i>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{n.description}</p>
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

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{user.unit}</p>
            <p className="text-xs text-slate-500 leading-tight">{user.role}</p>
          </div>
          <div className="w-10 h-10 bg-indigo-100 text-indigo-700 flex items-center justify-center rounded-full font-bold">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
