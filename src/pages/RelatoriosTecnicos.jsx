import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, Users, CheckCircle, XCircle, Filter, FileText } from 'lucide-react';

function RelatoriosTecnicos() {
  const navigate = useNavigate();

  // Dados extraídos diretamente da sua documentação do TCC (RF01 - Assiduidade)
  const [voluntarios, setVoluntarios] = useState([
    { id: 1, nome: 'Gustavo Henrique', ministerio: 'Louvor (Líder)', escalas: 8, presencas: 8, aproveitamento: '100%' },
    { id: 2, nome: 'Ana Julia Santos', ministerio: 'Kids', escalas: 6, presencas: 5, aproveitamento: '83%' },
    { id: 3, nome: 'Carlos Eduardo Lima', ministerio: 'Mídia', escalas: 4, presencas: 3, aproveitamento: '75%' },
    { id: 4, nome: 'Mariana Costa Ferreira', ministerio: 'Louvor', escalas: 5, presencas: 5, aproveitamento: '100%' },
    { id: 5, nome: 'Lucas de Souza Ramos', ministerio: 'Kids', escalas: 4, presencas: 2, aproveitamento: '50%' },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      
      {/* Cabeçalho */}
      <header className="max-w-6xl mx-auto flex items-center gap-4 bg-gray-900 text-white p-6 rounded-t-xl shadow-md border-b-4 border-blue-600">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-400"
          aria-label="Voltar para Dashboard"
        >
          <ArrowLeft size={28} className="text-white" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold tracking-wide uppercase">Frequência e Assiduidade de Voluntários</h1>
          <p className="text-lg font-bold text-gray-300 mt-1">Período: 01/05/2026 a 31/05/2026 | Emitido por: Gustavo Henrique</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto bg-white p-8 rounded-b-xl shadow-lg border-2 border-gray-300">
        
        {/* Barra de Filtros */}
        <div className="flex items-center gap-3 bg-blue-50 border-2 border-blue-800 p-4 rounded-lg mb-8">
          <Filter className="text-blue-900" size={24} />
          <p className="text-lg font-bold text-blue-900">
            Filtros Aplicados: Ministério: Todos | Status da Escala: Concluída | Presença: Confirmada/Falta
          </p>
        </div>

        {/* Cards de Métricas Principais (Alto Contraste) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
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

        {/* Tabela de Detalhamento por Voluntário */}
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

      </main>
    </div>
  );
}

export default RelatoriosTecnicos;