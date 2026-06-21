import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Plus, Trash2, UserPlus, ShieldCheck, ArrowLeft } from 'lucide-react';

function CadastroKids() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [telefone, setTelefone] = useState('');
  const [alergia, setAlergia] = useState('Nenhuma');
  const [lista, setLista] = useState([]);

  useEffect(() => {
    carregarCriancas();
  }, []);

  const carregarCriancas = async () => {
    const { data } = await supabase.from('kids_checkin').select('*');
    setLista(data || []);
  };

  const salvarCrianca = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('kids_checkin').insert([
      { nome_crianca: nome, responsavel, telefone, alergia, status: 'Pendente' }
    ]);
    
    if (error) alert("Erro ao cadastrar");
    else {
      setNome(''); setResponsavel(''); setTelefone('');
      carregarCriancas();
      alert("Criança cadastrada!");
    }
  };

  const excluirCrianca = async (id) => {
    await supabase.from('kids_checkin').delete().eq('id', id);
    carregarCriancas();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <header className="max-w-4xl mx-auto flex items-center gap-4 bg-blue-900 text-white p-6 rounded-t-xl shadow-md">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-blue-800 rounded-lg text-white hover:bg-blue-700 transition-colors">
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-3xl font-extrabold flex items-center gap-2"><ShieldCheck size={28} /> Cadastro de Crianças</h1>
      </header>

      <main className="max-w-4xl mx-auto bg-white p-8 rounded-b-xl shadow-lg border-2 border-gray-300">
        <form onSubmit={salvarCrianca} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-gray-50 p-6 rounded-xl border-2">
          <input className="p-3 border-2 rounded-lg font-bold" placeholder="Nome da Criança" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <input className="p-3 border-2 rounded-lg font-bold" placeholder="Nome do Responsável" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} required />
          <input className="p-3 border-2 rounded-lg font-bold" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          <input className="p-3 border-2 rounded-lg font-bold" placeholder="Alergia (ou Nenhuma)" value={alergia} onChange={(e) => setAlergia(e.target.value)} />
          <button className="md:col-span-2 bg-blue-800 text-white py-3 rounded-lg font-extrabold flex items-center justify-center gap-2">
            <UserPlus /> Cadastrar Criança
          </button>
        </form>

        <table className="w-full text-left font-bold border-collapse">
          <thead><tr className="bg-gray-900 text-white"><th className="p-3">Nome</th><th className="p-3">Responsável</th><th className="p-3">Ação</th></tr></thead>
          <tbody>
            {lista.map(c => (
              <tr key={c.id} className="border-b-2">
                <td className="p-3">{c.nome_crianca}</td>
                <td className="p-3">{c.responsavel}</td>
                <td className="p-3"><button onClick={() => excluirCrianca(c.id)} className="text-red-600"><Trash2 /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
export default CadastroKids;