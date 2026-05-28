import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [candidatures, setCandidatures] = useState([]);
  const [stats, setStats] = useState({ total: 0, enAttente: 0, valide: 0, rejete: 0 });
  const [filter, setFilter] = useState("tous");
  const [loading, setLoading] = useState(true);
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [commentaire, setCommentaire] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  // Vérifier authentication
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  // Charger les données
  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("adminToken");
    
    if (!token) {
      navigate("/admin/login");
      return;
    }
    
    try {
      // Charger statistiques
      const statsRes = await fetch("http://localhost:5000/api/admin/stats", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      if (statsData && typeof statsData === 'object') {
        setStats({
          total: statsData.total || 0,
          enAttente: statsData.enAttente || 0,
          valide: statsData.valide || 0,
          rejete: statsData.rejete || 0
        });
      }

      // Charger candidatures
      const candidaturesRes = await fetch(
        `http://localhost:5000/api/admin/candidatures?status=${filter}&page=${currentPage}&search=${searchTerm}`,
        { headers: { "Authorization": `Bearer ${token}` } }
      );
      const candidaturesData = await candidaturesRes.json();
      if (candidaturesData.success !== false && candidaturesData.candidatures) {
        setCandidatures(candidaturesData.candidatures);
        if (candidaturesData.pagination) {
          setTotalPages(candidaturesData.pagination.pages || 1);
        }
      }
    } catch (error) {
      console.error("Erreur chargement:", error);
      setMessage({ type: "error", text: "Erreur de chargement des données" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter, currentPage, searchTerm]);

  // Traiter une candidature (validation/rejet)
  const handleAction = async (id, action) => {
    const token = localStorage.getItem("adminToken");
    
    setProcessing(true);
    
    try {
      console.log(`📝 Action ${action} sur la candidature ${id}`);
      
      const response = await fetch(
        `http://localhost:5000/api/admin/candidatures/${id}/${action}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ commentaire })
        }
      );
      
      const data = await response.json();
      console.log("Réponse:", data);
      
      if (response.ok) {
        setMessage({ 
          type: "success", 
          text: `✅ Candidature ${action === "valider" ? "validée" : "rejetée"} avec succès` 
        });
        fetchData();
        setSelectedCandidature(null);
        setCommentaire("");
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: data.message || "Erreur lors du traitement" });
      }
    } catch (error) {
      console.error("Erreur action:", error);
      setMessage({ type: "error", text: "Erreur de connexion: " + error.message });
    } finally {
      setProcessing(false);
    }
  };

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    navigate("/admin/login");
  };

  // Construire l'URL correcte du document
  const getDocumentUrl = (filename) => {
    if (!filename) return null;
    // Si c'est déjà une URL complète, la retourner
    if (filename.startsWith('http')) return filename;
    // Sinon, construire l'URL avec /uploads/
    return `http://localhost:5000/uploads/${filename}`;
  };

  const getStatusBadge = (status) => {
    const styles = {
      en_attente: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      valide: "bg-green-100 text-green-800 border border-green-200",
      rejete: "bg-red-100 text-red-800 border border-red-200"
    };
    const labels = { 
      en_attente: "⏳ En attente", 
      valide: "✅ Validé", 
      rejete: "❌ Rejeté" 
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>{labels[status]}</span>;
  };

  const getPaymentStatusBadge = (status) => {
    if (status === 'paye') {
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">💰 Payé</span>;
    }
    return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">⏳ En attente</span>;
  };

  const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🎓</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-800">Dashboard Administrateur</h1>
              <p className="text-xs text-gray-500">Université de Moundou</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{adminInfo.nom || "Administrateur"}</p>
              <p className="text-xs text-gray-400">{adminInfo.role === 'super_admin' ? 'Super Admin' : 'Admin'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-50 transition"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Message notification */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${message.type === "success" ? "bg-green-100 text-green-700 border-l-4 border-green-500" : "bg-red-100 text-red-700 border-l-4 border-red-500"}`}>
            {message.text}
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-blue-500 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Total candidatures</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="text-3xl text-blue-500">📋</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-yellow-500 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">En attente</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.enAttente}</p>
              </div>
              <div className="text-3xl text-yellow-500">⏳</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Validées</p>
                <p className="text-3xl font-bold text-green-600">{stats.valide}</p>
              </div>
              <div className="text-3xl text-green-500">✅</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-red-500 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Rejetées</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejete}</p>
              </div>
              <div className="text-3xl text-red-500">❌</div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "tous", label: "Toutes", count: stats.total, icon: "📊" },
                { value: "en_attente", label: "En attente", count: stats.enAttente, icon: "⏳" },
                { value: "valide", label: "Validées", count: stats.valide, icon: "✅" },
                { value: "rejete", label: "Rejetées", count: stats.rejete, icon: "❌" }
              ].map(f => (
                <button
                  key={f.value}
                  onClick={() => { setFilter(f.value); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 ${
                    filter === f.value
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span>{f.icon}</span>
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher par nom, email ou référence..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="border border-gray-300 rounded-xl px-4 py-2 pl-10 w-64 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        {/* Tableau des candidatures */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin text-5xl mb-4">⏳</div>
              <p className="text-gray-500">Chargement des données...</p>
            </div>
          ) : candidatures.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500">Aucune candidature trouvée</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Candidat</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Filière/Niveau</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Référence</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Statut</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Paiement</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {candidatures.map((c, idx) => (
                    <tr key={c._id} className={`border-b hover:bg-gray-50 transition ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-800">{c.nom} {c.prenom}</p>
                        <p className="text-xs text-gray-400">{c.email}</p>
                       </td>
                      <td className="px-6 py-4">
                        <p className="text-sm">{c.telephone}</p>
                        <p className="text-xs text-gray-400">{c.telephoneParent && `Parent: ${c.telephoneParent}`}</p>
                        </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-800">{c.filiere}</p>
                        <p className="text-xs text-gray-400">{c.niveau} {c.sousNiveau}</p>
                        </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{c.reference}</p>
                        </td>
                      <td className="px-6 py-4">{getStatusBadge(c.status)}</td>
                      <td className="px-6 py-4">{getPaymentStatusBadge(c.paymentStatus)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(c.dateSoumission).toLocaleDateString("fr-FR")}
                        </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedCandidature(c)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                        >
                          📋 Détails
                        </button>
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 py-4 border-t">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50"
              >
                ← Précédent
              </button>
              <span className="px-3 py-1 text-gray-600">
                Page {currentPage} sur {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50"
              >
                Suivant →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Détails Candidature */}
      {selectedCandidature && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedCandidature(null)}>
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">📄 Détails de la candidature</h2>
              <button onClick={() => setSelectedCandidature(null)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Informations personnelles */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">👤 Informations personnelles</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="text-xs text-gray-400">Nom complet</label><p className="font-semibold">{selectedCandidature.nom} {selectedCandidature.prenom}</p></div>
                  <div><label className="text-xs text-gray-400">Email</label><p>{selectedCandidature.email}</p></div>
                  <div><label className="text-xs text-gray-400">Téléphone</label><p>{selectedCandidature.telephone}</p></div>
                  <div><label className="text-xs text-gray-400">Téléphone parent</label><p>{selectedCandidature.telephoneParent || "Non renseigné"}</p></div>
                  <div><label className="text-xs text-gray-400">Date de naissance</label><p>{selectedCandidature.dateNaissance || "Non renseignée"}</p></div>
                  <div><label className="text-xs text-gray-400">Lieu de naissance</label><p>{selectedCandidature.lieuNaissance || "Non renseigné"}</p></div>
                  <div><label className="text-xs text-gray-400">Pays d'origine</label><p>{selectedCandidature.paysOrigine || "Non renseigné"}</p></div>
                  <div><label className="text-xs text-gray-400">Sexe</label><p>{selectedCandidature.sexe || "Non renseigné"}</p></div>
                </div>
              </div>
              
              {/* Informations académiques */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">📚 Parcours académique</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="text-xs text-gray-400">Filière</label><p className="font-semibold">{selectedCandidature.filiere}</p></div>
                  <div><label className="text-xs text-gray-400">Niveau</label><p>{selectedCandidature.niveau} {selectedCandidature.sousNiveau}</p></div>
                  <div><label className="text-xs text-gray-400">Mention au Bac</label><p>{selectedCandidature.mention || "Non renseignée"}</p></div>
                  <div><label className="text-xs text-gray-400">Année du Bac</label><p>{selectedCandidature.anneeBac || "Non renseignée"}</p></div>
                </div>
              </div>
              
              {/* Paiement */}
              <div className="bg-green-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">💰 Informations de paiement</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="text-xs text-gray-500">Montant</label><p className="font-bold text-green-700">{selectedCandidature.montant?.toLocaleString()} FCFA</p></div>
                  <div><label className="text-xs text-gray-500">Mode de paiement</label><p>{selectedCandidature.modePaiement || "Non effectué"}</p></div>
                  <div className="md:col-span-2"><label className="text-xs text-gray-500">Statut</label><p>{getPaymentStatusBadge(selectedCandidature.paymentStatus)}</p></div>
                  {selectedCandidature.paymentReference && (
                    <div className="md:col-span-2"><label className="text-xs text-gray-500">Référence transaction</label><p className="font-mono text-sm bg-white px-2 py-1 rounded inline-block">{selectedCandidature.paymentReference}</p></div>
                  )}
                </div>
              </div>
              
              {/* Documents avec visualisation directe - URL CORRIGÉE */}
              {selectedCandidature.documents && Object.keys(selectedCandidature.documents).filter(k => selectedCandidature.documents[k]).length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">📎 Documents fournis</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(selectedCandidature.documents).map(([key, val]) => val && (
                      <div key={key} className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                        <div className="flex flex-col items-center text-center">
                          {/* Aperçu de l'image si c'est une image */}
                          {val && (val.match(/\.(jpg|jpeg|png|gif)$/i)) && (
                            <img 
                              src={`http://localhost:5000/uploads/${val}`} 
                              alt={key}
                              className="w-20 h-20 object-cover rounded-lg mb-2 border"
                              onError={(e) => { 
                                e.target.src = 'https://via.placeholder.com/80?text=Image+non+trouvée';
                                console.log(`Erreur: http://localhost:5000/uploads/${val}`);
                              }}
                            />
                          )}
                          {!val || (!val.match(/\.(jpg|jpeg|png|gif)$/i)) && (
                            <span className="text-4xl mb-2">📄</span>
                          )}
                          <span className="capitalize text-sm font-medium mb-2">{key}</span>
                          <div className="flex gap-2 flex-wrap justify-center">
                            <button
                              onClick={() => window.open(`http://localhost:5000/uploads/${val}`, '_blank')}
                              className="text-blue-600 text-xs hover:text-blue-800 flex items-center gap-1"
                            >
                              🔍 Visualiser
                            </button>
                            <a
                              href={`http://localhost:5000/uploads/${val}`}
                              download
                              className="text-green-600 text-xs hover:text-green-800 flex items-center gap-1"
                            >
                              💾 Télécharger
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">📌 Cliquez sur "Visualiser" pour ouvrir le document dans un nouvel onglet</p>
                </div>
              )}
              
              {/* Message */}
              {selectedCandidature.message && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">💬 Message du candidat</h3>
                  <p className="text-gray-700 italic bg-white p-3 rounded-xl">{selectedCandidature.message}</p>
                </div>
              )}
              
              {/* Actions Admin */}
              {selectedCandidature.status === "en_attente" && (
                <div className="border-t pt-6 mt-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">✏️ Commentaire (optionnel)</label>
                  <textarea
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                    placeholder="Ajouter un commentaire pour l'étudiant..."
                    className="w-full border border-gray-300 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAction(selectedCandidature._id, "valider")}
                      disabled={processing}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {processing ? "⏳..." : "✅ Valider la candidature"}
                    </button>
                    <button
                      onClick={() => handleAction(selectedCandidature._id, "rejeter")}
                      disabled={processing}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {processing ? "⏳..." : "❌ Rejeter la candidature"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    ⚠️ Cette action est irréversible. Un email sera envoyé automatiquement à l'étudiant.
                  </p>
                </div>
              )}
              
              {/* Candidature déjà traitée */}
              {selectedCandidature.status !== "en_attente" && (
                <div className="bg-gray-100 rounded-xl p-4 text-center">
                  <p className="text-gray-600">📅 Candidature traitée le {new Date(selectedCandidature.dateTraitement).toLocaleDateString("fr-FR")}</p>
                  {selectedCandidature.commentaireAdmin && (
                    <p className="text-sm text-gray-500 mt-2">📝 Commentaire : {selectedCandidature.commentaireAdmin}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}