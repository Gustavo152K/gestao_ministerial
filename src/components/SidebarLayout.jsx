import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { LogOut, Calendar, Users, FolderOpen, ShieldCheck, Home, UserPlus, Tag, UserCheck, FileText } from 'lucide-react';

function SidebarLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => `
    flex items-center gap-3 px-4 py-2.5 rounded-lg font-bold text-sm transition-all duration-150
    ${isActive(path) 
      ? 'bg-blue-800 text-white shadow-md' 
      : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
  `;

  return (
    <div className="min-h-screen bg-gray-100 flex w-full">
      {/* Sidebar Fixo */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl h-screen fixed left-0 top-0 z-40 shrink-0">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-extrabold text-white">Gestão Ministerial</h2>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
          <p className="text-xs font-black text-gray-500 uppercase px-4 pb-1">Principal</p>
          <Link to="/dashboard" className={linkClass('/dashboard')}><Home size={18} /> Dashboard</Link>
          <Link to="/escalas" className={linkClass('/escalas')}><Calendar size={18} /> Escalas</Link>
          <Link to="/repositorio" className={linkClass('/repositorio')}><FolderOpen size={18} /> Mídias</Link>
          <Link to="/kids" className={linkClass('/kids')}><ShieldCheck size={18} /> Check-in Kids</Link>
          <Link to="/cadastro-kids" className={linkClass('/cadastro-kids')}><UserCheck size={18} /> Cadastrar Crianças</Link>
          
          <p className="text-xs font-black text-gray-500 uppercase px-4 pt-4 pb-1">Cadastros</p>
          <Link to="/membros" className={linkClass('/membros')}><UserPlus size={18} /> Membros</Link>
          <Link to="/funcoes" className={linkClass('/funcoes')}><Tag size={18} /> Funções</Link>
          <Link to="/cadastro-usuarios" className={linkClass('/cadastro-usuarios')}><Users size={18} /> Cadastro de Operadores</Link>
          <Link to="/relatorios" className={linkClass('/relatorios')}><FileText size={18} /> Relatórios</Link>
        </nav>
        <button 
          onClick={handleLogout} 
          className="m-4 bg-red-700 hover:bg-red-800 py-3 rounded-lg font-bold text-white shrink-0 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={18} /> Sair
        </button>
      </aside>

      {/* Área Principal de Conteúdo */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
}

export default SidebarLayout;
