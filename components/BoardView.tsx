
import React, { useState } from 'react';
import { User, Announcement, Comment } from '../types';

interface BoardViewProps {
  user: User;
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
}

const BoardView: React.FC<BoardViewProps> = ({ user, announcements, setAnnouncements }) => {
  const [filter, setFilter] = useState('Todos');
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<any>('Comunicado');
  const [activeCommentBox, setActiveCommentBox] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const categories = ['Todos', 'Assembleia', 'Comunicado', 'Evento', 'Brechó', 'Social'];

  const filtered = filter === 'Todos' ? announcements : announcements.filter(a => a.category === filter);

  const addPost = () => {
    if (!title || !content) return;
    const post: Announcement = {
      id: Date.now().toString(),
      title,
      content,
      category,
      author: user.name + ' (' + user.unit + ')',
      authorId: user.id,
      date: new Date(),
      likes: [],
      comments: []
    };
    setAnnouncements([post, ...announcements]);
    setShowAdd(false);
    setTitle('');
    setContent('');
  };

  const handleLike = (postId: string) => {
    setAnnouncements(prev => prev.map(a => {
      if (a.id === postId) {
        const hasLiked = a.likes.includes(user.id);
        return {
          ...a,
          likes: hasLiked 
            ? a.likes.filter(id => id !== user.id) 
            : [...a.likes, user.id]
        };
      }
      return a;
    }));
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      author: `${user.name} (${user.unit})`,
      content: commentText,
      date: new Date()
    };

    setAnnouncements(prev => prev.map(a => {
      if (a.id === postId) {
        return { ...a, comments: [...a.comments, newComment] };
      }
      return a;
    }));
    setCommentText('');
    setActiveCommentBox(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-inter tracking-tight">Mural do Condomínio</h1>
          <p className="text-slate-500 dark:text-brand-4 font-medium">Interaja com a sua comunidade em tempo real.</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-brand-1 dark:bg-brand-3 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-2 transition-all flex items-center gap-2 shadow-lg shadow-brand-1/10"
        >
          <i className="fa-solid fa-pencil"></i> Criar Publicação
        </button>
      </div>

      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-all whitespace-nowrap ${
              filter === cat ? 'bg-brand-1 dark:bg-brand-3 text-white shadow-md' : 'bg-white dark:bg-white/5 text-slate-600 dark:text-brand-4 border border-slate-200 dark:border-white/10 hover:border-brand-3'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-white/5 p-8 rounded-2xl border-2 border-brand-4 dark:border-white/10 shadow-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Título do anúncio"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-3/20"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-3/20"
            >
              {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <textarea
            placeholder="O que você quer compartilhar?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-slate-800 dark:text-white h-32 resize-none outline-none focus:ring-2 focus:ring-brand-3/20"
          ></textarea>
          <div className="flex gap-4">
            <button onClick={addPost} className="flex-1 bg-brand-1 dark:bg-brand-3 text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">Publicar Agora</button>
            <button onClick={() => setShowAdd(false)} className="px-6 py-3 bg-slate-100 dark:bg-white/10 rounded-xl font-bold text-slate-600 dark:text-brand-4">Cancelar</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {filtered.map(a => {
          const isLiked = a.likes.includes(user.id);
          return (
            <div key={a.id} className="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden hover:border-brand-4 transition-all">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${
                    a.category === 'Assembleia' ? 'bg-rose-100 text-rose-600' : 
                    a.category === 'Brechó' ? 'bg-amber-100 text-amber-600' :
                    a.category === 'Evento' ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-5 text-brand-2'
                  }`}>
                    <i className={`fa-solid ${
                      a.category === 'Assembleia' ? 'fa-gavel' : 
                      a.category === 'Brechó' ? 'fa-tags' :
                      a.category === 'Evento' ? 'fa-calendar-star' : 'fa-info-circle'
                    }`}></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-1 dark:text-white">{a.title}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                      <span className="uppercase tracking-widest text-brand-3">{a.category}</span>
                      <span>•</span>
                      <span>{new Date(a.date).toLocaleDateString('pt-BR')}</span>
                      <span>•</span>
                      <span className="text-brand-2 dark:text-brand-4">{a.author}</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{a.content}</p>
                
                <div className="mt-6 flex items-center justify-between border-t border-slate-50 dark:border-white/5 pt-4">
                  <div className="flex gap-6">
                    <button 
                      onClick={() => handleLike(a.id)}
                      className={`flex items-center gap-2 text-sm font-bold transition-all ${isLiked ? 'text-rose-500 transform scale-110' : 'text-slate-400 hover:text-brand-1 dark:hover:text-white'}`}
                    >
                      <i className={`${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart`}></i> 
                      {a.likes.length > 0 && <span>{a.likes.length}</span>}
                      {isLiked ? 'Curtiu' : 'Curtir'}
                    </button>
                    <button 
                      onClick={() => setActiveCommentBox(activeCommentBox === a.id ? null : a.id)}
                      className="text-slate-400 hover:text-brand-1 dark:hover:text-white flex items-center gap-2 text-sm font-bold transition-colors"
                    >
                      <i className="fa-regular fa-comment"></i> 
                      {a.comments.length > 0 && <span>{a.comments.length}</span>}
                      Comentar
                    </button>
                  </div>
                </div>

                {/* Seção de Comentários */}
                {(activeCommentBox === a.id || a.comments.length > 0) && (
                  <div className="mt-4 pt-4 border-t border-slate-50 dark:border-white/5 space-y-4">
                    {a.comments.map(c => (
                      <div key={c.id} className="flex gap-3 text-sm bg-slate-50 dark:bg-white/5 p-3 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-brand-4 flex items-center justify-center font-bold text-brand-1 shrink-0 text-xs">
                          {c.author.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-brand-1 dark:text-white text-xs">{c.author}</p>
                          <p className="text-slate-600 dark:text-slate-400 mt-0.5">{c.content}</p>
                        </div>
                      </div>
                    ))}

                    {activeCommentBox === a.id && (
                      <div className="flex gap-2 animate-in slide-in-from-top-2 duration-200">
                        <input 
                          type="text" 
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Escreva um comentário..."
                          className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-3/20 dark:text-white"
                          autoFocus
                          onKeyPress={(e) => e.key === 'Enter' && handleAddComment(a.id)}
                        />
                        <button 
                          onClick={() => handleAddComment(a.id)}
                          className="bg-brand-1 dark:bg-brand-3 text-white px-4 py-2 rounded-xl text-sm font-bold"
                        >
                          Postar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BoardView;
