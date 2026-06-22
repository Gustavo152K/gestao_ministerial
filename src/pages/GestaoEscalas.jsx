import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowLeft, CalendarDays, Users, Plus, Trash2, Save, Loader2 } from 'lucide-react';

const formatToDatetimeLocal = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().substring(0, 16);
};

const obterVoluntarios = (detalhesRaw) => {
  try {
    if (!detalhesRaw) return [];
    if (typeof detalhesRaw === 'object') return detalhesRaw;
    const parsed = JSON.parse(detalhesRaw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Erro ao parsear detalhes dos voluntários:", err);
    return [];
  }
};

function GestaoEscalas() {
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(window.location.search);
  const escalaId = queryParams.get('id');
  
  const [dataEvento, setDataEvento] = useState('');
  const [ministerio, setMinisterio] = useState('');
  const [voluntarioSelecionado, setVoluntarioSelecionado] = useState('');
  const [listaEscalados, setListaEscalados] = useState([]);
  
  // Estados para os dados dinâmicos do banco
  const [membros, setMembros] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    // Busca os membros cadastrados na nova tabela
    const { data: membrosData } = await supabase.from('membros').select('*, funcoes(nome_funcao)');
    if (membrosData) setMembros(membrosData);

    if (escalaId) {
      const { data: escalaData } = await supabase.from('escalas').select('*').eq('id', escalaId).single();
      if (escalaData) {
        setDataEvento(formatToDatetimeLocal(escalaData.data_escala));
        setMinisterio(escalaData.ministerio_responsavel);
        setListaEscalados(obterVoluntarios(escalaData.detalhes_voluntarios));
      }
    }
    setCarregando(false);
  };

  const handleAdicionarVoluntario = (e) => {
    e.preventDefault();
    if (!voluntarioSelecionado) {
      alert('Selecione um voluntário!');
      return;
    }

    const membro = membros.find(m => m.id.toString() === voluntarioSelecionado);
    if (!membro) {
      alert('Voluntário não encontrado!');
      return;
    }
    
    const novoEscalado = {
      id: Date.now(),
      nome: membro.nome,
      funcao: membro.funcoes?.nome_funcao || 'N/A'
    };

    setListaEscalados([...listaEscalados, novoEscalado]);
    setVoluntarioSelecionado('');
  };

  const handleSalvarEscala = async () => {
    if (!dataEvento || !ministerio || listaEscalados.length === 0) {
      alert('Preencha os campos e adicione voluntários!');
      return;
    }

    const payload = {
      data_escala: dataEvento, 
      ministerio_responsavel: ministerio,
      status: 'Publicada',
      detalhes_voluntarios: JSON.stringify(listaEscalados)
    };

    let error = null;
    if (escalaId) {
      const res = await supabase
        .from('escalas')
        .update([payload])
        .eq('id', escalaId);
      error = res.error;
    } else {
      const res = await supabase
        .from('escalas')
        .insert([payload]);
      error = res.error;
    }

    if (!error) {
      alert(escalaId ? 'Escala atualizada com sucesso!' : 'Escala salva com sucesso!');
      navigate('/dashboard');
    } else {
      console.error(error);
      alert('Erro ao salvar a escala. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <header className="max-w-4xl mx-auto flex items-center gap-4 bg-blue-900 text-white p-6 rounded-t-xl shadow-md">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-blue-800 rounded-lg"><ArrowLeft size={28} /></button>
        <div>
          <h1 className="text-3xl font-extrabold">{escalaId ? 'Edição de Escala Existente' : 'Criação de Nova Escala'}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto bg-white p-8 rounded-b-xl shadow-lg border-2 border-gray-300">
        <section className="mb-10 p-6 bg-gray-50 rounded-xl border-2">
          <h2 className="text-2xl font-extrabold mb-4 flex items-center gap-3"><CalendarDays className="text-blue-800" /> Informações Básicas</h2>
          <div className="grid grid-cols-2 gap-6">
            <input 
              type="datetime-local" 
              className="p-3 border-2 rounded-lg font-bold" 
              value={dataEvento}
              onChange={(e) => setDataEvento(e.target.value)} 
            />
            <select 
              className="p-3 border-2 rounded-lg font-bold" 
              value={ministerio}
              onChange={(e) => setMinisterio(e.target.value)}
            >
              <option value="">Ministério...</option>
              <option value="Louvor">Louvor</option>
              <option value="Kids">Kids</option>
              <option value="Mídia">Mídia</option>
            </select>
          </div>
        </section>

        <section className="mb-10 p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
          <h2 className="text-2xl font-extrabold text-blue-900 mb-4 flex items-center gap-3"><Users className="text-blue-800" /> Adicionar Voluntário</h2>
          {carregando ? <Loader2 key="loading-scales-add" className="animate-spin" /> : (
            <form key="add-volunteer-form" onSubmit={handleAdicionarVoluntario} className="flex gap-4">
              <select className="flex-1 p-3 border-2 rounded-lg font-bold" value={voluntarioSelecionado} onChange={(e) => setVoluntarioSelecionado(e.target.value)}>
                <option value="">Selecione um membro cadastrado...</option>
                {membros.map((m, idx) => <option key={m.id || `member-${idx}`} value={m.id}>{m.nome} ({m.funcoes?.nome_funcao})</option>)}
              </select>
              <button className="bg-blue-800 text-white px-6 py-3 rounded-lg font-extrabold flex items-center gap-2"><Plus /> Add</button>
            </form>
          )}
        </section>

        <section className="mb-10">
          <ul className="space-y-3">
            {listaEscalados.map((item, idx) => (
              <li key={item.id || `escalado-${idx}`} className="flex justify-between items-center p-4 bg-white border-2 rounded-lg shadow-sm">
                <div>
                  <p className="text-xl font-extrabold">{item.nome}</p>
                  <p className="text-sm bg-gray-200 inline-block px-2 rounded font-bold">{item.funcao}</p>
                </div>
                <button onClick={() => setListaEscalados(listaEscalados.filter(i => i.id !== item.id))} className="text-red-600"><Trash2 /></button>
              </li>
            ))}
          </ul>
        </section>

        <button onClick={handleSalvarEscala} className="w-full bg-green-700 text-white font-extrabold text-2xl py-4 rounded-xl shadow-lg">
          <Save className="inline mr-2" /> {escalaId ? 'Atualizar Escala' : 'Salvar Escala'}
        </button>
      </main>
    </div>
  );
}

export default GestaoEscalas;