import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

function CadastroMembros() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [funcaoId, setFuncaoId] = useState('');
  const [funcoes, setFuncoes] = useState([]);
  const [membros, setMembros] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const { data: f } = await supabase.from('funcoes').select('*');
    const { data: m } = await supabase.from('membros').select('*, funcoes(nome_funcao)');
    setFuncoes(f || []);
    setMembros(m || []);
  };

  const salvarMembro = async (e) => {
    e.preventDefault();
    
    const payload = { 
      nome, 
      telefone: telefone || null, 
      funcao_id: funcaoId ? parseInt(funcaoId) : null 
    };

    if (editingId) {
      const { error } = await supabase
        .from('membros')
        .update(payload)
        .eq('id', editingId);

      if (error) {
        alert("Erro ao atualizar voluntário: " + error.message);
      } else {
        setNome('');
        setTelefone('');
        setFuncaoId('');
        setEditingId(null);
        carregarDados();
      }
    } else {
      const { error } = await supabase
        .from('membros')
        .insert([payload]);

      if (error) {
        alert("Erro ao cadastrar voluntário: " + error.message);
      } else {
        setNome('');
        setTelefone('');
        setFuncaoId('');
        carregarDados();
      }
    }
  };

  const excluirMembro = async (id) => {
    if (confirm("Deseja realmente excluir este voluntário?")) {
      const { error } = await supabase
        .from('membros')
        .delete()
        .eq('id', id);

      if (error) {
        alert("Erro ao excluir voluntário: " + error.message);
      } else {
        carregarDados();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <header className="max-w-4xl mx-auto flex items-center gap-4 bg-blue-900 text-white p-6 rounded-t-xl shadow-md">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-blue-800 rounded-lg text-white hover:bg-blue-700 transition-colors">
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-3xl font-extrabold">Cadastro de Voluntários</h1>
      </header>

      <main className="max-w-4xl mx-auto bg-white p-8 rounded-b-xl shadow-lg border-2 border-gray-300">
        <form onSubmit={salvarMembro} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <input className="p-3 border-2 border-gray-400 rounded-lg font-bold" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <input className="p-3 border-2 border-gray-400 rounded-lg font-bold" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          <select className="p-3 border-2 border-gray-400 rounded-lg font-bold" value={funcaoId} onChange={(e) => setFuncaoId(e.target.value)}>
            <option value="">Selecione a função...</option>
            {funcoes.map(f => <option key={f.id} value={f.id}>{f.nome_funcao}</option>)}
          </select>
          <div className="md:col-span-3 flex gap-2">
            <button className="flex-1 bg-green-700 text-white py-3 rounded-lg font-extrabold hover:bg-green-800 transition-colors">
              {editingId ? 'Atualizar Voluntário' : 'Cadastrar Voluntário'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => { setNome(''); setTelefone(''); setFuncaoId(''); setEditingId(null); }}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-extrabold hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
        
        <table className="w-full text-left font-bold border-collapse">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="p-3">Nome</th>
              <th className="p-3">Telefone</th>
              <th className="p-3">Função</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {membros.map(m => (
              <tr key={m.id} className="border-b-2">
                <td className="p-3">{m.nome}</td>
                <td className="p-3">{m.telefone || 'Não informado'}</td>
                <td className="p-3">{m.funcoes?.nome_funcao || 'Não informada'}</td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => { setNome(m.nome); setTelefone(m.telefone || ''); setFuncaoId(m.funcao_id || ''); setEditingId(m.id); }}
                      className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                      title="Editar Voluntário"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => excluirMembro(m.id)}
                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      title="Excluir Voluntário"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
export default CadastroMembros;