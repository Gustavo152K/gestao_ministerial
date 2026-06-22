import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { LogIn, Calendar, Loader2, Search, ShieldCheck } from 'lucide-react';

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

function PainelPublico() {
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
        console.error("Erro ao carregar dados públicos:", err);
      } finally {
        setCarregando(false);
      }
    };
    carregarDados();
  }, []);

  const criancasFiltradas = criancas.filter(c =>
    (c.nome_crianca || '').toLowerCase().includes(buscaKids.toLowerCase()) ||
    (c.responsavel || '').toLowerCase().includes(buscaKids.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-blue-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Gestão Ministerial</h1>
            <p className="text-xs font-bold text-blue-200">Painel Público de Escalas e Acompanhamento Infantil</p>
          </div>
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 rounded-lg border-2 border-blue-600 transition-colors shadow-md text-sm"
          >
            <LogIn size={18} /> Acessar Sistema
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Visão Geral</h2>
            <p className="text-sm font-bold text-gray-500">Consulte escalas ativas ou crianças presentes na sala</p>
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
              Espaço Kids (Visão dos Pais)
            </button>
          </div>
        </div>

        {carregando ? (
          <div key="loading-public" className="flex items-center gap-2 font-bold justify-center py-12">
            <Loader2 className="animate-spin text-blue-800" size={28} /> 
            <span className="text-lg text-gray-700">Carregando painel público...</span>
          </div>
        ) : activeTab === 'escalas' ? (
          /* ABA DE ESCALAS (PÚBLICA) */
          <div key="public-scales-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {escalas.map((escala, idx) => {
              const listaVoluntarios = obterVoluntarios(escala.detalhes_voluntarios);
              return (
                <div key={escala.id || `escala-${idx}`} className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-600 flex flex-col justify-between border-2 border-gray-300">
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900 mb-1">{escala.ministerio_responsavel}</h3>
                    <p className="text-sm font-bold text-gray-600 mb-4">{formatarData(escala.data_escala)}</p>
                    
                    {listaVoluntarios.length > 0 ? (
                      <div className="space-y-2 mt-4">
                        <p className="text-xs font-black text-gray-500 uppercase tracking-wider">Voluntários Escalados</p>
                        <div className="flex flex-wrap gap-2">
                          {listaVoluntarios.map((vol, vIdx) => (
                            <span key={vol.id || `vol-${vIdx}`} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border-2 border-blue-200">
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
          /* ABA DO ESPAÇO KIDS (PÚBLICA - COM PRIVACIDADE EXTREMA) */
          <div key="public-kids-tab" className="space-y-6">
            {/* Resumo e Busca */}
            <div className="bg-white border-2 border-gray-300 p-6 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-sm font-black text-blue-800 uppercase tracking-wider">Sala Infantil</span>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
                  Crianças na Sala: <span className="text-green-600">{criancas.length}</span>
                </h2>
              </div>
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Buscar pelo nome da criança ou pai..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-400 rounded-lg font-bold placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-600"
                  value={buscaKids}
                  onChange={(e) => setBuscaKids(e.target.value)}
                />
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-600">
                  <Search size={20} />
                </span>
              </div>
            </div>

            {/* Lista de Crianças (Informações Protegidas) */}
            {criancasFiltradas.length > 0 ? (
              <div key="public-kids-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {criancasFiltradas.map((c, idx) => (
                  <div key={c.id || `child-${idx}`} className="bg-white border-2 border-gray-300 p-6 rounded-xl shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <h3 className="text-2xl font-extrabold text-gray-900 leading-tight">{c.nome_crianca}</h3>
                        <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-black uppercase bg-green-100 text-green-800 border border-green-300">
                          Na Sala
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-base">
                        <p className="font-semibold text-gray-800">
                          <span className="font-bold text-gray-500">Pai/Responsável:</span> {c.responsavel}
                        </p>
                        <p className="font-semibold text-gray-800">
                          <span className="font-bold text-gray-500">Entrada:</span> {c.hora_entrada || 'Não informada'}
                        </p>
                      </div>

                      {/* AVISO IMPORTANTE: Telefones de contato e Alergias NÃO são exibidos na página pública para proteger a privacidade das crianças e cumprir regras de segurança. */}
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

export default PainelPublico;
