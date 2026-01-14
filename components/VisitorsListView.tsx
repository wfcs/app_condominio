
import React, { useState, useMemo } from 'react';
import { User, Visitor } from '../types';

interface VisitorsListViewProps {
  user: User;
}

const VisitorsListView: React.FC<VisitorsListViewProps> = ({ user }) => {
  const [visitors, setVisitors] = useState<Visitor[]>([
    {
      id: 'v1',
      name: 'João Pedro de Almeida',
      entryDate: new Date('2024-05-20T10:30:00'),
      exitDate: null,
      vehiclePlate: 'ABC-1234',
      vehicleType: 'SUV - Hyundai Creta',
      unitVisited: '101A',
      authorizedBy: 'Ricardo Silva',
      clientId: user.clientId
    },
    {
      id: 'v2',
      name: 'Maria Clara Souza',
      entryDate: new Date('2024-05-20T08:15:00'),
      exitDate: new Date('2024-05-20T09:45:00'),
      vehiclePlate: 'XYZ-9876',
      vehicleType: 'Sedan - Toyota Corolla',
      unitVisited: '202B',
      authorizedBy: 'Ana Oliveira',
      clientId: user.clientId
    },
    {
      id: 'v3',
      name: 'Carlos Motoboy iFood',
      entryDate: new Date('2024-05-20T11:45:00'),
      exitDate: null,
      vehiclePlate: 'MOT-0001',
      vehicleType: 'Moto - Honda CG',
      unitVisited: '304C',
      authorizedBy: 'Portaria (Procedimento Padrão)',
      clientId: user.clientId
    }
  ]);

  const handleCheckout = (id: string) => {
    setVisitors(prev => prev.map(v => 
      v.id === id ? { ...v, exitDate: new Date() } : v
    ));
  };

  // Performance: Ordena por quem está no condomínio primeiro, depois por data de entrada decrescente
  const sortedVisitors = useMemo(() => {
    return [...visitors].sort((a, b) => {
      if (a.exitDate === null && b.exitDate !== null) return -1;
      if (a.exitDate !== null && b.exitDate === null) return 1;
      return b.entryDate.getTime() - a.entryDate.getTime();
    });
  }, [visitors]);

  const formatDateTime = (date: Date | null) => {
    if (!date) return <span className="text-rose-500 font-black animate-pulse uppercase text-[10px]">Aguardando Saída</span>;
    return (
      <div className="flex flex-col">
        <span className="font-bold">{date.toLocaleDateString('pt-BR')}</span>
        <span className="text-[10px] text-slate-400 font-medium">{date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-brand-1 dark:text-white uppercase tracking-tight">Registro de Acessos</h1>
          <p className="text-slate-500 dark:text-brand-4 font-bold text-sm italic">Monitoramento em tempo real de fluxo.</p>
        </div>
        <div className="bg-white dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 flex items-center gap-3">
           <div className="text-right">
             <p className="text-[9px] font-black text-slate-400 uppercase">Presentes</p>
             <p className="text-lg font-black text-brand-1 dark:text-brand-3">{visitors.filter(v => !v.exitDate).length}</p>
           </div>
           <div className="w-8 h-8 bg-brand-5 dark:bg-brand-2/20 text-brand-1 dark:text-brand-3 rounded-lg flex items-center justify-center">
             <i className="fa-solid fa-user-clock text-sm"></i>
           </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black uppercase text-slate-500 border-b">
              <tr>
                <th className="p-6">Visitante / Destino</th>
                <th className="p-6">Veículo</th>
                <th className="p-6">Entrada</th>
                <th className="p-6">Saída</th>
                <th className="p-6">Autorização</th>
                <th className="p-6 text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              {sortedVisitors.map(v => (
                <tr key={v.id} className={`hover:bg-slate-50 transition-colors ${!v.exitDate ? 'bg-brand-5/20 dark:bg-brand-2/5' : ''}`}>
                  <td className="p-6">
                    <p className="font-black text-brand-1 dark:text-white">{v.name}</p>
                    <span className="text-[10px] bg-brand-5 text-brand-2 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                      CASA {v.unitVisited}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-slate-700 dark:text-slate-300">{v.vehicleType || 'À Pé'}</span>
                      {v.vehiclePlate && (
                        <span className="text-[11px] font-black text-brand-3 tracking-widest">{v.vehiclePlate}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-6">{formatDateTime(v.entryDate)}</td>
                  <td className="p-6">{formatDateTime(v.exitDate)}</td>
                  <td className="p-6">
                    <p className="text-xs font-bold text-slate-500 italic">{v.authorizedBy}</p>
                  </td>
                  <td className="p-6 text-center">
                    {!v.exitDate ? (
                      <button 
                        onClick={() => handleCheckout(v.id)}
                        className="bg-emerald-500 text-white text-[10px] font-black px-4 py-2 rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 uppercase"
                      >
                        Registrar Saída
                      </button>
                    ) : (
                      <i className="fa-solid fa-circle-check text-emerald-400 text-xl"></i>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VisitorsListView;
