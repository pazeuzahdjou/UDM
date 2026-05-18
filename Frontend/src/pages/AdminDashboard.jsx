// Frontend/src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [candidatures, setCandidatures] = useState([]);
  const [stats, setStats] = useState({ total: 0, enAttente: 0, valide: 0, rejete: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("tous");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }

    const fetchData = async () => {
      try {
        // Récupérer les stats
        const statsRes = await fetch("http://localhost:5000/api/admin/stats", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const statsData = await statsRes.json();
        if (statsData.success !== false) {
          setStats(statsData);
        }

        // Récupérer les candidatures
        const candidaturesRes = await fetch(`http://localhost:5000/api/admin/candidatures?status=${filter}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const candidaturesData = await candidaturesRes.json();
        if (candidaturesData.success !== false) {
          setCandidatures(candidaturesData.candidatures || []);
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    window.location.href = "/admin/login";
  };

  const getStatusBadge = (status) => {
    const styles = {
      en_attente: { background: "#fef3c7", color: "#92400e" },
      valide: { background: "#dcfce7", color: "#166534" },
      rejete: { background: "#fee2e2", color: "#991b1b" }
    };
    const labels = { en_attente: "⏳ En attente", valide: "✅ Validé", rejete: "❌ Rejeté" };
    return <span style={{ padding: "4px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: "600", ...styles[status] }}>{labels[status]}</span>;
  };

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>⏳ Chargement...</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
      {/* Header */}
      <header style={{ background: "white", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "2.5rem", height: "2.5rem", background: "#16a34a", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: "1.25rem" }}>🎓</span>
          </div>
          <div>
            <h1 style={{ fontWeight: "bold" }}>Dashboard Admin</h1>
            <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>Université de Moundou</p>
          </div>
        </div>
        <button onClick={handleLogout} style={{ color: "#dc2626", fontSize: "0.875rem", fontWeight: "600", background: "none", border: "none", cursor: "pointer" }}>Déconnexion</button>
      </header>

      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Filtres */}
        <div style={{ background: "white", borderRadius: "1rem", padding: "1rem", marginBottom: "1.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {[
            { value: "tous", label: "Toutes", count: stats.total },
            { value: "en_attente", label: "En attente", count: stats.enAttente },
            { value: "valide", label: "Validées", count: stats.valide },
            { value: "rejete", label: "Rejetées", count: stats.rejete }
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: "8px 16px",
                borderRadius: "0.75rem",
                fontWeight: "500",
                background: filter === f.value ? "#16a34a" : "#f3f4f6",
                color: filter === f.value ? "white" : "#374151",
                border: "none",
                cursor: "pointer"
              }}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {/* Tableau */}
        <div style={{ background: "white", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%" }}>
              <thead style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <tr>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600" }}>Candidat</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600" }}>Contact</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600" }}>Filière</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600" }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {candidatures.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>Aucune candidature trouvée</td></tr>
                ) : (
                  candidatures.map((c) => (
                    <tr key={c._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "1rem" }}><strong>{c.nom} {c.prenom}</strong><br/><span style={{ fontSize: "0.75rem", color: "#6b7280" }}>{c.reference}</span></td>
                      <td style={{ padding: "1rem", fontSize: "0.875rem" }}>{c.email}<br/>{c.telephone}</td>
                      <td style={{ padding: "1rem", fontSize: "0.875rem" }}>{c.filiere}<br/>{c.niveau}</td>
                      <td style={{ padding: "1rem" }}>{getStatusBadge(c.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}