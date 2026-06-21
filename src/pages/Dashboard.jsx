import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { LogOut, Calendar, Users, FolderOpen, ShieldCheck, FileText, Home, UserPlus, Tag, UserCheck, Loader2, Search, Edit, Trash2 } from 'lucide-react';

const formatarData = (dataStr) => {
  if (!dataStr) return 'Data não definida';
  const data = new Date(dataStr);
  return isNaN(data.getTime()) ? 'Data inválida' : data.toLocaleDateString('pt-BR');
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

function Dashboard() {
  const navigate = useNavigate();
  const [escalas, setEscalas] = useState([]);
  const [criancas, setCriancas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [activeTab, setActiveTab] = useState('escalas');
  const [buscaKids, setBuscaKids] = useState('');

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [escalasRes, kidsRes] = await Promise.all([
          supabase.from('escalas').select('*').order('data_escala', { ascending: true }),
          supabase.from('kids_checkin').select('*').eq('status', 'Check-in Realizado')
        ]);
        
        if (escalasRes.data) setEscalas(escalasRes.data);
        if (kidsRes.data) setCriancas(kidsRes.data);
      } catch (err) {
        console.error("Erro ao carregar dados do Dashboard:", err);
      } finally {
        setCarregando(false);
      }
    };
    carregarDados();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleExcluirEscala = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta escala?")) {
      try {
        const { error } = await supabase.from('escalas').delete().eq('id', id);
        if (error) throw error;
        setEscalas(escalas.filter(e => e.id !== id));
      } catch (err) {
        console.error("Erro ao excluir escala:", err);
        alert("Erro ao excluir escala. Tente novamente.");
      }
    }
  };

  const criancasFiltradas = criancas.filter(c =>
    (c.nome_crianca || '').toLowerCase().includes(buscaKids.toLowerCase()) ||
    (c.responsavel || '').toLowerCase().includes(buscaKids.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-extrabold text-white">Gestão Ministerial</h2>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-4">
          <p className="text-xs font-black text-gray-500 uppercase px-4">Principal</p>
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 rounded font-bold"><Home size={18} /> Dashboard</Link>
          <Link to="/escalas" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 rounded font-bold"><Calendar size={18} /> Escalas</Link>
          <Link to="/repositorio" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 rounded font-bold"><FolderOpen size={18} /> Mídias</Link>
          <Link to="/kids" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded font-bold text-sm"><ShieldCheck size={18} /> Check-in Kids</Link>
          <Link to="/cadastro-kids" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded font-bold text-sm"><UserCheck size={18} /> Cadastrar Crianças</Link>
          
          <p className="text-xs font-black text-gray-500 uppercase px-4 pt-4">Cadastros</p>
          <Link to="/membros" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 rounded font-bold"><UserPlus size={18} /> Membros</Link>
          <Link to="/funcoes" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 rounded font-bold"><Tag size={18} /> Funções</Link>
        </nav>
        <button onClick={handleLogout} className="m-4 bg-red-700 py-3 rounded font-bold text-white">Sair</button>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Visão Geral</h1>
            <p className="text-sm font-bold text-gray-500">Gestão ministerial e acompanhamento infantil</p>
          </div>
          
          {/* Seletor de Abas */}
          <div className="flex bg-gray-200 p-1.5 rounded-xl border border-gray-300">
            <button
              onClick={() => setActiveTab('escalas')}
              className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${
                activeTab === 'escalas'
                  ? 'bg-blue-800 text-white shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Escalas de Louvor/Mídia
            </button>
            <button
              onClick={() => setActiveTab('kids')}
              className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${
                activeTab === 'kids'
                  ? 'bg-blue-800 text-white shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Espaço Kids (Painel dos Pais)
            </button>
          </div>
        </div>

        {carregando ? (
          <div className="flex items-center gap-2 font-bold"><Loader2 className="animate-spin text-blue-800" /> Carregando...</div>
        ) : activeTab === 'escalas' ? (
          /* ABA DE ESCALAS */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {escalas.map((escala) => {
              const listaVoluntarios = obterVoluntarios(escala.detalhes_voluntarios);
              return (
                <div key={escala.id} className="bg-white p-5 rounded shadow border-l-4 border-blue-600 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div>
                        <h3 className="text-lg font-extrabold text-gray-900">{escala.ministerio_responsavel}</h3>
                        <p className="text-sm font-bold text-gray-600">{formatarData(escala.data_escala)}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => navigate(`/escalas?id=${escala.id}`)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                          title="Editar Escala"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleExcluirEscala(escala.id)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          title="Excluir Escala"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    {listaVoluntarios.length > 0 ? (
                      <div className="space-y-2 mt-4">
                        <p className="text-xs font-black text-gray-500 uppercase tracking-wider">Voluntários Escalados</p>
                        <div className="flex flex-wrap gap-2">
                          {listaVoluntarios.map((vol) => (
                            <span key={vol.id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border-2 border-blue-200">
                              {vol.nome} <span className="text-gray-500 font-normal">({vol.funcao})</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs font-bold text-red-600 mt-4">Nenhum voluntário escalado</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ABA DO ESPAÇO KIDS (PAINEL DOS PAIS) */
          <div className="space-y-6">
            {/* Resumo e Busca */}
            <div className="bg-white border-2 border-gray-300 p-6 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-sm font-black text-blue-800 uppercase tracking-wider">Status da Sala</span>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
                  Crianças na Sala: <span className="text-green-600">{criancas.length}</span>
                </h2>
              </div>
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Buscar pelo nome da criança ou pai/mãe..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-400 rounded-lg font-bold placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-600"
                  value={buscaKids}
                  onChange={(e) => setBuscaKids(e.target.value)}
                />
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-600">
                  <Search size={20} />
                </span>
              </div>
            </div>

            {/* Lista de Crianças */}
            {criancasFiltradas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {criancasFiltradas.map((c) => (
                  <div key={c.id} className="bg-white border-2 border-gray-300 p-6 rounded-xl shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <h3 className="text-2xl font-extrabold text-gray-900 leading-tight">{c.nome_crianca}</h3>
                        <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-black uppercase bg-green-100 text-green-800 border border-green-300">
                          Na Sala
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-base">
                        <p className="font-semibold text-gray-800">
                          <span className="font-bold text-gray-500">Pai/Mãe:</span> {c.responsavel}
                        </p>
                        {c.telefone && (
                          <p className="font-semibold text-gray-800">
                            <span className="font-bold text-gray-500">Contato:</span> {c.telefone}
                          </p>
                        )}
                        <p className="font-semibold text-gray-800">
                          <span className="font-bold text-gray-500">Entrada:</span> {c.hora_entrada || 'Não informada'}
                        </p>
                      </div>

                      {c.alergia && c.alergia !== 'Nenhuma' && (
                        <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-600 rounded">
                          <p className="text-red-900 font-extrabold text-sm uppercase tracking-wide">Atenção Médica / Alergia</p>
                          <p className="text-red-800 font-bold text-sm mt-0.5">{c.alergia}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border-2 border-gray-300 p-12 rounded-xl text-center shadow-sm">
                <h3 className="text-2xl font-extrabold text-gray-800 mb-2">Nenhuma criança encontrada</h3>
                <p className="text-lg text-gray-600 font-medium">
                  {buscaKids.trim() !== ''
                    ? 'Tente ajustar sua busca ou verifique o nome digitado.'
                    : 'A sala infantil está vazia no momento (nenhum check-in realizado).'}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;