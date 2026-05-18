// Frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Universite from './pages/Universite';
import Formations from './pages/Formations';
import Admission from './pages/Admission';
import Recherche from './pages/Recherche';
import Contact from './pages/Contact';           // ← AJOUTER CETTE LIGNE
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes avec layout - le contenu des pages va dans l'Outlet */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="universite" element={<Universite />} />
          <Route path="formations" element={<Formations />} />
          <Route path="admission" element={<Admission />} />
          <Route path="recherche" element={<Recherche />} />
          <Route path="contact" element={<Contact />} />     {/* ← AJOUTER CETTE LIGNE */}
        </Route>
        
        {/* Routes SANS layout (pas de navbar/footer) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;