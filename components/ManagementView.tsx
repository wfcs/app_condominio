
import React, { useState, useEffect } from 'react';
import { User, UserRole, CondoClient } from '../types';

interface ManagementViewProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  clients: CondoClient[];
  setClients: React.Dispatch<React.SetStateAction<CondoClient[]>>;
  currentUser: User;
}

const ManagementView: React.FC<ManagementViewProps> = ({ users, setUsers, clients, setClients, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'clients' | 'suppliers' | 'docs' | 'contracts' | 'finance' | 'debtors'>('users');
  
  // States para novas funcionalidades (Simulados para protótipo)
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Elevadores Atlas', contact: 'Marcos (11) 9999-8888', category: 'Manutenção' },
    { id: 2, name: 'Jardins & Cia', contact: 'Sueli (11) 9777-7777', category: 'Jardinagem' }
  ]);

  const [docs, setDocs] = useState([
    { id: 1, name: 'Seguro Predial', expiration: '2026-05-20', status: 'Vigente' },
    { id: 2, name: 'AVCB - Bombeiros', expiration: '2024-12-10', status: 'Próximo ao Vencimento' },
    { id: 3, name: 'Dedetização', expiration: '2024-03-01', status: 'Vencido' }
  ]);

  const [finances, setFinances] = useState({
    revenue: 45000.00,
    expenses: 32450.00,
    pendingApproval: 1250.00
  });

  const [debtors, setDebtors] = useState([
    { unit: '101A', value: 1250.00, months: 2 },
    { unit: '304B', value: 625.00, months: 1 }
  ]);

  const isMaster = currentUser.id === 'admin-fluxibi';
  const isSindico = currentUser.role === UserRole.SINDICO;

  // Fix: Defined visibleUsers based on the user's clientId or global access
  const visibleUsers = isMaster ? users : users.filter(u => u.clientId === currentUser.clientId);

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

  const renderFinance = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Receita Condominial</p>
          <p className="text-2xl font-black text-emerald-700">R$ {finances.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
          <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Despesas Totais</p>
          <p className="text-2xl font-black text-rose-700">R$ {finances.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-brand-5 p-6 rounded-3xl border border-brand-4/30">
          <p className="text-[10px] font-black text-brand-2 uppercase tracking-widest mb-1">Saldo em Caixa</p>
          <p className="text-2xl font-black text-brand-1">R$ {(finances.revenue - finances.expenses).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>
      <div className="bg-white p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center">
        <i className="fa-solid fa-magnifying-glass-dollar text-4xl text-slate-200 mb-4"></i>
        <h4 className="font-bold text-brand-1">Módulo de Conciliação Bancária</h4>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2 italic">Valide as notas fiscais aprovadas com os lançamentos da administradora antes do fechamento do mês.</p>
        <button className="mt-6 bg-brand-1 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest">Iniciar Auditoria Mensal</button>
      </div>
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
      <div>
        <h1 className="text-2xl font-black text-brand-1 uppercase tracking-tight">Painel de Administração & Governança</h1>
        <p className="text-slate-500 font-bold text-sm italic">Gestão estratégica por Fluxibi Technologies.</p>
      </div>

      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full overflow-x-auto custom-scrollbar no-scrollbar">
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-white text-brand-1 shadow-md' : 'text-slate-500'}`}
        >
          Usuários
        </button>
        {isMaster && (
          <button 
            onClick={() => setActiveTab('clients')}
            className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'clients' ? 'bg-white text-brand-1 shadow-md' : 'text-slate-500'}`}
          >
            Condomínios
          </button>
        )}
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
          Financeiro
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
        {activeTab === 'clients' && isMaster && <div className="p-10 text-center bg-white rounded-3xl border border-brand-4 italic text-slate-400">Gestão Global de Condomínios (Ativo para Admin)</div>}
        {activeTab === 'suppliers' && renderSuppliers()}
        {activeTab === 'docs' && renderDocs()}
        {activeTab === 'finance' && renderFinance()}
        {activeTab === 'debtors' && renderDebtors()}
      </div>
    </div>
  );
};

export default ManagementView;
