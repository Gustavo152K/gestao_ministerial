import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import KidsCheckin from './pages/KidsCheckin';
import CadastroKids from './pages/CadastroKids';
import GestaoEscalas from './pages/GestaoEscalas';
import RepositorioMidias from './pages/RepositorioMidias';
import RelatoriosTecnicos from './pages/RelatoriosTecnicos';
import CadastroFuncoes from './pages/CadastroFuncoes';
import CadastroMembros from './pages/CadastroMembros';
import CadastroUsuarios from './pages/CadastroUsuarios';
import PainelPublico from './pages/PainelPublico';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/publico" element={<PainelPublico />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/kids" element={<ProtectedRoute><KidsCheckin /></ProtectedRoute>} />
        <Route path="/cadastro-kids" element={<ProtectedRoute><CadastroKids /></ProtectedRoute>} />
        <Route path="/escalas" element={<ProtectedRoute><GestaoEscalas /></ProtectedRoute>} />
        <Route path="/repositorio" element={<ProtectedRoute><RepositorioMidias /></ProtectedRoute>} />
        <Route path="/relatorios" element={<ProtectedRoute><RelatoriosTecnicos /></ProtectedRoute>} />
        <Route path="/funcoes" element={<ProtectedRoute><CadastroFuncoes /></ProtectedRoute>} />
        <Route path="/membros" element={<ProtectedRoute><CadastroMembros /></ProtectedRoute>} />
        <Route path="/cadastro-usuarios" element={<ProtectedRoute><CadastroUsuarios /></ProtectedRoute>} />
        {/* Rota coringa para evitar erros de navegação */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;