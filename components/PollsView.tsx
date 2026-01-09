
import React, { useState, useEffect } from 'react';
import { User, UserRole, Poll } from '../types';
import { supabase } from '../lib/supabase';

interface PollsViewProps {
  user: User;
  polls: Poll[];
  setPolls: React.Dispatch<React.SetStateAction<Poll[]>>;
}

const PollsView: React.FC<PollsViewProps> = ({ user, polls, setPolls }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState<string | null>(null);

  const fetchPolls = async () => {
    try {
      const { data: pollsData, error: pollsError } = await supabase
        .from('polls')
        .select('*')
        .order('created_at', { ascending: false });

      if (pollsError) throw pollsError;

      const fullPolls = await Promise.all((pollsData || []).map(async (p) => {
        const { data: options } = await supabase
          .from('poll_options')
          .select('*')
          .eq('poll_id', p.id);

        const { data: votes } = await supabase
          .from('poll_votes')
          .select('unit_id')
          .eq('poll_id', p.id);

        const isExpired = new Date(p.end_date) < new Date();

        return {
          id: p.id,
          title: p.title,
          description: p.description,
          active: p.active && !isExpired,
          endDate: new Date(p.end_date),
          votedUnits: votes?.map(v => v.unit_id) || [],
          options: options?.map(o => ({
            id: o.id,
            text: o.text,
            votes: o.votes_count
          })) || []
        };
      }));

      setPolls(fullPolls as any);
    } catch (error) {
      console.error("Erro ao carregar enquetes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();

    // Inscrição em tempo real para novos votos
    const votesSubscription = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'poll_votes' },
        () => {
          // Recarrega os dados quando um novo voto for detectado para manter sincronismo
          fetchPolls();
        }
      )
      .subscribe();

    // Timer para checar expiração a cada minuto e atualizar UI automaticamente
    const expiryCheck = setInterval(() => {
      setPolls(prev => prev.map(p => {
        const isExpired = new Date(p.endDate) < new Date();
        if (p.active && isExpired) {
          return { ...p, active: false };
        }
        return p;
      }));
    }, 30000);

    return () => {
      supabase.removeChannel(votesSubscription);
      clearInterval(expiryCheck);
    };
  }, []);

  const handleVote = async (pollId: string, optionId: string) => {
    const poll = polls.find(p => p.id === pollId);
    if (!poll || !poll.active || poll.votedUnits.includes(user.unit)) return;

    setVotingId(optionId);

    try {
      const { error: voteError } = await supabase
        .from('poll_votes')
        .insert({
          poll_id: pollId,
          user_id: user.id,
          unit_id: user.unit,
          option_id: optionId
        });

      if (voteError) throw voteError;

      // Chama a função atômica no Supabase
      await supabase.rpc('increment_poll_vote', { option_row_id: optionId });

      // Atualização otimista local
      setPolls(prev => prev.map(p => {
        if (p.id === pollId) {
          const newOptions = p.options.map(o => o.id === optionId ? { ...o, votes: o.votes + 1 } : o);
          return { ...p, options: newOptions, votedUnits: [...p.votedUnits, user.unit] };
        }
        return p;
      }));

    } catch (error) {
      console.error("Erro ao votar:", error);
      alert("Erro ao registrar voto. Verifique se sua unidade já participou.");
    } finally {
      setVotingId(null);
    }
  };

  const createPoll = async () => {
    if (!newTitle || !newDesc) return;

    try {
      const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .insert({
          title: newTitle,
          description: newDesc,
          end_date: endDate,
          active: true
        })
        .select()
        .single();

      if (pollError) throw pollError;

      const optionsToInsert = [
        { poll_id: pollData.id, text: 'Sim', votes_count: 0 },
        { poll_id: pollData.id, text: 'Não', votes_count: 0 },
        { poll_id: pollData.id, text: 'Abstenção', votes_count: 0 }
      ];

      await supabase.from('poll_options').insert(optionsToInsert);

      fetchPolls();
      setShowCreate(false);
      setNewTitle('');
      setNewDesc('');
    } catch (error) {
      console.error("Erro ao criar enquete:", error);
    }
  };

  if (loading && polls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <i className="fa-solid fa-circle-notch fa-spin text-4xl text-brand-3"></i>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Sincronizando com a Governança...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Assembleias Digitais</h1>
          <p className="text-slate-500 dark:text-brand-4 font-medium italic">O poder de decisão em suas mãos.</p>
        </div>
        {user.role === UserRole.SINDICO && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-brand-1 dark:bg-brand-3 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-2 transition-all flex items-center gap-2 shadow-lg"
          >
            <i className="fa-solid fa-gavel"></i> Abrir Votação
          </button>
        )}
      </div>

      {showCreate && (
        <div className="bg-white dark:bg-white/5 p-8 rounded-2xl border-2 border-brand-4 dark:border-white/10 shadow-xl space-y-4 animate-in zoom-in duration-300">
          <h3 className="font-bold text-lg dark:text-white">Nova Pauta de Votação</h3>
          <input
            type="text"
            placeholder="Título da Enquete"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-brand-3/20 outline-none"
          />
          <textarea
            placeholder="Explique os detalhes da votação..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-slate-800 dark:text-white h-24 resize-none outline-none focus:ring-2 focus:ring-brand-3/20"
          ></textarea>
          <div className="flex gap-4">
            <button onClick={createPoll} className="flex-1 bg-brand-1 dark:bg-brand-3 text-white py-3 rounded-xl font-bold">Lançar Assembleia</button>
            <button onClick={() => setShowCreate(false)} className="px-6 py-3 bg-slate-100 dark:bg-white/10 rounded-xl font-bold text-slate-600 dark:text-brand-4">Cancelar</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {polls.map(p => {
          const hasVoted = p.votedUnits.includes(user.unit);
          const totalVotes = p.options.reduce((acc, curr) => acc + curr.votes, 0);

          return (
            <div key={p.id} className={`bg-white dark:bg-white/5 rounded-3xl border-2 ${!p.active ? 'border-slate-100 dark:border-white/5 opacity-80' : 'border-brand-5 dark:border-brand-3/20'} shadow-sm flex flex-col transition-all relative group`}>
              {!p.active && (
                <div className="absolute top-4 right-4 z-10">
                   <div className="bg-slate-800 text-white text-[10px] font-black px-2 py-1 rounded flex items-center gap-1">
                     <i className="fa-solid fa-lock"></i> ENCERRADA
                   </div>
                </div>
              )}

              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${p.active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                    {p.active ? 'Status: Ativo' : 'Status: Finalizado'}
                  </span>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Prazo Final</p>
                    <p className={`text-xs font-black ${p.active ? 'text-brand-2 dark:text-brand-3' : 'text-slate-500'}`}>
                      {p.endDate.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-black text-brand-1 dark:text-white leading-tight mb-2">{p.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{p.description}</p>

                <div className="mt-8 space-y-5">
                  {p.options.map(opt => {
                    const percent = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
                    const isVotingThis = votingId === opt.id;

                    return (
                      <div key={opt.id} className="relative">
                        <div className="flex justify-between items-center mb-1.5 px-1">
                          <span className="text-[11px] font-extrabold text-slate-600 dark:text-slate-300 uppercase">{opt.text}</span>
                          <span className="text-[11px] font-black text-brand-1 dark:text-brand-3">{percent}% ({opt.votes})</span>
                        </div>
                        <div className="h-4 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden p-0.5 border border-slate-50 dark:border-white/10">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ease-out ${p.active ? (hasVoted ? 'bg-brand-3' : 'bg-brand-4') : 'bg-slate-400 dark:bg-slate-600'}`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        
                        {p.active && !hasVoted && (
                          <button
                            onClick={() => handleVote(p.id, opt.id)}
                            disabled={!!votingId}
                            className="w-full mt-2 py-2 text-[10px] font-black text-brand-2 dark:text-brand-4 border border-brand-4/50 dark:border-brand-4/20 rounded-xl hover:bg-brand-2 hover:text-white transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                          >
                            {isVotingThis ? <i className="fa-solid fa-spinner fa-spin"></i> : `Votar em ${opt.text}`}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={`px-8 py-4 border-t ${hasVoted ? 'bg-brand-5/20 dark:bg-brand-3/5 border-brand-5' : 'bg-slate-50/50 dark:bg-white/5 border-slate-100 dark:border-white/10'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <i className={`fa-solid ${hasVoted ? 'fa-circle-check text-emerald-500' : 'fa-circle-info text-slate-300'}`}></i>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-brand-4 uppercase tracking-tighter">
                      {hasVoted ? `Voto da Unidade ${user.unit} Confirmado` : 'Aguardando participação da unidade'}
                    </span>
                  </div>
                  {!p.active && (
                    <button className="text-[9px] font-black text-brand-1 dark:text-white bg-white dark:bg-white/10 px-2 py-1 rounded shadow-sm hover:shadow-md transition-all uppercase">
                      Ver Ata <i className="fa-solid fa-file-pdf ml-1 text-red-500"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PollsView;
