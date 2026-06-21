import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function ProtectedRoute({ children }) {
  const [sessao, setSessao] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Verifica se existe uma sessão ativa no momento em que a rota é acessada
    const verificarSessao = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Erro ao carregar sessão no Supabase:", error);
          setSessao(null);
        } else {
          setSessao(data?.session || null);
        }
      } catch (err) {
        console.error("Erro crítico ao obter sessão:", err);
        setSessao(null);
      } finally {
        setCarregando(false);
      }
    };

    verificarSessao();

    // Cria um ouvinte para caso o usuário faça logout ou a sessão expire
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSessao(session);
      }
    );

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Tela de transição com alto contraste garantido
  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 border-4 border-blue-800 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Aguarde...</h2>
          <p className="text-lg font-bold text-gray-800">
            Verificando permissões de acesso ao sistema ministerial.
          </p>
        </div>
      </div>
    );
  }

  // Se não houver sessão válida, expulsa de volta para a tela de Login
  if (!sessao) {
    return <Navigate to="/" replace />;
  }

  // Se estiver tudo certo, renderiza a tela solicitada (como o Dashboard)
  return children;
}

export default ProtectedRoute;