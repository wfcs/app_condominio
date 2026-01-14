
import React, { useState, useEffect, useCallback } from 'react';
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
  const [errorInfo, setErrorInfo] = useState<string | null>(null);

  const fetchPolls = useCallback(async () => {
    try {
      setLoading(true);
      const { data: pollsData, error: pollsError } = await supabase
        .from('polls')
        .select('*')
        .eq('client_id', user.clientId)
        .order('created_at', { ascending: false });

      if (pollsError) throw pollsError;

      if (!pollsData || pollsData.length === 0) {
        setLoading(false);
        return;
      }

      const fullPolls = await Promise.all(pollsData.map(async (p) => {
        try {
          const [optionsRes, votesRes] = await Promise.all([
            supabase.from('poll_options').select('*').eq('poll_id', p.id),
            supabase.from('poll_votes').select('unit_id').eq('poll_id', p.id)
          ]);

          const isExpired = new Date(p.end_date) < new Date();

          return {
            id: p.id,
            clientId: p.client_id,
            title: p.title,
            description: p.description,
            active: p.active && !isExpired,
            endDate: new Date(p.end_date),
            votedUnits: votesRes.data?.map(v => v.unit_id) || [],
            options: optionsRes.data?.map(o => ({
              id: o.id,
              text: o.text,
              votes: o.votes_count || 0
            })) || []
          };
        } catch (innerErr) {
          return null;
        }
      }));

      const validPolls = fullPolls.filter((p): p is any => p !== null);
      setPolls(validPolls);
      setErrorInfo(null);
    } catch (error: any) {
      console.error("Polls Fetch Error:", error);
      const message = error?.message || (typeof error === 'string' ? error : "Erro de conexão com o banco.");
      setErrorInfo(message);
    } finally {
      setLoading(false);
    }
  }, [user.clientId, setPolls]);

  useEffect(() => {
    fetchPolls();
    
    const channel = supabase
      .channel(`polls-${user.clientId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'polls' }, fetchPolls)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'poll_votes' }, fetchPolls)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPolls, user.clientId]);

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
      await fetchPolls();
    } catch (error: any) {
      alert(`Erro ao votar: ${error.message || "Erro desconhecido"}`);
    } finally {
      setVotingId(null);
    }
  };

  const createPoll = async () => {
    if (!newTitle.trim() || !newDesc.trim()) return;
    try {
      const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .insert({
          title: newTitle,
          description: newDesc,
          end_date: endDate,
          active: true,
          client_id: user.clientId
        })
        .select()
        .single();

      if (pollError) throw pollError;

      const options = [
        { poll_id: pollData.id, text: 'Sim', votes_count: 0 },
        { poll_id: pollData.id, text: 'Não', votes_count: 0 },
        { poll_id: pollData.id, text: 'Abstenção', votes_count: 0 }
      ];

      await supabase.from('poll_options').insert(options);
      fetchPolls();
      setShowCreate(false);
      setNewTitle('');
      setNewDesc('');
    } catch (error: any) {
      alert(`Erro ao criar: ${error.message || "Erro de permissão"}`);
    }
  };

  if (loading && polls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-brand-3">
        <i className="fa-solid fa-circle-notch fa-spin text-4xl mb-4"></i>
        <p className="font-bold uppercase tracking-widest text-xs">Carregando Assembleia...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-1 dark:text-white uppercase tracking-tight">Assembleias Digitais</h1>
          <p className="text-slate-500 dark:text-brand-4 font-bold text-sm italic">Governança transparente.</p>
        </div>
        {user.role === UserRole.SINDICO && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-brand-1 dark:bg-brand-3 text-white px-8 py-3 rounded-2xl font-black hover:bg-brand-2 transition-all flex items-center gap-2 shadow-xl"
          >
            <i className="fa-solid fa-plus-circle"></i> NOVA PAUTA
          </button>
        )}
      </div>

      {errorInfo && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 p-4 rounded-2xl flex items-start gap-4 text-amber-800 text-xs font-bold">
          <i className="fa-solid fa-triangle-exclamation text-xl"></i>
          <div>
            <p className="uppercase tracking-wider">Aviso de Sistema</p>
            <p className="font-medium opacity-80 mt-1">{errorInfo}</p>
          </div>
        </div>
      )}

      {showCreate && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border-2 border-brand-4 shadow-2xl space-y-4 animate-in zoom-in duration-300">
          <input
            type="text"
            placeholder="Título da Enquete"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-brand-3/20 font-bold"
          />
          <textarea
            placeholder="Descrição..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border border-slate-200 h-24 resize-none outline-none focus:ring-4 focus:ring-brand-3/20 font-semibold"
          ></textarea>
          <div className="flex gap-4">
            <button onClick={createPoll} className="flex-1 bg-brand-1 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Publicar</button>
            <button onClick={() => setShowCreate(false)} className="px-8 py-4 bg-slate-100 rounded-2xl font-black text-slate-500 uppercase tracking-widest text-xs">Cancelar</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {polls.map(p => {
          const hasVoted = p.votedUnits.includes(user.unit);
          const totalVotes = p.options.reduce((acc, curr) => acc + curr.votes, 0);

          return (
            <div key={p.id} className={`bg-white dark:bg-slate-900/40 rounded-[2.5rem] border-2 ${!p.active ? 'border-slate-100 opacity-70' : 'border-brand-5'} shadow-xl flex flex-col transition-all overflow-hidden`}>
              <div className="p-10 flex-1">
                <div className="flex justify-between items-center mb-6">
                  <span className={`px-4 py-1.5 text-[9px] font-black rounded-full uppercase tracking-widest ${p.active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                    {p.active ? 'Votação Ativa' : 'Encerrado'}
                  </span>
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Fim: {p.endDate.toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <h3 className="text-2xl font-black text-brand-1 dark:text-white leading-tight mb-4">{p.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed mb-8">{p.description}</p>

                <div className="space-y-6">
                  {p.options.map(opt => {
                    const percent = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
                    const isVotingThis = votingId === opt.id;

                    return (
                      <div key={opt.id} className="relative">
                        <div className="flex justify-between items-center mb-2 px-1">
                          <span className="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">{opt.text}</span>
                          <span className="text-[11px] font-black text-brand-2 dark:text-brand-3">{percent}% • {opt.votes}</span>
                        </div>
                        <div className="h-4 bg-slate-100 dark:bg-black/20 rounded-full overflow-hidden p-1">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${p.active ? (hasVoted ? 'bg-brand-2' : 'bg-brand-3') : 'bg-slate-400'}`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        
                        {p.active && !hasVoted && (
                          <button
                            onClick={() => handleVote(p.id, opt.id)}
                            disabled={!!votingId}
                            className="w-full mt-3 py-3 text-[10px] font-black text-brand-1 border-2 border-brand-5 rounded-2xl hover:bg-brand-1 hover:text-white transition-all uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {isVotingThis ? <i className="fa-solid fa-circle-notch fa-spin"></i> : `Escolher: ${opt.text}`}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={`px-10 py-6 border-t-2 ${hasVoted ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${hasVoted ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                     <i className={`fa-solid ${hasVoted ? 'fa-check' : 'fa-hourglass-half'}`}></i>
                  </div>
                  <span className="text-[10px] font-black text-slate-600 dark:text-brand-4 uppercase">
                    {hasVoted ? `Sua unidade (${user.unit}) já votou` : 'Aguardando sua unidade'}
                  </span>
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
