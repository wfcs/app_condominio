
import React, { useState } from 'react';
import { User, Notification } from '../types';

interface GatehouseViewProps {
  user: User;
  onSendNotification: (notif: Notification) => void;
}

const GatehouseView: React.FC<GatehouseViewProps> = ({ user, onSendNotification }) => {
  const [type, setType] = useState<'entrega' | 'visitante'>('entrega');
  const [unit, setUnit] = useState('');
  const [desc, setDesc] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unit || !desc) return;

    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      unitId: unit,
      type: type,
      description: `${type === 'entrega' ? 'Encomenda' : 'Visitante'}: ${desc}`,
      timestamp: new Date(),
      status: 'pendente'
    };

    onSendNotification(newNotif);
    setSuccess(true);
    setUnit('');
    setDesc('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 bg-slate-900 text-white">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <i className="fa-solid fa-shield-halved"></i>
            Registro da Portaria
          </h2>
          <p className="text-slate-400 text-sm mt-1">Notifique moradores sobre encomendas ou visitantes.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {success && (
            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 border border-emerald-100">
              <i className="fa-solid fa-circle-check text-xl"></i>
              <span className="font-medium">Notificação enviada com sucesso!</span>
            </div>
          )}

          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setType('entrega')}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${type === 'entrega' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <i className="fa-solid fa-box mr-2"></i> Encomenda
            </button>
            <button
              type="button"
              onClick={() => setType('visitante')}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${type === 'visitante' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <i className="fa-solid fa-user-group mr-2"></i> Visitante
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Unidade / Apartamento</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Ex: 101A"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Descrição</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder={type === 'entrega' ? 'Ex: Pacote iFood, Caixa Amazon...' : 'Ex: Sr. João (Uber), Técnico da Vivo...'}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all h-32 resize-none"
                required
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-3"
          >
            <i className="fa-solid fa-paper-plane"></i>
            Enviar Notificação Privada
          </button>
        </form>
      </div>
    </div>
  );
};

export default GatehouseView;
