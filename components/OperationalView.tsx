
import React, { useState } from 'react';
import { User, UserRole, OperationalTask } from '../types';

interface OperationalViewProps {
  user: User;
  tasks: OperationalTask[];
  setTasks: React.Dispatch<React.SetStateAction<OperationalTask[]>>;
}

const OperationalView: React.FC<OperationalViewProps> = ({ user, tasks, setTasks }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [desc, setDesc] = useState('');
  const [type, setType] = useState<'Compra' | 'Manutenção'>('Manutenção');
  const [priority, setPriority] = useState<any>('Média');

  const addTask = () => {
    if (!desc) return;
    const task: OperationalTask = {
      id: Date.now().toString(),
      type,
      priority,
      description: desc,
      status: 'Aberto',
      createdAt: new Date()
    };
    setTasks([task, ...tasks]);
    setShowAdd(false);
    setDesc('');
  };

  const updateStatus = (id: string, newStatus: any) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Quadro Operacional</h1>
          <p className="text-slate-500 dark:text-brand-4 font-medium bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full inline-block mt-1 text-sm">
            <i className="fa-solid fa-lock mr-2"></i> Área Restrita ao Staff
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-slate-900 dark:bg-brand-3 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-brand-2 transition-all flex items-center gap-2 shadow-lg shadow-black/10"
        >
          <i className="fa-solid fa-plus-circle"></i> Novo Chamado
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
          <h3 className="font-bold text-lg dark:text-white">Criar Ocorrência Técnica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-brand-3/20 outline-none"
            >
              <option value="Manutenção">Manutenção</option>
              <option value="Compra">Compra de Materiais</option>
            </select>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-brand-3/20 outline-none"
            >
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
              <option value="Crítica">Crítica</option>
            </select>
          </div>
          <textarea
            placeholder="Detalhes técnicos da ocorrência..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-slate-800 dark:text-white h-24 resize-none outline-none focus:ring-2 focus:ring-brand-3/20"
          ></textarea>
          <div className="flex gap-4">
            <button onClick={addTask} className="flex-1 bg-slate-900 dark:bg-brand-3 text-white py-3 rounded-xl font-bold">Abrir Chamado</button>
            <button onClick={() => setShowAdd(false)} className="px-6 py-3 bg-slate-100 dark:bg-white/10 rounded-xl font-bold text-slate-600 dark:text-slate-300">Cancelar</button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 dark:text-brand-4 uppercase tracking-wider">Tipo / Prioridade</th>
                <th className="p-4 text-xs font-bold text-slate-500 dark:text-brand-4 uppercase tracking-wider">Descrição</th>
                <th className="p-4 text-xs font-bold text-slate-500 dark:text-brand-4 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-slate-500 dark:text-brand-4 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              {tasks.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{t.type}</span>
                      <span className={`text-[10px] font-bold uppercase ${
                        t.priority === 'Crítica' ? 'text-red-500 dark:text-red-400' : 
                        t.priority === 'Alta' ? 'text-orange-500 dark:text-orange-400' : 'text-slate-400 dark:text-slate-500'
                      }`}>{t.priority}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs">{t.description}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                      t.status === 'Resolvido' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                      t.status === 'Em Andamento' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-slate-500'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {t.status !== 'Resolvido' && (
                        <>
                          <button 
                            onClick={() => updateStatus(t.id, 'Em Andamento')}
                            className="p-2 text-indigo-600 dark:text-brand-3 hover:bg-indigo-50 dark:hover:bg-brand-3/10 rounded-lg transition-colors"
                            title="Iniciar"
                          >
                            <i className="fa-solid fa-play"></i>
                          </button>
                          <button 
                            onClick={() => updateStatus(t.id, 'Resolvido')}
                            className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-400/10 rounded-lg transition-colors"
                            title="Finalizar"
                          >
                            <i className="fa-solid fa-check"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tasks.length === 0 && (
          <div className="p-12 text-center text-slate-400 dark:text-slate-500 font-medium italic">Nenhum chamado pendente no momento.</div>
        )}
      </div>
    </div>
  );
};

export default OperationalView;
