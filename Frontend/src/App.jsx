import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import des layouts et pages
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Universite from "./pages/Universite";
import Formations from "./pages/Formations";
import Admission from "./pages/Admission";
import Recherche from "./pages/Recherche";

// Import des pages admin
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques avec layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="universite" element={<Universite />} />
          <Route path="formations" element={<Formations />} />
          <Route path="admission" element={<Admission />} />
          <Route path="recherche" element={<Recherche />} />
        </Route>
        
        {/* Routes ADMIN - en dehors du MainLayout */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        {/* Route de test */}
        <Route path="/test" element={<div style={{padding:50}}>✅ Test réussi</div>} />
      </Routes>
    </Router>
  );
}

export default App;