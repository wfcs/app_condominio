
import React from 'react';
import { User, UserRole, Poll, Announcement, OperationalTask, Notification } from '../types';

interface DashboardProps {
  user: User;
  polls: Poll[];
  announcements: Announcement[];
  tasks: OperationalTask[];
  notifications: Notification[];
  onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, polls, announcements, tasks, notifications, onNavigate }) => {
  const stats = [
    { label: 'Votações Ativas', value: polls.filter(p => p.active).length, icon: 'fa-check-to-slot', color: 'bg-brand-1 dark:bg-brand-2', tab: 'polls' },
    { label: 'Avisos no Mural', value: announcements.length, icon: 'fa-bullhorn', color: 'bg-brand-2 dark:bg-brand-3', tab: 'board' },
    { label: 'Chamados STAFF', value: tasks.filter(t => t.status !== 'Resolvido').length, icon: 'fa-screwdriver-wrench', color: 'bg-brand-3 dark:bg-brand-2', tab: 'operational' },
    { label: 'Mensagens Privadas', value: notifications.length, icon: 'fa-bell', color: 'bg-brand-4 dark:bg-brand-5 text-brand-1', tab: 'dashboard' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-1 dark:text-white tracking-tight">Painel Executivo</h1>
          <p className="text-slate-500 dark:text-brand-4 font-medium">Gestão em tempo real • {user.unit}</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-xs font-bold text-slate-400 dark:text-brand-3 uppercase tracking-widest">Status da Rede</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-bold text-slate-700 dark:text-brand-5">Fluxibi Online</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div 
            key={i} 
            onClick={() => onNavigate(s.tab)}
            className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm flex items-center gap-5 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className={`${s.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-1/5 group-hover:scale-110 transition-transform`}>
              <i className={`fa-solid ${s.icon} text-xl`}></i>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-brand-4 uppercase tracking-tight">{s.label}</p>
              <p className="text-2xl font-black text-brand-1 dark:text-brand-3">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 dark:border-white/10 flex justify-between items-center bg-white dark:bg-transparent">
            <h3 className="font-bold text-brand-1 dark:text-white flex items-center gap-2">
              <i className="fa-solid fa-newspaper text-brand-3"></i>
              Comunicados Importantes
            </h3>
            <button 
              onClick={() => onNavigate('board')}
              className="text-brand-2 dark:text-brand-3 text-xs font-bold uppercase tracking-widest hover:text-brand-1 transition-colors"
            >
              Ver Tudo
            </button>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-white/10">
            {announcements.slice(0, 4).map(a => (
              <div 
                key={a.id} 
                onClick={() => onNavigate('board')}
                className="p-6 hover:bg-neutral-surface dark:hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-5">
                  <div className="shrink-0 mt-1">
                    <span className="px-2 py-1 bg-brand-5 dark:bg-brand-2/20 text-brand-2 dark:text-brand-4 text-[9px] font-black rounded-lg uppercase tracking-tighter">
                      {a.category}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-brand-1 dark:text-slate-100 group-hover:text-brand-2 transition-colors">{a.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">{a.content}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-brand-4 uppercase tracking-tighter">
                        <i className="fa-regular fa-calendar mr-1"></i>
                        {new Date(a.date).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-[10px] font-bold text-brand-3 dark:text-brand-3 uppercase tracking-tighter">
                        <i className="fa-solid fa-user-pen mr-1"></i>
                        {a.author}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {announcements.length === 0 && (
              <div className="p-10 text-center text-slate-400 italic text-sm">Nenhum comunicado recente.</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden h-fit">
          <div className="p-6 border-b border-slate-50 dark:border-white/10 bg-white dark:bg-transparent">
            <h3 className="font-bold text-brand-1 dark:text-white flex items-center gap-2">
              <i className="fa-solid fa-bolt text-brand-3"></i>
              Ações Imediatas
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {user.role === UserRole.MORADOR ? (
              polls.filter(p => p.active && !p.votedUnits.includes(user.unit)).length > 0 ? (
                polls.filter(p => p.active && !p.votedUnits.includes(user.unit)).slice(0, 2).map(p => (
                  <div key={p.id} className="bg-neutral-surface dark:bg-brand-2/10 p-5 rounded-2xl border border-brand-4 dark:border-brand-2/30">
                    <h4 className="font-bold text-brand-1 dark:text-slate-200 text-sm">{p.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enquete em aberto na rede.</p>
                    <button 
                      onClick={() => onNavigate('polls')}
                      className="mt-4 w-full bg-brand-1 dark:bg-brand-3 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-brand-2 transition-all shadow-md shadow-brand-1/10"
                    >
                      Votar Agora
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-slate-400 text-xs">Sem votações pendentes.</div>
              )
            ) : (
              tasks.filter(t => t.status !== 'Resolvido').length > 0 ? (
                tasks.filter(t => t.status !== 'Resolvido').slice(0, 3).map(t => (
                  <div 
                    key={t.id} 
                    onClick={() => onNavigate('operational')}
                    className="flex items-center gap-4 p-4 border-l-4 border-brand-2 bg-neutral-surface dark:bg-brand-2/10 rounded-r-2xl cursor-pointer hover:bg-brand-5 dark:hover:bg-brand-2/20 transition-colors"
                  >
                    <div className="shrink-0 w-10 h-10 bg-white dark:bg-slate-800 shadow-sm rounded-xl flex items-center justify-center text-brand-1 dark:text-brand-4 border border-slate-100 dark:border-white/10">
                      <i className="fa-solid fa-hammer"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-brand-1 dark:text-brand-4 text-xs truncate">{t.description}</p>
                      <p className="text-[10px] text-brand-2 dark:text-brand-3 uppercase font-black mt-1 tracking-tighter">
                        {t.priority} PRIORITY
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-slate-400 text-xs">Sem tarefas pendentes.</div>
              )
            )}
            <button 
              onClick={() => onNavigate(user.role === UserRole.MORADOR ? 'board' : 'operational')}
              className="w-full border-2 border-dashed border-slate-200 dark:border-white/10 text-slate-400 dark:text-brand-4 py-3 rounded-2xl text-xs font-bold hover:border-brand-3 hover:text-brand-3 transition-all"
            >
              Ver Histórico Completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
