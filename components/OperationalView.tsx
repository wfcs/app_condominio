
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
          <h1 className="text-2xl font-bold text-slate-800">Quadro Operacional</h1>
          <p className="text-slate-500 font-medium bg-amber-50 text-amber-600 px-3 py-1 rounded-full inline-block mt-1 text-sm">
            <i className="fa-solid fa-lock mr-2"></i> Área Restrita ao Staff
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <i className="fa-solid fa-plus-circle"></i> Novo Chamado
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="px-4 py-3 rounded-xl border border-slate-200"
            >
              <option value="Manutenção">Manutenção</option>
              <option value="Compra">Compra de Materiais</option>
            </select>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="px-4 py-3 rounded-xl border border-slate-200"
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
            className="w-full px-4 py-3 rounded-xl border border-slate-200 h-24 resize-none"
          ></textarea>
          <div className="flex gap-4">
            <button onClick={addTask} className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold">Abrir Chamado</button>
            <button onClick={() => setShowAdd(false)} className="px-6 py-3 bg-slate-100 rounded-xl font-bold text-slate-600">Cancelar</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo / Prioridade</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Descrição</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map(t => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800">{t.type}</span>
                    <span className={`text-[10px] font-bold uppercase ${
                      t.priority === 'Crítica' ? 'text-red-500' : 
                      t.priority === 'Alta' ? 'text-orange-500' : 'text-slate-400'
                    }`}>{t.priority}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-600 max-w-xs">{t.description}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                    t.status === 'Resolvido' ? 'bg-emerald-100 text-emerald-600' :
                    t.status === 'Em Andamento' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'
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
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Iniciar"
                        >
                          <i className="fa-solid fa-play"></i>
                        </button>
                        <button 
                          onClick={() => updateStatus(t.id, 'Resolvido')}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
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
        {tasks.length === 0 && (
          <div className="p-12 text-center text-slate-400">Nenhum chamado pendente no momento.</div>
        )}
      </div>
    </div>
  );
};

export default OperationalView;
