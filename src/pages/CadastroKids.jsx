import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Plus, Trash2, UserPlus, ShieldCheck, ArrowLeft, Edit } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

function CadastroKids() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [telefone, setTelefone] = useState('');
  const [alergia, setAlergia] = useState('Nenhuma');
  const [lista, setLista] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // State for Custom Confirm Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [kidToDelete, setKidToDelete] = useState(null);

  useEffect(() => {
    carregarCriancas();
  }, []);

  const carregarCriancas = async () => {
    const { data } = await supabase.from('kids_checkin').select('*').order('nome_crianca', { ascending: true });
    setLista(data || []);
  };

  const salvarCrianca = async (e) => {
    e.preventDefault();
    
    const payload = { 
      nome_crianca: nome, 
      responsavel, 
      telefone: telefone || null, 
      alergia: alergia || 'Nenhuma' 
    };

    if (editingId) {
      const { error } = await supabase
        .from('kids_checkin')
        .update(payload)
        .eq('id', editingId);

      if (error) {
        alert("Erro ao atualizar: " + error.message);
      } else {
        setNome('');
        setResponsavel('');
        setTelefone('');
        setAlergia('Nenhuma');
        setEditingId(null);
        carregarCriancas();
        alert("Cadastro da criança atualizado!");
      }
    } else {
      const { error } = await supabase.from('kids_checkin').insert([
        { ...payload, status: 'Pendente' }
      ]);
      
      if (error) {
        alert("Erro ao cadastrar: " + error.message);
      } else {
        setNome('');
        setResponsavel('');
        setTelefone('');
        setAlergia('Nenhuma');
        carregarCriancas();
        alert("Criança cadastrada com sucesso!");
      }
    }
  };

  const iniciarExclusao = (id, nomeCrianca) => {
    setKidToDelete({ id, nomeCrianca });
    setModalOpen(true);
  };

  const confirmarExclusao = async () => {
    if (!kidToDelete) return;
    const { id } = kidToDelete;
    
    try {
      const { error } = await supabase.from('kids_checkin').delete().eq('id', id);
      if (error) {
        alert("Erro ao excluir: " + error.message);
      } else {
        carregarCriancas();
      }
    } catch (err) {
      console.error("Erro crítico ao excluir:", err);
    } finally {
      setModalOpen(false);
      setKidToDelete(null);
    }
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
          <div className="flex flex-col">
            <label className="text-gray-700 font-bold mb-1 text-sm">Nome da Criança</label>
            <input className="p-3 border-2 rounded-lg font-bold" placeholder="Nome da Criança" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-bold mb-1 text-sm">Nome do Responsável</label>
            <input className="p-3 border-2 rounded-lg font-bold" placeholder="Nome do Responsável" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} required />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-bold mb-1 text-sm">Telefone de Contato</label>
            <input className="p-3 border-2 rounded-lg font-bold" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-bold mb-1 text-sm">Alergias / Recomendações</label>
            <input className="p-3 border-2 rounded-lg font-bold" placeholder="Alergia (ou Nenhuma)" value={alergia} onChange={(e) => setAlergia(e.target.value)} />
          </div>

          <div className="md:col-span-2 flex gap-2 mt-2">
            <button type="submit" className="flex-1 bg-blue-800 text-white py-3 rounded-lg font-extrabold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors">
              <UserPlus size={18} /> {editingId ? 'Atualizar Criança' : 'Cadastrar Criança'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => { setNome(''); setResponsavel(''); setTelefone(''); setAlergia('Nenhuma'); setEditingId(null); }}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-extrabold hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="overflow-x-auto border-2 border-gray-300 rounded-xl shadow-sm">
          <table className="w-full text-left font-bold border-collapse">
            <thead>
              <tr className="bg-gray-900 text-white text-sm">
                <th className="p-4">Criança</th>
                <th className="p-4">Responsável</th>
                <th className="p-4">Telefone</th>
                <th className="p-4">Alergias</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.map(c => (
                <tr key={c.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors text-base text-gray-900">
                  <td className="p-4">{c.nome_crianca}</td>
                  <td className="p-4">{c.responsavel}</td>
                  <td className="p-4 text-gray-600 text-sm">{c.telefone || 'N/A'}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 rounded text-xs font-black uppercase border ${
                      c.alergia && c.alergia !== 'Nenhuma' 
                        ? 'bg-red-100 text-red-800 border-red-300' 
                        : 'bg-gray-100 text-gray-800 border-gray-300'
                    }`}>
                      {c.alergia || 'Nenhuma'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => { setNome(c.nome_crianca); setResponsavel(c.responsavel); setTelefone(c.telefone || ''); setAlergia(c.alergia || 'Nenhuma'); setEditingId(c.id); }}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        title="Editar Cadastro"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => iniciarExclusao(c.id, c.nome_crianca)} 
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        title="Excluir Cadastro"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setKidToDelete(null); }}
        onConfirm={confirmarExclusao}
        title="Excluir Criança"
        message={kidToDelete ? `Deseja realmente excluir permanentemente o cadastro de "${kidToDelete.nomeCrianca}"?` : ''}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}

export default CadastroKids;