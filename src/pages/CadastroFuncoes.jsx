import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Trash2, Plus, ArrowLeft, Edit } from 'lucide-react';

function CadastroFuncoes() {
  const navigate = useNavigate();
  const [funcao, setFuncao] = useState('');
  const [lista, setLista] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    carregarFuncoes();
  }, []);

  const carregarFuncoes = async () => {
    // Buscamos as funções sempre ordenadas para consistência
    const { data, error } = await supabase
      .from('funcoes')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error("Erro ao carregar funções:", error);
    } else {
      setLista(data || []);
    }
  };

  const salvarFuncao = async (e) => {
    e.preventDefault();
    if (!funcao.trim()) return;

    if (editingId) {
      const { error } = await supabase
        .from('funcoes')
        .update({ nome_funcao: funcao })
        .eq('id', editingId);

      if (error) {
        alert("Erro ao atualizar função: " + error.message);
      } else {
        setFuncao('');
        setEditingId(null);
        await carregarFuncoes();
      }
    } else {
      const { error } = await supabase
        .from('funcoes')
        .insert([{ nome_funcao: funcao }]);

      if (error) {
        alert("Erro ao salvar função: " + error.message);
      } else {
        setFuncao('');
        await carregarFuncoes();
      }
    }
  };

  const excluirFuncao = async (id) => {
    if (confirm("Deseja realmente excluir esta função?")) {
      const { error } = await supabase.from('funcoes').delete().eq('id', id);
      if (error) {
        alert("Erro ao excluir: " + error.message);
      } else {
        await carregarFuncoes();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <header className="max-w-2xl mx-auto flex items-center gap-4 bg-blue-900 text-white p-6 rounded-t-xl shadow-md">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-blue-800 rounded-lg text-white hover:bg-blue-700 transition-colors">
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-3xl font-extrabold">Cadastro de Funções</h1>
      </header>

      <main className="max-w-2xl mx-auto bg-white p-8 rounded-b-xl shadow-lg border-2 border-gray-300">
        <form onSubmit={salvarFuncao} className="flex gap-2 mb-6">
          <input
            className="flex-1 p-3 border-2 border-gray-400 rounded-lg font-bold"
            value={funcao}
            onChange={(e) => setFuncao(e.target.value)}
            placeholder="Ex: Músico, Obreiro..."
            required
          />
          {editingId ? (
            <>
              <button type="submit" className="bg-green-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-800 transition-colors">
                Atualizar
              </button>
              <button 
                type="button" 
                onClick={() => { setFuncao(''); setEditingId(null); }}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button type="submit" className="bg-blue-800 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-900 transition-colors">
              <Plus size={20} /> Salvar
            </button>
          )}
        </form>

        <ul className="space-y-2">
          {lista.map(f => (
            <li key={f.id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg font-bold border-2 border-gray-200">
              {f.nome_funcao}
              <div className="flex gap-2">
                <button 
                  onClick={() => { setFuncao(f.nome_funcao); setEditingId(f.id); }} 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Editar Função"
                >
                  <Edit size={20} />
                </button>
                <button onClick={() => excluirFuncao(f.id)} className="text-red-600 hover:text-red-800 transition-colors" title="Excluir Função">
                  <Trash2 size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default CadastroFuncoes;