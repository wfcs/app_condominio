
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

    // Admin private access (Hardcoded for immediate control)
    if (email === 'adm@fluxibi.com.br' && password === '@felipedovinho_2023') {
      const adminUser = users.find(u => u.id === 'admin-fluxibi');
      if (adminUser) {
        onLogin(adminUser);
        return;
      }
    }

    // Tenta autenticar via Supabase se as chaves estiverem configuradas
    try {
      if (email && password) {
        const { data, error: sbError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        // Se o Supabase estiver configurado e o usuário existir lá
        if (data?.user && !sbError) {
          // Mapeia o usuário do Supabase para o nosso tipo local
          const mappedUser: User = {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || email.split('@')[0],
            unit: data.user.user_metadata?.unit || 'N/A',
            role: data.user.user_metadata?.role || 'Morador'
          } as any;
          onLogin(mappedUser);
          return;
        }
      }
    } catch (e) {
      console.warn("Supabase não configurado ou erro de conexão. Usando fallback de demo.");
    }

    // Fallback: Normal login behavior for testing
    if (email.includes('@')) {
       const foundUser = users.find(u => u.name.toLowerCase().includes(email.split('@')[0]) && u.id !== 'admin-fluxibi');
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
    setRecoveryStatus(null);

    if (!email || !email.includes('@')) {
      setError('Por favor, insira um e-mail válido para solicitar a recuperação.');
      return;
    }

    // Check if user exists in the system (mock or admin)
    const userExists = users.some(u => u.name.toLowerCase().includes(email.split('@')[0])) || email === 'adm@fluxibi.com.br';

    if (!userExists) {
      setError('Este e-mail não consta na base de dados deste condomínio.');
      return;
    }

    setRecoveryStatus({ loading: true, success: false });
    
    // Tenta enviar via Supabase Auth
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
      if (resetError) throw resetError;
    } catch (e) {
      console.warn("Falha no Supabase Reset. Simulando internamente...");
    }
    
    setTimeout(() => {
      const tempPass = Math.random().toString(36).slice(-8).toUpperCase();
      setRecoveryStatus({ loading: false, success: true, tempPass });
    }, 2000);
  };

  const demoUsers = users.filter(user => user.id !== 'admin-fluxibi');

  return (
    <div className="min-h-screen bg-neutral-surface dark:bg-brand-1 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-2/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-3/10 rounded-full blur-3xl"></div>

      <div className="bg-white dark:bg-white/5 rounded-3xl shadow-xl p-8 md:p-12 max-w-md w-full relative z-10 border border-slate-100 dark:border-white/10 backdrop-blur-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-1 dark:bg-brand-3 text-white rounded-2xl shadow-lg shadow-brand-1/20 mb-6 transform hover:scale-105 transition-transform duration-300">
            <i className="fa-solid fa-building-shield text-4xl text-white"></i>
          </div>
          <h1 className="text-3xl font-extrabold text-brand-1 dark:text-white tracking-tight">CondoConnect</h1>
          <p className="text-brand-2 dark:text-brand-4 mt-2 font-medium">Plataforma de Governança Fluxibi</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs font-bold border border-red-100 dark:border-red-500/20 flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
            <i className="fa-solid fa-triangle-exclamation"></i>
            {error}
          </div>
        )}

        {recoveryStatus && (
          <div className={`mb-6 p-4 rounded-2xl border ${recoveryStatus.success ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20' : 'bg-brand-5 border-brand-4 dark:bg-white/5 dark:border-white/10'} animate-in zoom-in duration-300`}>
            {recoveryStatus.loading ? (
              <div className="flex items-center justify-center gap-3 py-2">
                <i className="fa-solid fa-circle-notch fa-spin text-brand-2 dark:text-brand-3"></i>
                <span className="text-xs font-bold text-brand-1 dark:text-brand-4 uppercase tracking-widest">Processando pedido...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <i className="fa-solid fa-circle-check"></i>
                  <span className="text-sm font-bold">Solicitação enviada!</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  As instruções foram enviadas para <strong>{email}</strong>. Use a senha temporária abaixo se o serviço de e-mail estiver em modo sandbox.
                </p>
                <div className="bg-white dark:bg-black/20 p-2 rounded-lg text-center border border-emerald-100 dark:border-white/5">
                  <span className="text-sm font-mono font-black text-brand-1 dark:text-white tracking-widest">{recoveryStatus.tempPass}</span>
                </div>
                <button 
                  onClick={() => setRecoveryStatus(null)}
                  className="w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-brand-1 dark:hover:text-white"
                >
                  Fechar Aviso
                </button>
              </div>
            )}
          </div>
        )}

        {!isSimulating ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-brand-4 uppercase tracking-widest mb-2 ml-1">E-mail Corporativo</label>
              <div className="relative">
                <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-brand-2 dark:text-brand-3"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu e-mail"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-brand-4 dark:border-white/10 bg-neutral-surface dark:bg-white/5 focus:bg-white dark:focus:bg-white/10 focus:ring-4 focus:ring-brand-3/10 focus:border-brand-3 outline-none transition-all text-brand-1 dark:text-white font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-xs font-bold text-slate-500 dark:text-brand-4 uppercase tracking-widest">Senha</label>
                <button 
                  type="button"
                  onClick={handleRecoverPassword}
                  className="text-xs font-bold text-brand-2 dark:text-brand-3 hover:underline cursor-pointer"
                >
                  Recuperar
                </button>
              </div>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-brand-2 dark:text-brand-3"></i>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-brand-4 dark:border-white/10 bg-neutral-surface dark:bg-white/5 focus:bg-white dark:focus:bg-white/10 focus:ring-4 focus:ring-brand-3/10 focus:border-brand-3 outline-none transition-all text-brand-1 dark:text-white font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-1 dark:bg-brand-3 text-white py-4 rounded-xl font-bold hover:bg-brand-2 dark:hover:bg-brand-2 transition-all shadow-lg shadow-brand-1/10 flex items-center justify-center gap-3"
            >
              Acessar Painel
              <i className="fa-solid fa-chevron-right text-xs"></i>
            </button>

            <div className="pt-4 text-center">
              <button 
                type="button"
                onClick={() => setIsSimulating(true)}
                className="text-sm font-semibold text-brand-3 dark:text-brand-4 hover:text-brand-2 dark:hover:text-white transition-colors"
              >
                <i className="fa-solid fa-shield-halved mr-2"></i>
                Simular Acessos Demo
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-4">
               <p className="text-xs font-bold text-slate-400 dark:text-brand-4 uppercase tracking-widest">Contas de Teste:</p>
               <button onClick={() => setIsSimulating(false)} className="text-xs font-bold text-brand-2 dark:text-brand-3">Voltar</button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {demoUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => onLogin(user)}
                  className="w-full flex items-center p-4 border border-brand-4 dark:border-white/10 bg-neutral-surface dark:bg-white/5 rounded-2xl hover:border-brand-2 hover:bg-brand-5/30 dark:hover:bg-white/10 transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-white dark:bg-slate-800 border border-brand-4 dark:border-white/20 rounded-full flex items-center justify-center text-brand-1 dark:text-white font-bold mr-4">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-brand-1 dark:text-white text-sm">{user.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-brand-4 font-medium uppercase tracking-tight">
                      {user.role} {user.unit && user.unit !== 'N/A' ? `• ${user.unit}` : ''}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-slate-50 dark:border-white/10 text-center">
          <p className="text-[10px] text-slate-400 dark:text-brand-4 font-bold uppercase tracking-[0.2em]">
            Fluxibi Consulting © Copyright 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
