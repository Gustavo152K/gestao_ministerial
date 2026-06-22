import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowLeft, BarChart3, Users, CheckCircle, XCircle, Filter, FileText, Search, Calendar, Loader2 } from 'lucide-react';

function RelatoriosTecnicos() {
  const navigate = useNavigate();

  // Estados de Abas de Relatório: 'voluntarios' ou 'kids'
  const [activeReportTab, setActiveReportTab] = useState('voluntarios');

  // Dados extraídos diretamente do TCC (RF01 - Assiduidade)
  const [voluntarios, setVoluntarios] = useState([
    { id: 1, nome: 'Gustavo Henrique', ministerio: 'Louvor (Líder)', escalas: 8, presencas: 8, aproveitamento: '100%' },
    { id: 2, nome: 'Ana Julia Santos', ministerio: 'Kids', escalas: 6, presencas: 5, aproveitamento: '83%' },
    { id: 3, nome: 'Carlos Eduardo Lima', ministerio: 'Mídia', escalas: 4, presencas: 3, aproveitamento: '75%' },
    { id: 4, nome: 'Mariana Costa Ferreira', ministerio: 'Louvor', escalas: 5, presencas: 5, aproveitamento: '100%' },
    { id: 5, nome: 'Lucas de Souza Ramos', ministerio: 'Kids', escalas: 4, presencas: 2, aproveitamento: '50%' },
  ]);

  // Estados para o Relatório do Espaço Kids (Dados do Banco)
  const [kidsLogs, setKidsLogs] = useState([]);
  const [carregandoKids, setCarregandoKids] = useState(true);
  const [buscaKids, setBuscaKids] = useState('');
  const [filtroData, setFiltroData] = useState(''); // Filtro por data YYYY-MM-DD

  useEffect(() => {
    if (activeReportTab === 'kids') {
      carregarKidsLogs();
    }
  }, [activeReportTab]);

  const carregarKidsLogs = async () => {
    setCarregandoKids(true);
    try {
      const [activeRes, historyRes] = await Promise.all([
        supabase.from('kids_checkin').select('*').eq('status', 'Check-in Realizado'),
        supabase.from('kids_historico').select('*')
      ]);

      if (activeRes.error) throw activeRes.error;
      if (historyRes.error) throw historyRes.error;

      // Combinar dados ativos e históricos em um único painel consolidado
      const activeData = (activeRes.data || []).map(item => ({ ...item }));
      const historyData = (historyRes.data || []).map(item => ({ ...item, status: 'Finalizado' }));

      const combined = [...activeData, ...historyData].sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setKidsLogs(combined);
    } catch (err) {
      console.error("Erro ao carregar relatório infantil:", err);
    } finally {
      setCarregandoKids(false);
    }
  };

  // Filtragem dos logs infantis
  const logsFiltrados = kidsLogs.filter(log => {
    // Filtro por texto (criança ou responsável)
    const matchesTexto = (log.nome_crianca || '').toLowerCase().includes(buscaKids.toLowerCase()) ||
                         (log.responsavel || '').toLowerCase().includes(buscaKids.toLowerCase());
    
    // Filtro por data
    let matchesData = true;
    if (filtroData) {
      const dataLog = new Date(log.created_at).toISOString().split('T')[0];
      matchesData = dataLog === filtroData;
    }

    return matchesTexto && matchesData;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      
      {/* Cabeçalho */}
      <header className="max-w-6xl mx-auto flex items-center justify-between bg-gray-900 text-white p-6 rounded-t-xl shadow-md border-b-4 border-blue-600">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-400"
            aria-label="Voltar para Dashboard"
          >
            <ArrowLeft size={28} className="text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-wide uppercase">Relatórios e Controles</h1>
            <p className="text-sm font-bold text-gray-300 mt-1">Consolidação histórica e métricas do sistema</p>
          </div>
        </div>

        {/* Seletor de Abas de Relatório */}
        <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-700">
          <button
            onClick={() => setActiveReportTab('voluntarios')}
            className={`px-4 py-2 rounded font-bold text-xs uppercase tracking-wider transition-all ${
              activeReportTab === 'voluntarios'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Voluntários
          </button>
          <button
            onClick={() => setActiveReportTab('kids')}
            className={`px-4 py-2 rounded font-bold text-xs uppercase tracking-wider transition-all ${
              activeReportTab === 'kids'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Espaço Kids
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto bg-white p-8 rounded-b-xl shadow-lg border-2 border-gray-300">
        
        {activeReportTab === 'voluntarios' ? (
          /* RELATÓRIO DE VOLUNTÁRIOS */
          <div className="space-y-8">
            <div className="flex items-center gap-3 bg-blue-50 border-2 border-blue-800 p-4 rounded-lg">
              <Filter className="text-blue-900" size={24} />
              <p className="text-lg font-bold text-blue-900">
                Filtros Aplicados: Ministério: Todos | Status da Escala: Concluída | Presença: Confirmada/Falta
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border-4 border-blue-800 rounded-xl p-6 shadow-md flex flex-col items-center text-center">
                <Users className="text-blue-800 mb-2" size={40} />
                <span className="text-5xl font-extrabold text-gray-900">148</span>
                <p className="text-xl font-bold text-gray-700 mt-2 uppercase">Vagas Escaladas</p>
              </div>

              <div className="bg-white border-4 border-green-700 rounded-xl p-6 shadow-md flex flex-col items-center text-center">
                <CheckCircle className="text-green-700 mb-2" size={40} />
                <span className="text-5xl font-extrabold text-gray-900">92%</span>
                <p className="text-xl font-bold text-gray-700 mt-2 uppercase">Taxa de Presença</p>
              </div>

              <div className="bg-white border-4 border-yellow-500 rounded-xl p-6 shadow-md flex flex-col items-center text-center">
                <FileText className="text-yellow-600 mb-2" size={40} />
                <span className="text-5xl font-extrabold text-gray-900">12</span>
                <p className="text-xl font-bold text-gray-700 mt-2 uppercase">Faltas Justificadas</p>
              </div>

              <div className="bg-white border-4 border-red-700 rounded-xl p-6 shadow-md flex flex-col items-center text-center">
                <XCircle className="text-red-700 mb-2" size={40} />
                <span className="text-5xl font-extrabold text-gray-900">3</span>
                <p className="text-xl font-bold text-gray-700 mt-2 uppercase">Faltas S/ Justif.</p>
              </div>
            </div>

            <section>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-3 border-b-2 border-gray-300 pb-2">
                <BarChart3 className="text-blue-800" size={28} /> Detalhamento por Voluntário
              </h2>
              
              <div className="overflow-x-auto border-2 border-gray-400 rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-900 text-white text-lg">
                      <th className="p-4 border-b-2 border-gray-700 font-extrabold uppercase">Voluntário</th>
                      <th className="p-4 border-b-2 border-gray-700 font-extrabold uppercase">Ministério</th>
                      <th className="p-4 border-b-2 border-gray-700 font-extrabold uppercase text-center">Escalas Totais</th>
                      <th className="p-4 border-b-2 border-gray-700 font-extrabold uppercase text-center">Presenças</th>
                      <th className="p-4 border-b-2 border-gray-700 font-extrabold uppercase text-center">Aproveitamento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {voluntarios.map((voluntario, index) => (
                      <tr key={voluntario.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="p-4 border-b border-gray-300 text-lg font-bold text-gray-900">{voluntario.nome}</td>
                        <td className="p-4 border-b border-gray-300 text-lg font-bold text-gray-800">{voluntario.ministerio}</td>
                        <td className="p-4 border-b border-gray-300 text-lg font-extrabold text-gray-900 text-center">{voluntario.escalas}</td>
                        <td className="p-4 border-b border-gray-300 text-lg font-extrabold text-gray-900 text-center">{voluntario.presencas}</td>
                        <td className="p-4 border-b border-gray-300 text-center">
                          <span className={`inline-block px-3 py-1 rounded-md font-extrabold text-lg border-2 ${
                            parseInt(voluntario.aproveitamento) >= 80 
                              ? 'bg-green-100 text-green-900 border-green-600' 
                              : parseInt(voluntario.aproveitamento) >= 60 
                                ? 'bg-yellow-100 text-yellow-900 border-yellow-600'
                                : 'bg-red-100 text-red-900 border-red-600'
                          }`}>
                            {voluntario.aproveitamento}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        ) : (
          /* RELATÓRIO DO ESPAÇO KIDS (DINÂMICO) */
          <div className="space-y-6">
            
            {/* Barra de Filtros e Busca */}
            <div className="bg-gray-50 border-2 border-gray-300 p-6 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="Buscar por criança ou responsável..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-400 rounded-lg font-bold placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-600 text-sm"
                  value={buscaKids}
                  onChange={(e) => setBuscaKids(e.target.value)}
                />
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-600">
                  <Search size={18} />
                </span>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                <Calendar size={20} className="text-gray-600" />
                <input
                  type="date"
                  className="p-3 border-2 border-gray-400 rounded-lg font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-600 text-sm w-full md:w-auto"
                  value={filtroData}
                  onChange={(e) => setFiltroData(e.target.value)}
                />
                {filtroData && (
                  <button 
                    onClick={() => setFiltroData('')}
                    className="text-xs bg-red-100 text-red-900 border border-red-300 px-2.5 py-1.5 rounded font-black hover:bg-red-200"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>

            {carregandoKids ? (
              <div key="loading-kids-history" className="flex items-center justify-center gap-2 font-bold py-12 text-gray-600">
                <Loader2 className="animate-spin text-blue-800" /> Carregando histórico infantil...
              </div>
            ) : (
              <section key="kids-history-section">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-3 border-b-2 border-gray-300 pb-2">
                  <FileText className="text-blue-800" size={28} /> Controle de Dias e Horários - Kids
                </h2>
                
                {logsFiltrados.length > 0 ? (
                  <div key="kids-history-table" className="overflow-x-auto border-2 border-gray-400 rounded-lg">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-900 text-white text-base">
                          <th className="p-4 border-b-2 border-gray-700 font-extrabold uppercase">Data</th>
                          <th className="p-4 border-b-2 border-gray-700 font-extrabold uppercase">Criança</th>
                          <th className="p-4 border-b-2 border-gray-700 font-extrabold uppercase">Responsável / Contato</th>
                          <th className="p-4 border-b-2 border-gray-700 font-extrabold uppercase text-center">Entrada</th>
                          <th className="p-4 border-b-2 border-gray-700 font-extrabold uppercase text-center">Saída</th>
                          <th className="p-4 border-b-2 border-gray-700 font-extrabold uppercase text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logsFiltrados.map((log, index) => {
                          const dataFormatada = new Date(log.created_at).toLocaleDateString('pt-BR');
                          return (
                            <tr key={log.id || `log-${index}`} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                              <td className="p-4 border-b border-gray-300 text-base font-bold text-gray-900">{dataFormatada}</td>
                              <td className="p-4 border-b border-gray-300 text-base font-bold text-gray-900">{log.nome_crianca}</td>
                              <td className="p-4 border-b border-gray-300 text-base text-gray-800 font-semibold">
                                <div>{log.responsavel}</div>
                                {log.telefone && <div className="text-xs text-gray-500 font-bold">{log.telefone}</div>}
                              </td>
                              <td className="p-4 border-b border-gray-300 text-base font-extrabold text-gray-900 text-center">{log.hora_entrada || 'N/A'}</td>
                              <td className="p-4 border-b border-gray-300 text-base font-extrabold text-center">
                                {log.status === 'Check-in Realizado' ? (
                                  <span className="text-green-700 italic font-semibold">Na Sala</span>
                                ) : (
                                  log.hora_saida || 'N/A'
                                )}
                              </td>
                              <td className="p-4 border-b border-gray-300 text-center">
                                <span className={`inline-block px-2.5 py-1 rounded text-xs font-black uppercase border ${
                                  log.status === 'Check-in Realizado'
                                    ? 'bg-green-100 text-green-800 border-green-300'
                                    : log.status === 'Finalizado'
                                      ? 'bg-gray-200 text-gray-800 border-gray-400'
                                      : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                }`}>
                                  {log.status === 'Check-in Realizado' ? 'Presente' : log.status === 'Finalizado' ? 'Liberado' : 'Pendente'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center border-2 border-dashed border-gray-300 rounded-xl">
                    <p className="text-lg text-gray-500 font-bold">Nenhum registro encontrado com os filtros selecionados.</p>
                  </div>
                )}
              </section>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

export default RelatoriosTecnicos;