
import React, { useState } from 'react';
import { User, UserRole, Poll } from '../types';

interface PollsViewProps {
  user: User;
  polls: Poll[];
  setPolls: React.Dispatch<React.SetStateAction<Poll[]>>;
}

const PollsView: React.FC<PollsViewProps> = ({ user, polls, setPolls }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleVote = (pollId: string, optionId: string) => {
    setPolls(prev => prev.map(p => {
      if (p.id === pollId) {
        if (p.votedUnits.includes(user.unit)) return p;
        const newOptions = p.options.map(o => o.id === optionId ? { ...o, votes: o.votes + 1 } : o);
        return { ...p, options: newOptions, votedUnits: [...p.votedUnits, user.unit] };
      }
      return p;
    }));
  };

  const createPoll = () => {
    if (!newTitle || !newDesc) return;
    const poll: Poll = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      description: newDesc,
      active: true,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      votedUnits: [],
      options: [
        { id: '1', text: 'Sim', votes: 0 },
        { id: '2', text: 'Não', votes: 0 },
        { id: '3', text: 'Abstenção', votes: 0 }
      ]
    };
    setPolls([poll, ...polls]);
    setShowCreate(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Assembleias e Votações</h1>
          <p className="text-slate-500">Participe das decisões do seu condomínio.</p>
        </div>
        {user.role === UserRole.SINDICO && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i> Nova Enquete
          </button>
        )}
      </div>

      {showCreate && (
        <div className="bg-white p-8 rounded-2xl border-2 border-indigo-100 shadow-xl space-y-4">
          <h3 className="font-bold text-lg">Criar Nova Votação</h3>
          <input
            type="text"
            placeholder="Título da Enquete"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20"
          />
          <textarea
            placeholder="Descrição detalhada"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 h-24 resize-none"
          ></textarea>
          <div className="flex gap-4">
            <button onClick={createPoll} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold">Publicar Enquete</button>
            <button onClick={() => setShowCreate(false)} className="px-6 py-3 bg-slate-100 rounded-xl font-bold text-slate-600">Cancelar</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {polls.map(p => {
          const hasVoted = p.votedUnits.includes(user.unit);
          const totalVotes = p.options.reduce((acc, curr) => acc + curr.votes, 0);

          return (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${p.active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                    {p.active ? 'Ativa' : 'Encerrada'}
                  </span>
                  <span className="text-xs text-slate-400">Expira em {p.endDate.toLocaleDateString('pt-BR')}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800">{p.title}</h3>
                <p className="text-slate-500 text-sm mt-2">{p.description}</p>

                <div className="mt-8 space-y-4">
                  {p.options.map(opt => {
                    const percent = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
                    return (
                      <div key={opt.id}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-semibold text-slate-700">{opt.text}</span>
                          <span className="text-sm font-bold text-indigo-600">{opt.votes} votos ({percent}%)</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-1000 ${hasVoted ? 'bg-indigo-500' : 'bg-slate-300'}`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        {!hasVoted && p.active && (
                          <button
                            onClick={() => handleVote(p.id, opt.id)}
                            className="w-full mt-2 text-xs font-bold text-indigo-600 py-2 border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-all"
                          >
                            Votar em "{opt.text}"
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {hasVoted && (
                <div className="px-6 py-4 bg-indigo-50 border-t border-indigo-100 text-center">
                  <span className="text-indigo-600 text-sm font-bold">
                    <i className="fa-solid fa-check-circle mr-2"></i> Você já votou nesta enquete
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PollsView;
