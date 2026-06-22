import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Search, UserCheck, ArrowLeft, Clock, AlertTriangle, Loader2, LogOut, CheckCircle } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

function KidsCheckin() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [criancas, setCriancas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  
  // Abas de visualização: 'pendentes', 'presentes', 'finalizados'
  const [activeSubTab, setActiveSubTab] = useState('pendentes');

  // State for Custom Confirm Modal (Checkout)
  const [modalOpen, setModalOpen] = useState(false);
  const [checkoutKid, setCheckoutKid] = useState(null);

  // Busca as crianças no banco ao abrir a tela
  useEffect(() => {
    buscarCriancas();
  }, []);

  const buscarCriancas = async () => {
    setCarregando(true);
    const { data, error } = await supabase.from('kids_checkin').select('*').order('nome_crianca', { ascending: true });
    if (error) console.error("Erro ao buscar crianças:", error);
    else setCriancas(data || []);
    setCarregando(false);
  };

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
      // Atualiza a lista local para refletir a mudança
      setCriancas(criancas.map(c => 
        c.id === id ? { ...c, status: 'Check-in Realizado', hora_entrada: horaAtual } : c
      ));
    }
  };

  const iniciarCheckout = (kid) => {
    setCheckoutKid(kid);
    setModalOpen(true);
  };

  const confirmarCheckout = async () => {
    if (!checkoutKid) return;
    const { id } = checkoutKid;
    const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    try {
      // 1. Salvar no histórico
      const { error: histError } = await supabase
        .from('kids_historico')
        .insert([{
          nome_crianca: checkoutKid.nome_crianca,
          responsavel: checkoutKid.responsavel,
          telefone: checkoutKid.telefone || null,
          alergia: checkoutKid.alergia || 'Nenhuma',
          hora_entrada: checkoutKid.hora_entrada,
          hora_saida: horaAtual
        }]);

      if (histError) {
        console.error("Erro ao salvar histórico:", histError);
      }

      // 2. Atualizar status na tabela principal para Pendente imediatamente (reentrabilidade automática)
      const { error } = await supabase
        .from('kids_checkin')
        .update({ status: 'Pendente', hora_entrada: null, hora_saida: null })
        .eq('id', id);

      if (error) {
        alert("Erro ao realizar check-out: " + error.message);
      } else {
        // Atualiza a lista local: a criança volta para Pendente e zera os horários ativos
        setCriancas(criancas.map(c => 
          c.id === id ? { ...c, status: 'Pendente', hora_entrada: null, hora_saida: null } : c
        ));
      }
    } catch (err) {
      console.error("Erro crítico ao confirmar checkout:", err);
    } finally {
      setModalOpen(false);
      setCheckoutKid(null);
    }
  };



  // Filtra as crianças de acordo com a aba de status ativa e a busca textual
  const criancasPorAba = criancas.filter(c => {
    if (activeSubTab === 'pendentes') return c.status === 'Pendente' || !c.status;
    if (activeSubTab === 'presentes') return c.status === 'Check-in Realizado';
    return true;
  });

  const criancasFiltradas = criancasPorAba.filter(c => 
    (c.nome_crianca || '').toLowerCase().includes(busca.toLowerCase()) || 
    (c.responsavel || '').toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <header className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-blue-900 text-white p-6 rounded-t-xl shadow-md">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 bg-blue-800 hover:bg-blue-700 rounded-lg text-white transition-colors">
            <ArrowLeft size={28} />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-wide">Módulo Kids</h1>
            <p className="text-sm text-blue-200 font-bold mt-0.5">Entrada e Saída de Crianças</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto bg-white p-8 rounded-b-xl shadow-lg border-2 border-gray-300 space-y-6">
        
        {/* Seletor de Sub-Abas */}
        <div className="flex bg-gray-200 p-1.5 rounded-xl border border-gray-300">
          <button
            onClick={() => setActiveSubTab('pendentes')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${
              activeSubTab === 'pendentes'
                ? 'bg-blue-800 text-white shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Check-in Pendente ({criancas.filter(c => c.status === 'Pendente' || !c.status).length})
          </button>
          <button
            onClick={() => setActiveSubTab('presentes')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${
              activeSubTab === 'presentes'
                ? 'bg-green-700 text-white shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Presentes na Sala ({criancas.filter(c => c.status === 'Check-in Realizado').length})
          </button>
        </div>

        {/* Input de Busca */}
        <div>
          <input
            type="text"
            className="w-full p-4 border-2 border-gray-400 rounded-lg text-lg font-bold placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-600"
            placeholder="Buscar Nome da Criança ou Responsável..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {carregando ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-800" size={40}/></div>
        ) : (
          <div className="space-y-4">
            {criancasFiltradas.length > 0 ? (
              criancasFiltradas.map((crianca) => (
                <div key={crianca.id} className="p-6 border-2 border-gray-300 rounded-xl bg-gray-50 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">{crianca.nome_crianca}</h2>
                      <span className={`px-2.5 py-1 rounded text-xs font-black uppercase border ${
                        crianca.status === 'Check-in Realizado'
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : crianca.status === 'Finalizado'
                            ? 'bg-gray-200 text-gray-800 border-gray-450'
                            : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                      }`}>
                        {crianca.status === 'Check-in Realizado'
                          ? 'Presente'
                          : crianca.status === 'Finalizado'
                            ? 'Liberado'
                            : 'Pendente'}
                      </span>
                    </div>
                    
                    <p className="text-base text-gray-800 font-semibold mb-3">
                      <span className="font-bold text-gray-500">Responsável:</span> {crianca.responsavel} 
                      {crianca.telefone && <> | <span className="font-bold text-gray-500">Tel:</span> {crianca.telefone}</>}
                    </p>
                    
                    {crianca.alergia && crianca.alergia !== 'Nenhuma' && (
                      <div className="flex items-center gap-2 bg-red-50 border-l-4 border-red-600 p-3 rounded mb-4">
                        <AlertTriangle className="text-red-800 shrink-0" size={20} />
                        <p className="text-red-900 font-extrabold text-sm uppercase tracking-wide">Atenção Médica: {crianca.alergia}</p>
                      </div>
                    )}
                  </div>

                  {/* Ações baseadas no Status da Criança */}
                  <div className="border-t border-gray-200 pt-4 mt-2">
                    {crianca.status === 'Pendente' || !crianca.status ? (
                      <button 
                        onClick={() => handleCheckin(crianca.id)}
                        className="w-full bg-green-700 hover:bg-green-800 text-white font-extrabold text-lg py-3 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <UserCheck size={20} /> Confirmar Entrada (Check-in)
                      </button>
                    ) : crianca.status === 'Check-in Realizado' ? (
                      <button 
                        onClick={() => iniciarCheckout(crianca)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-lg py-3 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <LogOut size={20} /> Confirmar Saída (Check-out)
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-4 bg-gray-100 text-gray-700 py-3 rounded-lg border border-gray-300 font-bold text-base">
                        <span className="flex items-center gap-1.5"><Clock size={16} /> Entrada: {crianca.hora_entrada}</span>
                        <span className="text-gray-400">|</span>
                        <span className="flex items-center gap-1.5 text-red-700"><CheckCircle size={16} /> Saída: {crianca.hora_saida}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center border-2 border-dashed border-gray-300 rounded-xl">
                <p className="text-lg text-gray-500 font-bold">Nenhuma criança encontrada nesta aba.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal para Check-out Individual */}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setCheckoutKid(null); }}
        onConfirm={confirmarCheckout}
        title="Confirmar Saída"
        message={checkoutKid ? `Deseja realmente confirmar a saída de "${checkoutKid.nome_crianca}" da sala infantil?` : ''}
        confirmText="Confirmar Saída"
        cancelText="Cancelar"
        variant="info"
      />
    </div>
  );
}

export default KidsCheckin;