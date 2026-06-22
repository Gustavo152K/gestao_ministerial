import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, UserPlus, Loader2, KeyRound, Mail, Trash2, Edit } from 'lucide-react';
import { supabase } from '../supabaseClient';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function CadastroUsuarios() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  // Estados para gerenciamento de lista de operadores
  const [operadores, setOperadores] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [editingUser, setEditingUser] = useState(null); // ID do operador sendo editado
  const [novaSenha, setNovaSenha] = useState('');
  const [loadingAcao, setLoadingAcao] = useState(false);

  useEffect(() => {
    carregarOperadores();
  }, []);

  const carregarOperadores = async () => {
    setLoadingList(true);
    try {
      const { data, error } = await supabase.rpc('list_users');
      if (error) throw error;
      setOperadores(data || []);
    } catch (err) {
      console.error("Erro ao carregar operadores:", err);
    } finally {
      setLoadingList(false);
    }
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMensagem('Erro: As senhas não conferem.');
      return;
    }
    if (password.length < 6) {
      setMensagem('Erro: A senha precisa ter no mínimo 6 caracteres.');
      return;
    }
    setLoading(true);
    setMensagem('');

    try {
      const tempSupabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false }
      });

      const { error } = await tempSupabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      setMensagem('Usuário cadastrado com sucesso!');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      carregarOperadores(); // Recarrega a listagem
    } catch (err) {
      console.error(err);
      setMensagem('Erro ao cadastrar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id, userEmail) => {
    if (confirm(`Deseja realmente excluir o operador "${userEmail}"? Ele perderá o acesso imediatamente.`)) {
      setLoadingAcao(true);
      try {
        const { error } = await supabase.rpc('delete_user_by_id', { user_uuid: id });
        if (error) throw error;
        setOperadores(operadores.filter(op => op.id !== id));
      } catch (err) {
        console.error("Erro ao excluir operador:", err);
        alert("Erro ao excluir operador: " + err.message);
      } finally {
        setLoadingAcao(false);
      }
    }
  };

  const handleAlterarSenha = async (e, id) => {
    e.preventDefault();
    if (novaSenha.length < 6) {
      alert("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }
    setLoadingAcao(true);
    try {
      const { error } = await supabase.rpc('update_user_password', { 
        user_uuid: id, 
        new_password: novaSenha 
      });
      if (error) throw error;
      alert("Senha alterada com sucesso!");
      setEditingUser(null);
      setNovaSenha('');
    } catch (err) {
      console.error("Erro ao alterar senha:", err);
      alert("Erro ao alterar senha: " + err.message);
    } finally {
      setLoadingAcao(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <header className="max-w-4xl mx-auto flex items-center gap-4 bg-blue-900 text-white p-6 rounded-t-xl shadow-md">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-blue-800 rounded-lg text-white hover:bg-blue-700 transition-colors">
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-3xl font-extrabold">Cadastro de Operadores</h1>
      </header>

      <main className="max-w-4xl mx-auto bg-white p-8 rounded-b-xl shadow-lg border-2 border-gray-300 space-y-10">
        
        {/* Formulário de Cadastro */}
        <section className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
            <UserPlus className="text-blue-900" /> Registrar Novo Operador
          </h2>
          
          <form onSubmit={handleCadastro} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-gray-900 font-bold mb-2 text-sm" htmlFor="email">
                E-mail do Operador
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-700">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-400 rounded-lg text-gray-950 font-bold placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-600 focus:border-blue-700 bg-gray-50 text-sm"
                  placeholder="operador@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-900 font-bold mb-2 text-sm" htmlFor="password">
                Senha Inicial
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-700">
                  <KeyRound size={18} />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-400 rounded-lg text-gray-950 font-bold placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-600 focus:border-blue-700 bg-gray-50 text-sm"
                  placeholder="Mínimo 6 digitos"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-900 font-bold mb-2 text-sm" htmlFor="confirmPassword">
                Confirmar Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-700">
                  <KeyRound size={18} />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-400 rounded-lg text-gray-950 font-bold placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-600 focus:border-blue-700 bg-gray-50 text-sm"
                  placeholder="Confirme a senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="md:col-span-3">
              {mensagem && (
                <div className={`p-4 mb-4 rounded-md font-bold text-center border-2 ${mensagem.includes('Erro') ? 'bg-red-100 text-red-900 border-red-500' : 'bg-green-100 text-green-900 border-green-500'}`}>
                  {mensagem}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <><Loader2 className="animate-spin" /> Cadastrando...</>
                ) : (
                  <><UserPlus size={20} /> Cadastrar Operador</>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Tabela de Listagem de Operadores */}
        <section className="border-2 border-gray-300 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gray-900 text-white p-4">
            <h3 className="text-xl font-extrabold">Operadores Ativos no Sistema</h3>
          </div>

          {loadingList ? (
            <div className="p-8 text-center flex items-center justify-center gap-2 font-bold text-gray-600">
              <Loader2 className="animate-spin text-blue-800" /> Carregando operadores...
            </div>
          ) : operadores.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-bold border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300 text-gray-700 text-sm">
                    <th className="p-4">E-mail de Acesso</th>
                    <th className="p-4">Cadastrado em</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {operadores.map((op) => (
                    <tr key={op.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-gray-900">{op.email}</td>
                      <td className="p-4 text-gray-600 text-sm">
                        {new Date(op.created_at).toLocaleDateString('pt-BR')} às {new Date(op.created_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                      </td>
                      <td className="p-4 text-right">
                        {editingUser === op.id ? (
                          <form onSubmit={(e) => handleAlterarSenha(e, op.id)} className="flex items-center justify-end gap-2">
                            <input 
                              type="password"
                              placeholder="Nova senha (min 6)"
                              className="p-1.5 border-2 rounded font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                              value={novaSenha}
                              onChange={(e) => setNovaSenha(e.target.value)}
                              required
                            />
                            <button 
                              type="submit" 
                              disabled={loadingAcao}
                              className="bg-green-700 text-white px-3 py-1.5 rounded text-xs font-black hover:bg-green-800 transition-colors"
                            >
                              Salvar
                            </button>
                            <button 
                              type="button" 
                              onClick={() => { setEditingUser(null); setNovaSenha(''); }}
                              className="bg-gray-500 text-white px-3 py-1.5 rounded text-xs font-black hover:bg-gray-600 transition-colors"
                            >
                              Cancelar
                            </button>
                          </form>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => { setEditingUser(op.id); setNovaSenha(''); }}
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                              title="Alterar Senha"
                              disabled={loadingAcao}
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleExcluir(op.id, op.email)}
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                              title="Excluir Operador"
                              disabled={loadingAcao}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 font-bold">
              Nenhum operador cadastrado.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default CadastroUsuarios;
