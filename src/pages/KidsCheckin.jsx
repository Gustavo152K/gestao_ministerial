import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Search, UserCheck, ArrowLeft, Clock, AlertTriangle, Loader2 } from 'lucide-react';

function KidsCheckin() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [criancas, setCriancas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Busca as crianças no banco ao abrir a tela
  useEffect(() => {
    const buscarCriancas = async () => {
      const { data, error } = await supabase.from('kids_checkin').select('*');
      if (error) console.error("Erro ao buscar crianças:", error);
      else setCriancas(data || []);
      setCarregando(false);
    };
    buscarCriancas();
  }, []);

  // Função para realizar o check-in no banco de dados
  const handleCheckin = async (id) => {
    const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const { error } = await supabase
      .from('kids_checkin')
      .update({ status: 'Check-in Realizado', hora_entrada: horaAtual })
      .eq('id', id);

    if (error) {
      alert("Erro ao realizar check-in");
    } else {
      // Atualiza a lista local para refletir a mudança sem recarregar a página
      setCriancas(criancas.map(c => 
        c.id === id ? { ...c, status: 'Check-in Realizado', hora_entrada: horaAtual } : c
      ));
    }
  };

  const criancasFiltradas = criancas.filter(c => 
    (c.nome_crianca || '').toLowerCase().includes(busca.toLowerCase()) || 
    (c.responsavel || '').toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <header className="max-w-2xl mx-auto flex items-center gap-4 bg-blue-800 text-white p-4 rounded-t-xl shadow-md">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-blue-900 hover:bg-blue-700 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-extrabold tracking-wide">Módulo Kids - Check-in</h1>
      </header>

      <main className="max-w-2xl mx-auto bg-white p-6 rounded-b-xl shadow-lg border-2 border-gray-300">
        <div className="mb-8">
          <input
            type="text"
            className="w-full p-4 border-4 border-gray-400 rounded-lg text-lg font-bold placeholder-gray-600 focus:ring-4 focus:ring-blue-600"
            placeholder="Buscar Nome da Criança ou Responsável..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {carregando ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-800" size={40}/></div>
        ) : (
          <div className="space-y-6">
            {criancasFiltradas.map((crianca) => (
              <div key={crianca.id} className="p-5 border-2 border-gray-400 rounded-xl bg-gray-50 shadow-sm">
                <h2 className="text-2xl font-extrabold text-gray-900">{crianca.nome_crianca}</h2>
                <p className="text-lg text-gray-800 font-semibold">Pai/Mãe: {crianca.responsavel} | Tel: {crianca.telefone}</p>
                
                {crianca.alergia !== 'Nenhuma' && (
                  <div className="flex items-center gap-2 bg-red-100 border-l-8 border-red-600 p-3 mt-3">
                    <AlertTriangle className="text-red-800" size={24} />
                    <p className="text-red-900 font-bold text-lg">Alergia: {crianca.alergia}</p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t-2 border-gray-300">
                  {crianca.status === 'Pendente' ? (
                    <button 
                      onClick={() => handleCheckin(crianca.id)}
                      className="w-full bg-green-700 hover:bg-green-800 text-white font-extrabold text-lg py-3 rounded-lg shadow-md transition-colors"
                    >
                      <UserCheck className="inline mr-2" /> Confirmar Entrada
                    </button>
                  ) : (
                    <div className="text-center text-green-900 bg-green-200 py-3 rounded-lg border-2 border-green-600 font-bold text-lg">
                      <Clock className="inline mr-2" /> Check-in realizado às {crianca.hora_entrada}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default KidsCheckin;