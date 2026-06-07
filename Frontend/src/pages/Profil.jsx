import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profil() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState(null);
  const [candidatures, setCandidatures] = useState([]);
  const [activeTab, setActiveTab] = useState("infos");
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // États pour modification
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    adresse: ""
  });
  
  // États pour changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [changingPassword, setChangingPassword] = useState(false);

  const token = localStorage.getItem("token");

  // Vérifier connexion
  useEffect(() => {
    if (!token) {
      navigate("/connexion");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Récupérer profil
      const profilRes = await fetch("http://localhost:5000/api/auth/profil", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const profilData = await profilRes.json();
      
      if (profilData.success) {
        setUser(profilData.user);
        setFormData({
          nom: profilData.user.nom || "",
          prenom: profilData.user.prenom || "",
          telephone: profilData.user.telephone || "",
          adresse: profilData.user.adresse || ""
        });
      }
      
      // Récupérer candidatures
      const candidaturesRes = await fetch("http://localhost:5000/api/auth/mes-candidatures", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const candidaturesData = await candidaturesRes.json();
      setCandidatures(candidaturesData.candidatures || []);
      
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event('storage'));
    navigate("/");
  };

  const handleUpdateProfil = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: "", text: "" });
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/profil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        setEditMode(false);
        setMessage({ type: "success", text: "Profil mis à jour avec succès !" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: data.message || "Erreur" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur de connexion" });
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Les mots de passe ne correspondent pas" });
      return;
    }
    
    setChangingPassword(true);
    setMessage({ type: "", text: "" });
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setMessage({ type: "success", text: "Mot de passe modifié avec succès !" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: data.message || "Erreur" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur de connexion" });
    } finally {
      setChangingPassword(false);
    }
  };

  //FONCTION DE TÉLÉCHARGEMENT DE L'ATTESTATION
  const telechargerAttestation = async (candidatureId) => {
    const token = localStorage.getItem("token");
    
    console.log("=== TÉLÉCHARGEMENT ATTESTATION ===");
    console.log("ID candidature:", candidatureId);
    console.log("Token présent:", !!token);
    
    if (!token) {
      setMessage({ type: "error", text: "Vous devez être connecté" });
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/auth/attestation/${candidatureId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      console.log("Status réponse:", response.status);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attestation_${candidatureId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setMessage({ type: "success", text: "Attestation téléchargée avec succès !" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        const error = await response.json();
        console.error("Erreur serveur:", error);
        setMessage({ type: "error", text: error.message || "Impossible de télécharger l'attestation" });
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      setMessage({ type: "error", text: "Erreur de connexion au serveur" });
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      en_attente: "bg-yellow-100 text-yellow-800",
      valide: "bg-green-100 text-green-800",
      rejete: "bg-red-100 text-red-800"
    };
    const labels = { en_attente: "⏳ En attente", valide: "✅ Validé", rejete: "❌ Rejeté" };
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>{labels[status]}</span>;
  };

  const getPaymentStatusBadge = (status) => {
    return status === 'paye' 
      ? <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">💰 Payé</span>
      : <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">⏳ En attente</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-4xl animate-spin mb-4">⏳</div>
          <p className="text-gray-500">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* En-tête */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center text-3xl">
              👤
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user?.nom} {user?.prenom}</h1>
              <p className="text-gray-500">{user?.email}</p>
              {user?.matricule && <p className="text-sm text-green-600 font-semibold">Matricule: {user.matricule}</p>}
            </div>
          </div>
          <button
            onClick={() => navigate("/admission")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-md"
          >
            + Nouvelle candidature
          </button>
        </div>
      </div>

      {/* Messages */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-xl ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.text}
        </div>
      )}

      {/* Onglets */}
      <div className="flex gap-2 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("infos")}
          className={`px-6 py-3 font-semibold transition ${activeTab === "infos" ? "text-green-600 border-b-2 border-green-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          📋 Mes informations
        </button>
        <button
          onClick={() => setActiveTab("candidatures")}
          className={`px-6 py-3 font-semibold transition ${activeTab === "candidatures" ? "text-green-600 border-b-2 border-green-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          📄 Mes candidatures
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`px-6 py-3 font-semibold transition ${activeTab === "password" ? "text-green-600 border-b-2 border-green-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          🔒 Changer mot de passe
        </button>
      </div>

      {/* Onglet Informations */}
      {activeTab === "infos" && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {!editMode ? (
            <>
              <div className="flex justify-end mb-6">
                <button onClick={() => setEditMode(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold transition">
                  ✏️ Modifier
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div><label className="text-gray-500 text-sm">Nom complet</label><p className="text-gray-800 font-medium">{user?.nom} {user?.prenom}</p></div>
                <div><label className="text-gray-500 text-sm">Email</label><p className="text-gray-800 font-medium">{user?.email}</p></div>
                <div><label className="text-gray-500 text-sm">Téléphone</label><p className="text-gray-800 font-medium">{user?.telephone || "Non renseigné"}</p></div>
                <div><label className="text-gray-500 text-sm">Adresse</label><p className="text-gray-800 font-medium">{user?.adresse || "Non renseignée"}</p></div>
                <div><label className="text-gray-500 text-sm">Matricule</label><p className="text-gray-800 font-medium">{user?.matricule || "Non attribué"}</p></div>
                <div><label className="text-gray-500 text-sm">Membre depuis</label><p className="text-gray-800 font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString("fr-FR") : "-"}</p></div>
              </div>
            </>
          ) : (
            <form onSubmit={handleUpdateProfil} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Nom *</label><input type="text" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} required className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Prénom *</label><input type="text" value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} required className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Téléphone</label><input type="tel" value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="66 XX XX XX" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Adresse</label><input type="text" value={formData.adresse} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Votre adresse" /></div>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setEditMode(false)} className="px-6 py-2 bg-gray-200 rounded-xl font-semibold hover:bg-gray-300 transition">Annuler</button>
                <button type="submit" disabled={updating} className="px-6 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50">{updating ? "Enregistrement..." : "Enregistrer"}</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Onglet Candidatures */}
      {activeTab === "candidatures" && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {candidatures.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500">Aucune candidature trouvée</p>
              <button onClick={() => navigate("/admission")} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition">Déposer une candidature</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Référence</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Filière</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Niveau</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Statut</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Paiement</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {candidatures.map((c) => (
                    <tr key={c._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm">{c.reference}</td>
                      <td className="px-6 py-4">{c.filiere}</td>
                      <td className="px-6 py-4">{c.niveau} {c.sousNiveau}</td>
                      <td className="px-6 py-4">{getStatusBadge(c.status)}</td>
                      <td className="px-6 py-4">{getPaymentStatusBadge(c.paymentStatus)}</td>
                      <td className="px-6 py-4 text-sm">{new Date(c.dateSoumission).toLocaleDateString("fr-FR")}</td>
                      <td className="px-6 py-4">
                        {c.status === 'valide' && c.paymentStatus === 'paye' && (
                          <button 
                            onClick={() => telechargerAttestation(c._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm"
                          >
                            📄 Attestation
                          </button>
                        )}
                        {c.status !== 'valide' && (
                          <span className="text-gray-400 text-sm">Indisponible</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Onglet Changer mot de passe */}
      {activeTab === "password" && (
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md">
          <form onSubmit={handleChangePassword} className="space-y-5">
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe actuel *</label><input type="password" value={passwordData.oldPassword} onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} required className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Nouveau mot de passe *</label><input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Confirmer le nouveau mot de passe *</label><input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500" /></div>
            <button type="submit" disabled={changingPassword} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50">{changingPassword ? "Modification..." : "Changer le mot de passe"}</button>
          </form>
        </div>
      )}
    </div>
  );
}