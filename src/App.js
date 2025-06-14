import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import GestionUtilisateurs from './pages/admin/GestionUtilisateurs';
import PlanningGlobal from './pages/admin/PlanningGlobal';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import PlanningEquipe from './pages/manager/plannings';
import Pointages from './pages/manager/pointages';
import Employes from './pages/manager/employes';
import DemandesConge from './pages/employe/DemandesConge';
import CongeEmploye from './pages/manager/congeEmploye';
import ScannerBadge from './pages/pointeur/ScannerBadge';
import PointeurDashboard from './pages/pointeur/PointeurDashboard';
import PointagesHistorique from './pages/pointeur/PointagesHistorique';
import HistoriqueConges from './pages/employe/historiqueConges';
import HistoriquePointages from './pages/employe/historiquePointages';



import EmployeDashboard from './pages/employe/EmployeDashboard';
import MonPlanning from './pages/employe/MonPlanning';
import Pointage from './pages/employe/Pointages';

import AjoutUtilisateur from './pages/admin/AjoutUtilisateur';
import ModifierUtilisateur from './pages/admin/ModifierUtilisateur';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';

import './styles/App.css';

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAuthenticated = user !== null;
  const role = user?.role;

  // Redirection par défaut selon le rôle
  const defaultRedirect = () => {
    if (role === 'admin') return '/admin';
    if (role === 'manager') return '/manager';
    if (role === 'employe') return '/employe';
    if (role === 'pointeur') return '/pointeur';
    // Si aucun rôle reconnu, redirige vers la page de connexion
    return '/login';
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Navigate to="/login" />} />
        <Route path="/home" element={<Navigate to={isAuthenticated ? defaultRedirect() : '/login'} />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/utilisateurs" element={<PrivateRoute allowedRoles={['admin']}><GestionUtilisateurs /></PrivateRoute>} />
        <Route path="/admin/planning-global" element={<PrivateRoute allowedRoles={['admin']}><PlanningGlobal /></PrivateRoute>} />
        <Route path="/admin/ajouter-utilisateur" element={<PrivateRoute allowedRoles={['admin']}><AjoutUtilisateur /></PrivateRoute>} />
        <Route path="/admin/modifier-utilisateur/:id" element={<PrivateRoute allowedRoles={['admin']}><ModifierUtilisateur /></PrivateRoute>} />

        {/* Manager Routes */}
        <Route path="/manager" element={<PrivateRoute allowedRoles={['manager']}><ManagerDashboard /></PrivateRoute>} />
        <Route path="/manager/plannings" element={<PrivateRoute allowedRoles={['manager']}><PlanningEquipe /></PrivateRoute>} />
        <Route path="/manager/pointages" element={<PrivateRoute allowedRoles={['manager']}><Pointages /></PrivateRoute>} />
        <Route path="/manager/employes" element={<PrivateRoute allowedRoles={['manager']}><Employes /></PrivateRoute>} />
        <Route path="/manager/congeEmploye" element={<PrivateRoute allowedRoles={['manager']}><CongeEmploye /></PrivateRoute>} />

        {/* Employé Routes */}
        <Route path="/employe" element={<PrivateRoute allowedRoles={['employe']}><EmployeDashboard /></PrivateRoute>} />
        <Route path="/employe/mon-planning" element={<PrivateRoute allowedRoles={['employe']}><MonPlanning /></PrivateRoute>} />
        <Route path="/employe/pointage" element={<PrivateRoute allowedRoles={['employe']}><Pointage /></PrivateRoute>} />
        <Route path="/employe/conges" element={<PrivateRoute allowedRoles={['employe']}><DemandesConge /></PrivateRoute>} />
        <Route path="/employe/historique-conges" element={<PrivateRoute allowedRoles={['employe']}><HistoriqueConges /></PrivateRoute>} />
        <Route path="/employe/historique-pointages" element={<PrivateRoute allowedRoles={['employe']}><HistoriquePointages /></PrivateRoute>} />

        {/* Pointeur Routes */}
        <Route path="/pointeur" element={<PrivateRoute allowedRoles={['pointeur']}><PointeurDashboard /></PrivateRoute>} />
        <Route path="/pointeur/ScannerBadge" element={<PrivateRoute allowedRoles={['pointeur']}><ScannerBadge /></PrivateRoute>} />
        <Route path="/pointeur/PointagesHistorique" element={<PrivateRoute allowedRoles={['pointeur']}><PointagesHistorique /></PrivateRoute>} />



        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
