import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowLeft, Trash2, Eye, X, Upload } from 'lucide-react';

function RepositorioMidias() {
  const navigate = useNavigate();
  const [materiais, setMateriais] = useState([]);
  const [materialSelecionado, setMaterialSelecionado] = useState(null);

  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('Texto/Cifra');
  const [ministerio, setMinisterio] = useState('Ministério de Louvor');
  const [conteudo, setConteudo] = useState('');

  useEffect(() => {
    carregarMateriais();
  }, []);

  const carregarMateriais = async () => {
    // Busca na tabela sem acentos
    const { data, error } = await supabase
      .from('repositorio_midias')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error("Erro ao carregar:", error);
    } else {
      setMateriais(data || []);
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!titulo || !conteudo || !ministerio) {
      alert("Preencha todos os campos!");
      return;
    }

    // Inserção na tabela sem acentos e coluna de data padronizada
    const { error } = await supabase
      .from('repositorio_midias')
      .insert([{
        titulo,
        tipo,
        ministerio,
        conteudo,
        data_upload: new Date().toLocaleDateString('pt-BR')
      }]);

    if (error) {
      alert("Erro ao salvar: " + error.message);
    } else {
      setTitulo('');
      setConteudo('');
      setMinisterio('Ministério de Louvor');
      await carregarMateriais();
      alert("Material enviado com sucesso!");
    }
  };

  const handleExcluir = async (id) => {
    if (confirm("Deseja realmente excluir este material?")) {
      const { error } = await supabase.from('repositorio_midias').delete().eq('id', id);
      if (error) {
        alert("Erro ao excluir: " + error.message);
      } else {
        await carregarMateriais();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="max-w-5xl mx-auto flex items-center gap-4 bg-gray-900 text-white p-6 rounded-t-xl shadow-md">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-3xl font-extrabold">Repositório de Mídias</h1>
      </header>

      <main className="max-w-5xl mx-auto bg-white p-8 rounded-b-xl shadow-lg border-2 border-gray-300">
        <form onSubmit={handleSalvar} className="bg-blue-50 p-6 rounded-lg mb-8 border-2 border-blue-200">
          <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2 text-blue-900"><Upload /> Nova Mídia</h2>
          <div className="grid grid-cols-1 gap-4">
            <input
              className="p-3 border-2 border-gray-400 rounded-lg font-bold"
              placeholder="Título"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                className="p-3 border-2 border-gray-400 rounded-lg font-bold"
                value={tipo}
                onChange={e => setTipo(e.target.value)}
              >
                <option>Texto/Cifra</option>
                <option>Link YouTube</option>
              </select>
              <select
                className="p-3 border-2 border-gray-400 rounded-lg font-bold"
                value={ministerio}
                onChange={e => setMinisterio(e.target.value)}
              >
                <option value="Ministério de Louvor">Ministério de Louvor</option>
                <option value="Mídia e Comunicação">Mídia e Comunicação</option>
                <option value="Ministério Kids">Ministério Kids</option>
              </select>
            </div>
            <textarea
              className="p-3 border-2 border-gray-400 rounded-lg font-bold h-32"
              placeholder="Cole aqui a cifra, letra ou o link do YouTube..."
              value={conteudo}
              onChange={e => setConteudo(e.target.value)}
              required
            />
            <button className="bg-blue-800 text-white py-3 rounded-lg font-extrabold hover:bg-blue-900 transition-colors">
              Salvar no Repositório
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {materiais.map((item) => (
            <div key={item.id} className="border-2 border-gray-300 p-4 rounded-lg shadow-sm bg-white">
              <h3 className="font-extrabold text-lg text-gray-900">{item.titulo}</h3>
              <p className="text-sm font-bold text-gray-500">{item.ministerio}</p>
              <p className="text-xs font-bold text-blue-600 mb-4">{item.tipo}</p>
              <div className="flex gap-2">
                <button onClick={() => setMaterialSelecionado(item)} className="flex-1 p-2 bg-blue-100 text-blue-800 font-bold rounded flex items-center justify-center gap-2">
                  <Eye size={18} /> Visualizar
                </button>
                <button onClick={() => handleExcluir(item.id)} className="p-2 bg-red-100 text-red-800 font-bold rounded">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {materialSelecionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold">{materialSelecionado.titulo}</h2>
              <button onClick={() => setMaterialSelecionado(null)} className="p-2 hover:bg-gray-200 rounded-full"><X size={28} /></button>
            </div>

            {materialSelecionado.tipo === 'Link YouTube' ? (
              <a href={materialSelecionado.conteudo} target="_blank" rel="noreferrer" className="text-blue-700 font-bold underline text-lg">
                Abrir Vídeo no YouTube
              </a>
            ) : (
              <pre className="bg-gray-100 p-4 rounded font-mono text-sm whitespace-pre-wrap border border-gray-300 text-gray-800">
                {materialSelecionado.conteudo}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RepositorioMidias;