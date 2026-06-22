import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha,
      });

      if (error) {
        throw error;
      }

      setMensagem('Login realizado com sucesso! Redirecionando...');
      
      // Redireciona para o Dashboard após 1 segundo
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (error) {
      setMensagem('Erro ao fazer login: verifique suas credenciais.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border-2 border-gray-300">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Gestão Ministerial
          </h1>
          <p className="text-lg text-gray-800 font-medium">
            Faça login para acessar a plataforma
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-900 font-bold mb-2 text-lg" htmlFor="email">
              E-mail de Acesso
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-6 w-6 text-gray-800" />
              </div>
              <input
                id="email"
                type="email"
                required
                className="block w-full pl-12 pr-3 py-3 border-2 border-gray-400 rounded-md text-gray-900 font-medium placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-600 focus:border-blue-700 bg-gray-50"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-900 font-bold mb-2 text-lg" htmlFor="senha">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-6 w-6 text-gray-800" />
              </div>
              <input
                id="senha"
                type={mostrarSenha ? 'text' : 'password'}
                required
                className="block w-full pl-12 pr-10 py-3 border-2 border-gray-400 rounded-md text-gray-900 font-medium placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-600 focus:border-blue-700 bg-gray-50"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-800 hover:text-gray-600 focus:outline-none"
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                {mostrarSenha ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {mensagem && (
            <div className={`p-4 rounded-md font-bold text-center border-2 ${mensagem.includes('Erro') ? 'bg-red-100 text-red-900 border-red-500' : 'bg-green-100 text-green-900 border-green-500'}`}>
              {mensagem}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-xl font-bold text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => navigate('/publico')}
              className="text-blue-800 hover:text-blue-900 font-extrabold text-base transition-colors hover:underline"
            >
              Visualizar escalas sem login (Painel Público)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;