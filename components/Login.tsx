
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  users: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, users }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check specifically for requested user
    if (email === 'adm@fluxibi.com.br' && password === '@felipedovinho_2023') {
      const adminUser = users.find(u => u.id === 'admin-fluxibi');
      if (adminUser) {
        onLogin(adminUser);
        return;
      }
    }

    // Fallback for simulation/demo
    if (email.includes('@')) {
       const userToLogin = users.find(u => u.name.toLowerCase().includes(email.split('@')[0])) || users[0];
       onLogin(userToLogin);
    } else {
       setError('Credenciais inválidas para o ambiente de produção.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-1 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-2/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-3/20 rounded-full blur-3xl"></div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full relative z-10 border border-brand-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-1 text-white rounded-2xl shadow-lg shadow-brand-2/30 mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <i className="fa-solid fa-building-shield text-4xl text-brand-4"></i>
          </div>
          <h1 className="text-3xl font-extrabold text-brand-1 tracking-tight">CondoLink</h1>
          <p className="text-brand-2 mt-2 font-medium italic">Fluxibi Governance Platform</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation"></i>
            {error}
          </div>
        )}

        {!isSimulating ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-brand-2 uppercase tracking-widest mb-2 ml-1">E-mail de Acesso</label>
              <div className="relative">
                <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-brand-3"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="adm@fluxibi.com.br"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-brand-4 focus:ring-4 focus:ring-brand-3/10 focus:border-brand-3 outline-none transition-all text-brand-1 font-medium placeholder:text-brand-4"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-xs font-bold text-brand-2 uppercase tracking-widest">Senha</label>
                <a href="#" className="text-xs font-bold text-brand-2 hover:text-brand-1">Esqueceu?</a>
              </div>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-brand-3"></i>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-brand-4 focus:ring-4 focus:ring-brand-3/10 focus:border-brand-3 outline-none transition-all text-brand-1 font-medium placeholder:text-brand-4"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-1 text-white py-4 rounded-xl font-bold hover:bg-brand-2 transition-all shadow-xl shadow-brand-1/20 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              Entrar na Plataforma
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
            </button>

            <div className="pt-4 text-center">
              <button 
                type="button"
                onClick={() => setIsSimulating(true)}
                className="text-sm font-semibold text-brand-3 hover:text-brand-2 transition-colors"
              >
                <i className="fa-solid fa-flask-vial mr-2"></i>
                Atalhos de Perfil (Demo)
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-4">
               <p className="text-xs font-bold text-brand-2 uppercase tracking-widest">Acesso Rápido:</p>
               <button onClick={() => setIsSimulating(false)} className="text-xs font-bold text-brand-3">Voltar</button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => onLogin(user)}
                  className="w-full flex items-center p-4 border border-brand-4 bg-brand-5/50 rounded-2xl hover:border-brand-2 hover:bg-brand-5 transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-white border border-brand-4 rounded-full flex items-center justify-center text-brand-1 font-bold mr-4 group-hover:scale-110 transition-transform">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-brand-1 text-sm">{user.name}</p>
                    <p className="text-[11px] text-brand-2 font-medium uppercase tracking-tighter">
                      {user.role} {user.unit && user.unit !== 'N/A' ? `• ${user.unit}` : ''}
                    </p>
                  </div>
                  <i className="fa-solid fa-chevron-right text-brand-4 group-hover:text-brand-2 group-hover:translate-x-1 transition-all"></i>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-brand-5 text-center">
          <p className="text-[11px] text-brand-4 font-bold uppercase tracking-[0.2em]">
            &copy; 2024 CondoLink • Fluxibi Ltda.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
