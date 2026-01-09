
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
  const [activeTab, setActiveTab] = useState<'users' | 'clients'>(currentUser.id === 'admin-fluxibi' ? 'users' : 'users');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingClient, setEditingClient] = useState<CondoClient | null>(null);
  
  // User Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.MORADOR);
  const [unit, setUnit] = useState('');
  const [selectedClientId, setSelectedClientId] = useState(currentUser.clientId);
  
  // Client Form States
  const [clientName, setClientName] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isMaster = currentUser.id === 'admin-fluxibi';

  // Filtragem de dados: Síndico só vê usuários do seu próprio condomínio
  const filteredUsers = isMaster ? users : users.filter(u => u.clientId === currentUser.clientId);
  const visibleUsers = filteredUsers.filter(u => u.id !== 'admin-fluxibi');

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setEmail(editingUser.email);
      setRole(editingUser.role);
      setUnit(editingUser.unit === 'N/A' ? '' : editingUser.unit);
      setSelectedClientId(editingUser.clientId);
    }
  }, [editingUser]);

  const resetUserForm = () => {
    setName('');
    setEmail('');
    setUnit('');
    setRole(UserRole.MORADOR);
    setSelectedClientId(currentUser.clientId);
    setEditingUser(null);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (editingUser) {
      const updated = users.map(u => u.id === editingUser.id ? { ...u, name, email, role, unit: role === UserRole.MORADOR ? unit : 'N/A', clientId: selectedClientId } : u);
      setUsers(updated);
      setSuccess('Usuário atualizado!');
      resetUserForm();
    } else {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
        unit: role === UserRole.MORADOR ? unit : 'N/A',
        clientId: selectedClientId
      };
      setUsers([...users, newUser]);
      setSuccess('Usuário cadastrado!');
      resetUserForm();
    }
  };

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName) return;

    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? { ...c, name: clientName } : c));
      setSuccess('Condomínio atualizado!');
      setEditingClient(null);
    } else {
      const newClient: CondoClient = {
        id: `client-${Date.now()}`,
        name: clientName
      };
      setClients([...clients, newClient]);
      setSuccess('Novo condomínio registrado!');
    }
    setClientName('');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-brand-1 dark:text-white">Painel de Administração</h1>
        <p className="text-brand-2 dark:text-brand-4 font-medium">Controle de clientes e acessos da rede.</p>
      </div>

      {isMaster && (
        <div className="flex bg-brand-5/30 dark:bg-white/5 p-1 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'users' ? 'bg-white dark:bg-brand-3 text-brand-1 dark:text-white shadow-md' : 'text-slate-500'}`}
          >
            Gestão de Usuários
          </button>
          <button 
            onClick={() => setActiveTab('clients')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'clients' ? 'bg-white dark:bg-brand-3 text-brand-1 dark:text-white shadow-md' : 'text-slate-500'}`}
          >
            Gestão de Condomínios
          </button>
        </div>
      )}

      {activeTab === 'users' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário de Usuário */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-brand-4 dark:border-white/10 overflow-hidden shadow-sm">
              <div className="p-6 border-b dark:border-white/10 bg-brand-5/20 font-bold text-brand-1 dark:text-white">
                {editingUser ? 'Editar Usuário' : 'Novo Registro'}
              </div>
              <form onSubmit={handleUserSubmit} className="p-6 space-y-4">
                {success && <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold">{success}</div>}
                
                {isMaster && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Condomínio</label>
                    <select 
                      value={selectedClientId} 
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:bg-slate-800 dark:text-white"
                    >
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Nome Completo</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:bg-slate-800 dark:text-white" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">E-mail</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:bg-slate-800 dark:text-white" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Papel</label>
                  <select value={role} onChange={e => setRole(e.target.value as any)} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:bg-slate-800 dark:text-white">
                    {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                {role === UserRole.MORADOR && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Unidade</label>
                    <input type="text" value={unit} onChange={e => setUnit(e.target.value)} placeholder="Ex: Apt 101" className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:bg-slate-800 dark:text-white" required />
                  </div>
                )}
                <button type="submit" className="w-full bg-brand-1 dark:bg-brand-3 text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all">
                  {editingUser ? 'Salvar Alterações' : 'Cadastrar Usuário'}
                </button>
              </form>
            </div>
          </div>

          {/* Listagem de Usuários */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-brand-4 dark:border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-white/5 text-[10px] font-bold uppercase text-slate-400">
                    <tr>
                      <th className="p-4">Usuário</th>
                      <th className="p-4">Cargo</th>
                      {isMaster && <th className="p-4">Cliente</th>}
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-white/10">
                    {visibleUsers.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-brand-1 dark:text-white">{u.name}</p>
                          <p className="text-[10px] text-slate-400">{u.email}</p>
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] bg-brand-5 dark:bg-brand-2/20 text-brand-1 dark:text-brand-4 px-2 py-0.5 rounded-full font-bold uppercase">{u.role}</span>
                        </td>
                        {isMaster && <td className="p-4 text-xs font-medium text-slate-500">{clients.find(c => c.id === u.clientId)?.name || 'N/A'}</td>}
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => setEditingUser(u)} className="p-2 text-brand-2 hover:bg-brand-5 rounded-lg"><i className="fa-solid fa-pen"></i></button>
                          <button onClick={() => setUsers(users.filter(usr => usr.id !== u.id))} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><i className="fa-solid fa-trash"></i></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Gestão de Condomínios (Master Only) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-brand-4 dark:border-white/10 p-6 space-y-4 shadow-sm">
              <h3 className="font-bold dark:text-white">Novo Condomínio</h3>
              <form onSubmit={handleClientSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Nome do Condomínio</label>
                  <input 
                    type="text" 
                    value={clientName} 
                    onChange={e => setClientName(e.target.value)} 
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:bg-slate-800 dark:text-white"
                    placeholder="Ex: Residencial X"
                    required 
                  />
                </div>
                <button type="submit" className="w-full bg-brand-3 text-white py-3 rounded-xl font-bold">Registrar Cliente</button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-brand-4 dark:border-white/10 overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-white/5 text-[10px] font-bold uppercase text-slate-400">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Nome do Condomínio</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-white/10">
                    {clients.filter(c => c.id !== 'client-global').map(c => (
                      <tr key={c.id}>
                        <td className="p-4 font-mono text-[10px] text-slate-400">{c.id}</td>
                        <td className="p-4 font-bold text-brand-1 dark:text-white">{c.name}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => setEditingClient(c)} className="p-2 text-brand-2"><i className="fa-solid fa-pen"></i></button>
                          <button onClick={() => setClients(clients.filter(cl => cl.id !== c.id))} className="p-2 text-rose-500"><i className="fa-solid fa-trash"></i></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementView;
