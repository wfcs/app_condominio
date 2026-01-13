
import React, { useState, useEffect } from 'react';
import { User, UserRole, CondoClient } from '../types';

interface ManagementViewProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  clients: CondoClient[];
  setClients: React.Dispatch<React.SetStateAction<CondoClient[]>>;
  currentUser: User;
}

interface BudgetCategory {
  name: string;
  budgeted: number;
  actual: number;
  icon: string;
}

const ManagementView: React.FC<ManagementViewProps> = ({ users, setUsers, clients, setClients, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'clients' | 'suppliers' | 'docs' | 'finance' | 'debtors'>('users');
  
  const [suppliers] = useState([
    { id: 1, name: 'Elevadores Atlas', contact: 'Marcos (11) 9999-8888', category: 'Manutenção' },
    { id: 2, name: 'Jardins & Cia', contact: 'Sueli (11) 9777-7777', category: 'Jardinagem' }
  ]);

  const [docs] = useState([
    { id: 1, name: 'Seguro Predial', expiration: '2026-05-20', status: 'Vigente' },
    { id: 2, name: 'AVCB - Bombeiros', expiration: '2024-12-10', status: 'Próximo ao Vencimento' },
    { id: 3, name: 'Dedetização', expiration: '2024-03-01', status: 'Vencido' }
  ]);

  // Dados de Exemplo: Orçado vs Realizado
  const [budgetData] = useState<BudgetCategory[]>([
    { name: 'Folha de Pagamento', budgeted: 18000, actual: 17850, icon: 'fa-users-gears' },
    { name: 'Manutenção Preventiva', budgeted: 5000, actual: 6200, icon: 'fa-screwdriver-wrench' },
    { name: 'Consumo (Água/Luz)', budgeted: 8500, actual: 9100, icon: 'fa-faucet-drip' },
    { name: 'Segurança / Portaria', budgeted: 12000, actual: 12000, icon: 'fa-shield-halved' },
    { name: 'Fundo de Reserva', budgeted: 4500, actual: 4500, icon: 'fa-piggy-bank' },
  ]);

  const [debtors] = useState([
    { unit: '101A', value: 1250.00, months: 2 },
    { unit: '304B', value: 625.00, months: 1 }
  ]);

  const isMaster = currentUser.id === 'admin-fluxibi';
  const visibleUsers = isMaster ? users : users.filter(u => u.clientId === currentUser.clientId);

  const totalBudgeted = budgetData.reduce((acc, curr) => acc + curr.budgeted, 0);
  const totalActual = budgetData.reduce((acc, curr) => acc + curr.actual, 0);
  const budgetPerformance = (totalActual / totalBudgeted) * 100;

  const renderFinance = () => (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Orçado (Mês)</p>
          <p className="text-2xl font-black text-brand-1">R$ {totalBudgeted.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-3 w-full"></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Realizado</p>
          <p className={`text-2xl font-black ${totalActual > totalBudgeted ? 'text-rose-600' : 'text-emerald-600'}`}>
            R$ {totalActual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${totalActual > totalBudgeted ? 'bg-rose-500' : 'bg-emerald-500'}`} 
              style={{ width: `${Math.min(budgetPerformance, 100)}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-brand-1 p-6 rounded-[2rem] shadow-xl shadow-brand-1/20">
          <p className="text-[10px] font-black text-brand-4 uppercase tracking-widest mb-1">Desvio Orçamentário</p>
          <p className="text-2xl font-black text-white">
            {((totalActual / totalBudgeted - 1) * 100).toFixed(1)}%
          </p>
          <p className="text-[10px] text-brand-5 mt-2 font-bold italic">
            {totalActual > totalBudgeted ? '⚠️ Acima do planejado' : '✅ Dentro da meta'}
          </p>
        </div>
      </div>

      {/* Orçado vs Realizado Table/List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h3 className="font-black text-brand-1 uppercase tracking-tight">Comparativo Orçamentário</h3>
            <p className="text-xs text-slate-500 font-bold">Análise detalhada por categoria de custo</p>
          </div>
          <button className="bg-white border border-slate-200 text-brand-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
            Exportar PDF
          </button>
        </div>
        
        <div className="p-8 space-y-8">
          {budgetData.map((cat, i) => {
            const percent = (cat.actual / cat.budgeted) * 100;
            const isOver = cat.actual > cat.budgeted;

            return (
              <div key={i} className="group">
                <div className="flex justify-between items-end mb-3">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOver ? 'bg-rose-50 text-rose-600' : 'bg-brand-5 text-brand-1'}`}>
                      <i className={`fa-solid ${cat.icon}`}></i>
                    </div>
                    <div>
                      <p className="font-black text-brand-1 text-sm uppercase tracking-wide">{cat.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">ORÇADO: R$ {cat.budgeted.toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-sm ${isOver ? 'text-rose-600' : 'text-slate-700'}`}>
                      R$ {cat.actual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className={`text-[10px] font-black ${isOver ? 'text-rose-400' : 'text-emerald-500'}`}>
                      {percent.toFixed(1)}% utilizado
                    </p>
                  </div>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${isOver ? 'bg-rose-500' : 'bg-brand-3'}`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-amber-50 p-8 rounded-[2.5rem] border-2 border-dashed border-amber-200 text-center">
        <i className="fa-solid fa-receipt text-3xl text-amber-400 mb-4"></i>
        <h4 className="font-bold text-amber-800">Aprovação de Notas Fiscais</h4>
        <p className="text-sm text-amber-700 max-w-md mx-auto mt-2 font-medium">
          Existem 4 despesas extras este mês que ultrapassaram o orçado. 
          O síndico deve validar a justificativa para o fechamento.
        </p>
        <button className="mt-6 bg-amber-500 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20">
          Revisar Notas Pendentes
        </button>
      </div>
    </div>
  );

  const renderSuppliers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-black text-brand-1 uppercase tracking-widest text-sm">Fornecedores & Contatos Estratégicos</h3>
        <button className="bg-brand-1 text-white px-4 py-2 rounded-xl text-xs font-bold">+ NOVO FORNECEDOR</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.map(s => (
          <div key={s.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="font-bold text-brand-1">{s.name}</p>
              <p className="text-xs text-slate-500">{s.contact}</p>
              <span className="text-[9px] bg-brand-5 text-brand-2 px-2 py-0.5 rounded-full font-black uppercase mt-2 inline-block">{s.category}</span>
            </div>
            <button className="text-brand-3 hover:text-brand-1"><i className="fa-solid fa-phone"></i></button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocs = () => (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
          <tr>
            <th className="p-4">Documento / Licença</th>
            <th className="p-4">Vencimento</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {docs.map(d => (
            <tr key={d.id} className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-bold text-brand-1">{d.name}</td>
              <td className="p-4 text-sm text-slate-600">{new Date(d.expiration).toLocaleDateString('pt-BR')}</td>
              <td className="p-4">
                <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${
                  d.status === 'Vencido' ? 'bg-red-100 text-red-600' : 
                  d.status === 'Próximo ao Vencimento' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {d.status}
                </span>
              </td>
              <td className="p-4 text-right">
                <button className="text-brand-2 mr-3"><i className="fa-solid fa-file-arrow-up"></i></button>
                <button className="text-slate-300"><i className="fa-solid fa-ellipsis-vertical"></i></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderDebtors = () => (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <h4 className="font-black text-brand-1 text-xs uppercase tracking-widest">Relatório de Inadimplência</h4>
        <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">TOTAL: R$ 1.875,00</span>
      </div>
      <table className="w-full text-left">
        <thead className="text-[10px] font-black uppercase text-slate-400">
          <tr>
            <th className="p-4">Unidade</th>
            <th className="p-4">Valor Devido</th>
            <th className="p-4">Meses em Aberto</th>
            <th className="p-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {debtors.map((d, i) => (
            <tr key={i} className="hover:bg-rose-50/30 transition-colors">
              <td className="p-4 font-bold text-brand-1">{d.unit}</td>
              <td className="p-4 font-bold text-rose-600">R$ {d.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="p-4"><span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-[10px] font-bold">{d.months} MESES</span></td>
              <td className="p-4 text-right">
                <button className="text-brand-3 hover:text-brand-1 text-xs font-bold uppercase underline">Notificar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-1 uppercase tracking-tight">Painel de Administração & Governança</h1>
          <p className="text-slate-500 font-bold text-sm italic">Módulo Síndico • Gestão Profissional Fluxibi</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="text-right">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Saldo Atual em Conta</p>
             <p className="text-lg font-black text-emerald-600">R$ 142.500,00</p>
           </div>
           <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
             <i className="fa-solid fa-building-columns"></i>
           </div>
        </div>
      </div>

      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full overflow-x-auto custom-scrollbar no-scrollbar">
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-white text-brand-1 shadow-md' : 'text-slate-500'}`}
        >
          Usuários
        </button>
        <button 
          onClick={() => setActiveTab('suppliers')}
          className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'suppliers' ? 'bg-white text-brand-1 shadow-md' : 'text-slate-500'}`}
        >
          Fornecedores
        </button>
        <button 
          onClick={() => setActiveTab('docs')}
          className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'docs' ? 'bg-white text-brand-1 shadow-md' : 'text-slate-500'}`}
        >
          Licenças/Docs
        </button>
        <button 
          onClick={() => setActiveTab('finance')}
          className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'finance' ? 'bg-white text-brand-1 shadow-md' : 'text-slate-500'}`}
        >
          Orçado vs Realizado
        </button>
        <button 
          onClick={() => setActiveTab('debtors')}
          className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'debtors' ? 'bg-white text-brand-1 shadow-md' : 'text-slate-500'}`}
        >
          Inadimplência
        </button>
      </div>

      <div className="animate-in fade-in duration-300">
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-brand-4 shadow-sm p-6 space-y-4">
                 <h3 className="font-black text-brand-1 uppercase text-xs tracking-widest mb-4">Novo Cadastro</h3>
                 <div className="space-y-4">
                   <input type="text" placeholder="Nome Completo" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold" />
                   <input type="email" placeholder="E-mail" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold" />
                   <select className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold">
                     <option>Morador</option>
                     <option>Portaria</option>
                     <option>Manutenção</option>
                   </select>
                   <input type="text" placeholder="Unidade (Ex: 101)" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold" />
                   <button className="w-full bg-brand-1 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-1/10 hover:bg-brand-2 transition-all">Registrar Acesso</button>
                 </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
                      <tr>
                        <th className="p-4">Perfil</th>
                        <th className="p-4">Cargo</th>
                        <th className="p-4 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {visibleUsers.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-brand-1">{u.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{u.unit}</p>
                          </td>
                          <td className="p-4">
                             <span className="text-[9px] bg-brand-5 text-brand-1 px-2 py-0.5 rounded-full font-black uppercase">{u.role}</span>
                          </td>
                          <td className="p-4 text-right">
                            <button className="p-2 text-brand-2"><i className="fa-solid fa-pen"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'suppliers' && renderSuppliers()}
        {activeTab === 'docs' && renderDocs()}
        {activeTab === 'finance' && renderFinance()}
        {activeTab === 'debtors' && renderDebtors()}
      </div>
    </div>
  );
};

export default ManagementView;
