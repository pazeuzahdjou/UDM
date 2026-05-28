// Frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Universite from './pages/Universite';
import Formations from './pages/Formations';
import Admission from './pages/Admission';
import Recherche from './pages/Recherche';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Inscription from './pages/Inscription';
import Profil from './pages/Profil';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Composant de protection pour les routes étudiant
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/connexion" replace />;
  }
  return children;
}

// Composant de protection pour les routes admin
function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes avec layout (pages publiques) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="universite" element={<Universite />} />
          <Route path="formations" element={<Formations />} />
          <Route path="recherche" element={<Recherche />} />
          <Route path="contact" element={<Contact />} />
          
          {/* Routes protégées (nécessitent connexion étudiant) */}
          <Route path="admission" element={
            <ProtectedRoute>
              <Admission />
            </ProtectedRoute>
          } />
          <Route path="profil" element={
            <ProtectedRoute>
              <Profil />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Routes sans layout (pages d'authentification) */}
        <Route path="/connexion" element={<Login />} />
        <Route path="/inscription" element={<Inscription />} />
        
        {/* Routes admin sans layout */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        } />
        
        {/* Route 404 - Page non trouvée */}
        <Route path="*" element={
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-6">Page non trouvée</p>
              <a href="/" className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition">
                Retour à l'accueil
              </a>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;