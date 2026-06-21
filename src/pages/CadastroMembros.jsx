import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowLeft } from 'lucide-react';

function CadastroMembros() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [funcaoId, setFuncaoId] = useState('');
  const [funcoes, setFuncoes] = useState([]);
  const [membros, setMembros] = useState([]);

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
    await supabase.from('membros').insert([{ nome, telefone, funcao_id: funcaoId }]);
    setNome(''); setTelefone(''); setFuncaoId('');
    carregarDados();
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
          <input className="p-3 border-2 border-gray-400 rounded-lg font-bold" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input className="p-3 border-2 border-gray-400 rounded-lg font-bold" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          <select className="p-3 border-2 border-gray-400 rounded-lg font-bold" value={funcaoId} onChange={(e) => setFuncaoId(e.target.value)}>
            <option value="">Selecione a função...</option>
            {funcoes.map(f => <option key={f.id} value={f.id}>{f.nome_funcao}</option>)}
          </select>
          <button className="md:col-span-3 bg-green-700 text-white py-3 rounded-lg font-extrabold">Cadastrar Membro</button>
        </form>
        
        <table className="w-full text-left font-bold border-collapse">
          <thead><tr className="bg-gray-900 text-white"><th className="p-3">Nome</th><th className="p-3">Função</th></tr></thead>
          <tbody>{membros.map(m => <tr key={m.id} className="border-b-2">
              <td className="p-3">{m.nome}</td>
              <td className="p-3">{m.funcoes?.nome_funcao}</td>
            </tr>)}</tbody>
        </table>
      </main>
    </div>
  );
}
export default CadastroMembros;