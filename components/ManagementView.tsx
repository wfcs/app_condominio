
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface ManagementViewProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const ManagementView: React.FC<ManagementViewProps> = ({ users, setUsers }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.MORADOR);
  const [unit, setUnit] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Business Rules Validation
    if (role === UserRole.MORADOR) {
      if (!unit.trim()) {
        setError('A unidade habitacional é obrigatória para moradores.');
        return;
      }

      const existingResident = users.find(u => u.role === UserRole.MORADOR && u.unit.toLowerCase() === unit.toLowerCase().trim());
      if (existingResident) {
        setError(`A unidade ${unit} já possui um morador cadastrado (${existingResident.name}).`);
        return;
      }
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      role,
      unit: role === UserRole.MORADOR ? unit.trim() : 'N/A'
    };

    setUsers([...users, newUser]);
    setSuccess(`Usuário ${name} cadastrado com sucesso!`);
    
    // Reset form
    setName('');
    setEmail('');
    setUnit('');
    setRole(UserRole.MORADOR);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-brand-1">Gestão de Usuários</h1>
        <p className="text-brand-2 font-medium">Controle de acesso à rede Fluxibi.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-brand-4 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-brand-5 bg-brand-5/30">
              <h3 className="font-bold text-brand-1">Novo Cadastro</h3>
            </div>
            <form onSubmit={handleRegister} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm font-medium border border-emerald-100 flex items-center gap-2">
                  <i className="fa-solid fa-circle-check"></i>
                  {success}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-brand-2 uppercase mb-1 tracking-tight">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-brand-4 focus:ring-2 focus:ring-brand-3/20 outline-none text-brand-1"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-2 uppercase mb-1 tracking-tight">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-brand-4 focus:ring-2 focus:ring-brand-3/20 outline-none text-brand-1"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-2 uppercase mb-1 tracking-tight">Papel / Função</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-4 py-2 rounded-xl border border-brand-4 focus:ring-2 focus:ring-brand-3/20 outline-none text-brand-1"
                >
                  {Object.values(UserRole).map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {role === UserRole.MORADOR && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs font-bold text-brand-2 uppercase mb-1 tracking-tight">Unidade Habitacional</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="Ex: Apt 101"
                    className="w-full px-4 py-2 rounded-xl border border-brand-4 focus:ring-2 focus:ring-brand-3/20 outline-none text-brand-1"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-brand-1 text-white py-3 rounded-xl font-bold hover:bg-brand-2 transition-all shadow-md shadow-brand-1/10 active:scale-[0.98]"
              >
                Cadastrar Usuário
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-brand-4 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-brand-5 flex justify-between items-center bg-brand-5/30">
              <h3 className="font-bold text-brand-1">Base de Usuários</h3>
              <span className="text-brand-3 text-sm font-bold">{users.length} registros</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-brand-5/50 text-brand-2 text-xs font-bold uppercase">
                  <tr>
                    <th className="p-4">Nome</th>
                    <th className="p-4">Papel</th>
                    <th className="p-4">Unidade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-5">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-brand-5/10 transition-colors">
                      <td className="p-4 font-bold text-brand-1">{u.name}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          u.role === UserRole.SINDICO ? 'bg-brand-1 text-white' :
                          u.role === UserRole.MORADOR ? 'bg-brand-4 text-brand-1' : 'bg-brand-5 text-brand-2'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-brand-3 font-mono text-sm font-bold">{u.unit || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementView;
