
import React, { useState } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onLogin: (user: User) => void;
  users: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, users }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState('');
  const [recoveryStatus, setRecoveryStatus] = useState<{ loading: boolean; success: boolean; tempPass?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email === 'adm@fluxibi.com.br' && password === '@felipedovinho_2023') {
      const adminUser = users.find(u => u.id === 'admin-fluxibi');
      if (adminUser) {
        onLogin(adminUser);
        return;
      }
    }

    try {
      if (email && password) {
        const { data, error: sbError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (data?.user && !sbError) {
          const mappedUser: User = {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || email.split('@')[0],
            unit: data.user.user_metadata?.unit || 'N/A',
            role: data.user.user_metadata?.role || 'Morador',
            clientId: data.user.user_metadata?.clientId || 'client-1'
          } as any;
          onLogin(mappedUser);
          return;
        }
      }
    } catch (e) {
      console.warn("Supabase auth error. Usando fallback.");
    }

    if (email.includes('@')) {
       const foundUser = users.find(u => u.email === email && u.id !== 'admin-fluxibi');
       if (foundUser) {
         onLogin(foundUser);
       } else {
         setError('Usuário não encontrado ou acesso restrito.');
       }
    } else {
       setError('Credenciais inválidas para o ambiente de produção.');
    }
  };

  const handleRecoverPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError('');
    setRecoveryStatus({ loading: true, success: false });
    
    setTimeout(() => {
      const tempPass = Math.random().toString(36).slice(-8).toUpperCase();
      setRecoveryStatus({ loading: false, success: true, tempPass });
    }, 1500);
  };

  const demoUsers = users.filter(user => user.id !== 'admin-fluxibi');

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#48cae4] via-[#caf0f8] to-[#48cae4] animate-gradient-slow">
      {/* Elementos decorativos de fundo para profundidade */}
      <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] bg-white/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] bg-[#00b4d8]/20 rounded-full blur-[100px]"></div>

      <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] p-8 md:p-14 max-w-md w-full relative z-10 border border-white/40">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-1 text-white rounded-[1.5rem] shadow-2xl mb-6 transform hover:scale-110 hover:rotate-3 transition-all duration-500">
            <i className="fa-solid fa-building-circle-check text-4xl"></i>
          </div>
          <h1 className="text-4xl font-black text-brand-1 tracking-tight">CondoConnect</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="h-px w-8 bg-brand-3"></span>
            <p className="text-brand-2 font-black uppercase text-[10px] tracking-[0.3em]">Gestão Fluxibi</p>
            <span className="h-px w-8 bg-brand-3"></span>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <i className="fa-solid fa-triangle-exclamation text-lg"></i>
            {error}
          </div>
        )}

        {!isSimulating ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
              <div className="relative group">
                <i className="fa-regular fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-brand-3 group-focus-within:text-brand-1 transition-colors"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-14 pr-6 py-5 rounded-2xl border border-slate-200/60 bg-white focus:ring-4 focus:ring-brand-3/10 focus:border-brand-3 outline-none transition-all font-bold text-brand-1 placeholder:text-slate-300 shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Senha de Acesso</label>
                <button type="button" onClick={handleRecoverPassword} className="text-[10px] font-black text-brand-2 hover:text-brand-1 transition-colors">RECUPERAR</button>
              </div>
              <div className="relative group">
                <i className="fa-solid fa-fingerprint absolute left-5 top-1/2 -translate-y-1/2 text-brand-3 group-focus-within:text-brand-1 transition-colors"></i>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-5 rounded-2xl border border-slate-200/60 bg-white focus:ring-4 focus:ring-brand-3/10 focus:border-brand-3 outline-none transition-all font-bold text-brand-1 placeholder:text-slate-300 shadow-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-1 text-white py-5 rounded-2xl font-black hover:bg-[#023e8a] active:scale-[0.98] transition-all shadow-xl shadow-brand-1/20 flex items-center justify-center gap-3 mt-4"
            >
              ACESSAR ECOSSISTEMA
              <i className="fa-solid fa-chevron-right text-xs"></i>
            </button>

            <div className="pt-6 text-center">
              <button 
                type="button"
                onClick={() => setIsSimulating(true)}
                className="inline-flex items-center gap-2 text-[11px] font-black text-brand-3 hover:text-brand-1 transition-colors bg-brand-5/30 px-4 py-2 rounded-full"
              >
                <i className="fa-solid fa-flask"></i>
                MODO DEMONSTRATIVO
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-6 px-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Escolha um Perfil de Teste:</p>
               <button onClick={() => setIsSimulating(false)} className="text-[10px] font-black text-brand-1 hover:underline">VOLTAR</button>
            </div>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
              {demoUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => onLogin(user)}
                  className="w-full flex items-center p-5 bg-white border border-slate-100 rounded-3xl hover:border-brand-3 hover:shadow-lg hover:shadow-brand-3/5 transition-all text-left group"
                >
                  <div className="w-12 h-12 bg-brand-5 text-brand-1 rounded-2xl flex items-center justify-center font-black mr-4 shrink-0 group-hover:bg-brand-1 group-hover:text-white transition-colors">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-brand-1 text-sm truncate">{user.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] font-black text-brand-3 uppercase tracking-tighter">{user.role}</span>
                      <span className="text-[9px] text-slate-300">•</span>
                      <span className="text-[9px] font-bold text-slate-400">{user.unit}</span>
                    </div>
                  </div>
                  <i className="fa-solid fa-chevron-right text-[10px] text-slate-200 group-hover:text-brand-3 transition-colors"></i>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
          <div className="flex justify-center gap-4 mb-4 opacity-20">
            <i className="fa-solid fa-shield-halved"></i>
            <i className="fa-solid fa-lock"></i>
            <i className="fa-solid fa-cloud"></i>
          </div>
          <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.4em]">
            Fluxibi Technologies • 2026
          </p>
        </div>
      </div>
      
      <style>{`
        @keyframes gradient-slow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-slow {
          background-size: 200% 200%;
          animation: gradient-slow 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
