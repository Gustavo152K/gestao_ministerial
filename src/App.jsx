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
import SidebarLayout from './components/SidebarLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/publico" element={<PainelPublico />} />
        
        {/* Rotas Privadas Protegidas com SidebarLayout */}
        <Route path="/dashboard" element={<ProtectedRoute><SidebarLayout><Dashboard /></SidebarLayout></ProtectedRoute>} />
        <Route path="/kids" element={<ProtectedRoute><SidebarLayout><KidsCheckin /></SidebarLayout></ProtectedRoute>} />
        <Route path="/cadastro-kids" element={<ProtectedRoute><SidebarLayout><CadastroKids /></SidebarLayout></ProtectedRoute>} />
        <Route path="/escalas" element={<ProtectedRoute><SidebarLayout><GestaoEscalas /></SidebarLayout></ProtectedRoute>} />
        <Route path="/repositorio" element={<ProtectedRoute><SidebarLayout><RepositorioMidias /></SidebarLayout></ProtectedRoute>} />
        <Route path="/relatorios" element={<ProtectedRoute><SidebarLayout><RelatoriosTecnicos /></SidebarLayout></ProtectedRoute>} />
        <Route path="/funcoes" element={<ProtectedRoute><SidebarLayout><CadastroFuncoes /></SidebarLayout></ProtectedRoute>} />
        <Route path="/membros" element={<ProtectedRoute><SidebarLayout><CadastroMembros /></SidebarLayout></ProtectedRoute>} />
        <Route path="/cadastro-usuarios" element={<ProtectedRoute><SidebarLayout><CadastroUsuarios /></SidebarLayout></ProtectedRoute>} />
        
        {/* Rota coringa para evitar erros de navegação */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;