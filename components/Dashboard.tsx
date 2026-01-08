
import React from 'react';
import { User, UserRole, Poll, Announcement, OperationalTask, Notification } from '../types';

interface DashboardProps {
  user: User;
  polls: Poll[];
  announcements: Announcement[];
  tasks: OperationalTask[];
  notifications: Notification[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, polls, announcements, tasks, notifications }) => {
  const stats = [
    { label: 'Enquetes Ativas', value: polls.filter(p => p.active).length, icon: 'fa-check-to-slot', color: 'bg-brand-1' },
    { label: 'Mural Recente', value: announcements.length, icon: 'fa-bullhorn', color: 'bg-brand-2' },
    { label: 'Ordens Abertas', value: tasks.filter(t => t.status !== 'Resolvido').length, icon: 'fa-screwdriver-wrench', color: 'bg-brand-3' },
    { label: 'Suas Notificações', value: notifications.length, icon: 'fa-bell', color: 'bg-blue-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-brand-1">Painel de Controle</h1>
        <p className="text-brand-2">Gestão centralizada do condomínio.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-brand-4 shadow-sm flex items-center gap-4">
            <div className={`${s.color} p-4 rounded-xl text-white shadow-lg shadow-black/5`}>
              <i className={`fa-solid ${s.icon} text-xl`}></i>
            </div>
            <div>
              <p className="text-sm text-brand-2 font-medium">{s.label}</p>
              <p className="text-2xl font-bold text-brand-1">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-brand-4 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-brand-5 flex justify-between items-center bg-brand-5/30">
            <h3 className="font-bold text-brand-1">Últimos Comunicados</h3>
            <span className="text-brand-2 text-sm font-medium cursor-pointer hover:text-brand-1 transition-colors">Ver todos</span>
          </div>
          <div className="divide-y divide-brand-5">
            {announcements.slice(0, 3).map(a => (
              <div key={a.id} className="p-6 hover:bg-brand-5/20 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="px-2 py-1 bg-brand-4 text-brand-1 text-[10px] font-bold rounded uppercase">
                    {a.category}
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-1">{a.title}</h4>
                    <p className="text-sm text-brand-2 line-clamp-1 mt-1">{a.content}</p>
                    <p className="text-xs text-brand-3 mt-2 font-medium">
                      <i className="fa-regular fa-calendar-days mr-1 text-brand-3"></i>
                      {new Date(a.date).toLocaleDateString('pt-BR')} • {a.author}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-brand-4 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-brand-5 flex justify-between items-center bg-brand-5/30">
            <h3 className="font-bold text-brand-1">
              {user.role === UserRole.MORADOR ? 'Enquetes Pendentes' : 'Chamados Operacionais'}
            </h3>
            <span className="text-brand-2 text-sm font-medium cursor-pointer hover:text-brand-1 transition-colors">Gerenciar</span>
          </div>
          <div className="p-6 space-y-4">
            {user.role === UserRole.MORADOR ? (
              polls.filter(p => p.active && !p.votedUnits.includes(user.unit)).map(p => (
                <div key={p.id} className="bg-brand-5/30 p-4 rounded-xl border border-brand-4">
                  <h4 className="font-semibold text-brand-1">{p.title}</h4>
                  <p className="text-sm text-brand-2 mt-1">{p.description}</p>
                  <button className="mt-3 w-full bg-white border border-brand-3 text-brand-2 py-2 rounded-lg font-bold hover:bg-brand-3 hover:text-white transition-all">
                    Votar agora
                  </button>
                </div>
              ))
            ) : (
              tasks.filter(t => t.status !== 'Resolvido').map(t => (
                <div key={t.id} className="flex items-center gap-4 p-3 border-l-4 border-brand-2 bg-brand-5/50 rounded-r-lg">
                  <div className="shrink-0 w-10 h-10 bg-brand-4 rounded-full flex items-center justify-center text-brand-1">
                    <i className="fa-solid fa-screwdriver-wrench"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-brand-1 truncate">{t.description}</p>
                    <p className="text-xs text-brand-2 uppercase tracking-wider font-bold mt-0.5">{t.priority} • {t.type}</p>
                  </div>
                </div>
              ))
            )}
            {(user.role === UserRole.MORADOR ? polls.length === 0 : tasks.length === 0) && (
              <p className="text-center py-8 text-brand-4 font-medium text-sm">Nenhuma pendência encontrada.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
