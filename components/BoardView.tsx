
import React, { useState } from 'react';
import { User, UserRole, Announcement } from '../types';

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
      date: new Date()
    };
    setAnnouncements([post, ...announcements]);
    setShowAdd(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mural do Condomínio</h1>
          <p className="text-slate-500">Notícias, avisos e anúncios da comunidade.</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
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
              filter === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {showAdd && (
        <div className="bg-white p-8 rounded-2xl border-2 border-indigo-100 shadow-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Título do anúncio"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200"
            >
              {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <textarea
            placeholder="O que você quer compartilhar?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 h-32 resize-none"
          ></textarea>
          <div className="flex gap-4">
            <button onClick={addPost} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold">Publicar Agora</button>
            <button onClick={() => setShowAdd(false)} className="px-6 py-3 bg-slate-100 rounded-xl font-bold text-slate-600">Cancelar</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {filtered.map(a => (
          <div key={a.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-indigo-200 transition-all group">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${
                  a.category === 'Assembleia' ? 'bg-rose-100 text-rose-600' : 
                  a.category === 'Brechó' ? 'bg-amber-100 text-amber-600' :
                  a.category === 'Evento' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'
                }`}>
                  <i className={`fa-solid ${
                    a.category === 'Assembleia' ? 'fa-gavel' : 
                    a.category === 'Brechó' ? 'fa-tags' :
                    a.category === 'Evento' ? 'fa-calendar-star' : 'fa-info-circle'
                  }`}></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{a.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <span className="uppercase tracking-wider">{a.category}</span>
                    <span>•</span>
                    <span>{new Date(a.date).toLocaleDateString('pt-BR')}</span>
                    <span>•</span>
                    <span className="text-indigo-600">{a.author}</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{a.content}</p>
              
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex gap-4">
                  <button className="text-slate-400 hover:text-indigo-600 flex items-center gap-2 text-sm transition-colors">
                    <i className="fa-regular fa-heart"></i> Curtir
                  </button>
                  <button className="text-slate-400 hover:text-indigo-600 flex items-center gap-2 text-sm transition-colors">
                    <i className="fa-regular fa-comment"></i> Comentar
                  </button>
                </div>
                <button className="text-slate-400 hover:text-indigo-600 text-sm">
                  <i className="fa-solid fa-share-nodes"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardView;
