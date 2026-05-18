import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [candidatures, setCandidatures] = useState([]);
  const [stats, setStats] = useState({ total: 0, enAttente: 0, valide: 0, rejete: 0 });
  const [loading, setLoading] = useState(true);

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
        setStats(statsData);

        // Récupérer les candidatures
        const candidaturesRes = await fetch("http://localhost:5000/api/admin/candidatures", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const candidaturesData = await candidaturesRes.json();
        setCandidatures(candidaturesData.candidatures || []);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    window.location.href = "/admin/login";
  };

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>⏳ Chargement...</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
      {/* Header */}
      <header style={{ background: "white", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "2.5rem", height: "2.5rem", background: "#16a34a", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white" }}>🎓</span>
          </div>
          <div>
            <h1 style={{ fontWeight: "bold" }}>Dashboard Admin</h1>
            <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>Université de Moundou</p>
          </div>
        </div>
        <button onClick={handleLogout} style={{ color: "#dc2626", fontSize: "0.875rem", fontWeight: "600" }}>Déconnexion</button>
      </header>

      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Statistiques */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
          <div style={{ background: "white", borderRadius: "1rem", padding: "1.5rem", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)", borderLeft: "4px solid #3b82f6" }}>
            <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>Total candidatures</p>
            <p style={{ fontSize: "1.875rem", fontWeight: "bold" }}>{stats.total}</p>
          </div>
          <div style={{ background: "white", borderRadius: "1rem", padding: "1.5rem", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)", borderLeft: "4px solid #eab308" }}>
            <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>En attente</p>
            <p style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#ca8a04" }}>{stats.enAttente}</p>
          </div>
          <div style={{ background: "white", borderRadius: "1rem", padding: "1.5rem", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)", borderLeft: "4px solid #22c55e" }}>
            <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>Validées</p>
            <p style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#16a34a" }}>{stats.valide}</p>
          </div>
          <div style={{ background: "white", borderRadius: "1rem", padding: "1.5rem", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)", borderLeft: "4px solid #ef4444" }}>
            <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>Rejetées</p>
            <p style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#dc2626" }}>{stats.rejete}</p>
          </div>
        </div>

        {/* Liste des candidatures */}
        <div style={{ background: "white", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%" }}>
              <thead style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <tr>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600" }}>Candidat</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600" }}>Email</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600" }}>Filière</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600" }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {candidatures.map((c) => (
                  <tr key={c._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "1rem" }}>{c.nom} {c.prenom}</td>
                    <td style={{ padding: "1rem", fontSize: "0.875rem" }}>{c.email}</td>
                    <td style={{ padding: "1rem", fontSize: "0.875rem" }}>{c.filiere}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ 
                        padding: "0.25rem 0.75rem", 
                        borderRadius: "9999px", 
                        fontSize: "0.75rem", 
                        fontWeight: "600",
                        background: c.status === 'valide' ? '#dcfce7' : c.status === 'rejete' ? '#fee2e2' : '#fef3c7',
                        color: c.status === 'valide' ? '#166534' : c.status === 'rejete' ? '#991b1b' : '#92400e'
                      }}>
                        {c.status === 'valide' ? '✅ Validé' : c.status === 'rejete' ? '❌ Rejeté' : '⏳ En attente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}