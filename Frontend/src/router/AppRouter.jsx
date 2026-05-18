import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Admission from "../pages/Admission";
import Formations from "../pages/Formations";
import Contact from "../pages/Contact";
import Connexion from "../pages/Connexion";

import Universite from "../pages/Universite";
import Recherche from "../pages/Recherche";

import AdmissionsDashboard from "../pages/admin/AdmissionsDashboard";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<MainLayout><Home /></MainLayout>} />

        <Route path="/admission" element={<MainLayout><Admission /></MainLayout>} />

        <Route path="/formations" element={<MainLayout><Formations /></MainLayout>} />

        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />

        <Route path="/connexion" element={<MainLayout><Connexion /></MainLayout>} />

        {/* ✅ AJOUTS CORRIGÉS */}
        <Route path="/universite" element={<MainLayout><Universite /></MainLayout>} />

        <Route path="/recherche" element={<MainLayout><Recherche /></MainLayout>} />

        {/* ADMIN */}
        <Route path="/admin/admissions-dashboard" element={<AdmissionsDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}