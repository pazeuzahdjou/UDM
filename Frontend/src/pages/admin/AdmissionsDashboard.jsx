import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [candidatures, setCandidatures] = useState([]);
  const [stats, setStats] = useState({ total: 0, enAttente: 0, valide: 0, rejete: 0 });
  const [filter, setFilter] = useState('tous');
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [commentaire, setCommentaire] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchCandidatures = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/candidatures?status=${filter}`);
      const data = await res.json();
      setCandidatures(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCandidatures();
    fetchStats();
  }, [filter]);

  const handleValidation = async (id, action) => {
    const url = `http://localhost:5000/api/admin/candidatures/${id}/${action}`;
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentaire })
      });
      if (res.ok) {
        setMessage(`✅ Candidature ${action === 'valider' ? 'validée' : 'rejetée'} avec succès`);
        fetchCandidatures();
        fetchStats();
        setSelectedCandidature(null);
        setCommentaire('');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('❌ Erreur lors du traitement');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      en_attente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      valide: 'bg-green-100 text-green-800 border-green-200',
      rejete: 'bg-red-100 text-red-800 border-red-200'
    };
    const labels = { en_attente: '⏳ En attente', valide: '✅ Validé', rejete: '❌ Rejeté' };
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>{labels[status]}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">🎓 Dashboard Administrateur</h1>
              <p className="text-green-100 mt-1">Gestion des candidatures - Université de Moundou</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-100">Session 2025-2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm">Total candidatures</p>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm">En attente</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.enAttente}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500">
            <p className="text-gray-500 text-sm">Validées</p>
            <p className="text-3xl font-bold text-green-600">{stats.valide}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-red-500">
            <p className="text-gray-500 text-sm">Rejetées</p>
            <p className="text-3xl font-bold text-red-600">{stats.rejete}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex gap-3 flex-wrap">
          {[
            { value: 'tous', label: 'Toutes', count: stats.total },
            { value: 'en_attente', label: 'En attente', count: stats.enAttente, color: 'yellow' },
            { value: 'valide', label: 'Validées', count: stats.valide, color: 'green' },
            { value: 'rejete', label: 'Rejetées', count: stats.rejete, color: 'red' }
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-5 py-2 rounded-xl font-semibold transition flex items-center gap-2
                ${filter === f.value ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {f.label} <span className="text-sm opacity-75">({f.count})</span>
            </button>
          ))}
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl border-l-4 border-green-500">
            {message}
          </div>
        )}

        {/* Tableau */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Candidat</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Filière</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Référence</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {candidatures.map((c, idx) => (
                  <tr key={c._id} className={`border-b hover:bg-gray-50 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{c.nom} {c.prenom}</p>
                      <p className="text-xs text-gray-400">{new Date(c.dateSoumission).toLocaleDateString('fr-FR')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm">{c.telephone}</p>
                      <p className="text-xs text-gray-400">{c.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">{c.filiere}</p>
                      <p className="text-xs text-gray-400">{c.niveau} - {c.sousNiveau}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-mono text-gray-500">{c.reference}</p>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(c.status)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedCandidature(c)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        📋 Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {candidatures.length === 0 && (
            <div className="text-center py-12 text-gray-400">Aucune candidature trouvée</div>
          )}
        </div>
      </div>

      {/* Modal Détails */}
      {selectedCandidature && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">📄 Détails de la candidature</h2>
              <button onClick={() => setSelectedCandidature(null)} className="text-gray-400 text-2xl">✕</button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Infos candidat */}
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="text-xs text-gray-400">Nom complet</label><p className="font-semibold">{selectedCandidature.nom} {selectedCandidature.prenom}</p></div>
                <div><label className="text-xs text-gray-400">Email</label><p>{selectedCandidature.email}</p></div>
                <div><label className="text-xs text-gray-400">Téléphone</label><p>{selectedCandidature.telephone}</p></div>
                <div><label className="text-xs text-gray-400">Téléphone parent</label><p>{selectedCandidature.telephoneParent}</p></div>
                <div><label className="text-xs text-gray-400">Date naissance</label><p>{selectedCandidature.dateNaissance}</p></div>
                <div><label className="text-xs text-gray-400">Lieu naissance</label><p>{selectedCandidature.lieuNaissance}</p></div>
                <div><label className="text-xs text-gray-400">Pays origine</label><p>{selectedCandidature.paysOrigine}</p></div>
              </div>
              
              {/* Infos académiques */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold mb-3">📚 Parcours académique</h3>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Filière:</span> {selectedCandidature.filiere}</div>
                  <div><span className="text-gray-500">Niveau:</span> {selectedCandidature.niveau} - {selectedCandidature.sousNiveau}</div>
                  <div><span className="text-gray-500">Mention Bac:</span> {selectedCandidature.mention}</div>
                  <div><span className="text-gray-500">Année Bac:</span> {selectedCandidature.anneeBac}</div>
                </div>
              </div>
              
              {/* Paiement */}
              <div className="bg-green-50 rounded-xl p-4">
                <h3 className="font-semibold mb-3">💰 Paiement</h3>
                <p><span className="text-gray-500">Montant:</span> {selectedCandidature.montant?.toLocaleString()} FCFA</p>
                <p><span className="text-gray-500">Référence:</span> <code className="bg-white px-2 py-1 rounded">{selectedCandidature.reference}</code></p>
                <p><span className="text-gray-500">Mode:</span> {selectedCandidature.modePaiement}</p>
              </div>
              
              {/* Documents */}
              <div>
                <h3 className="font-semibold mb-3">📎 Documents</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidature.documents && Object.entries(selectedCandidature.documents).map(([key, val]) => (
                    val && <a key={key} href={`http://localhost:5000/${val}`} target="_blank" className="bg-gray-100 px-3 py-1 rounded-full text-sm hover:bg-green-100 transition">📄 {key}</a>
                  ))}
                </div>
              </div>
              
              {/* Message */}
              {selectedCandidature.message && (
                <div><label className="text-xs text-gray-400">Message</label><p className="bg-gray-50 p-3 rounded-xl">{selectedCandidature.message}</p></div>
              )}
              
              {/* Action Admin */}
              {selectedCandidature.status === 'en_attente' && (
                <div className="border-t pt-6">
                  <label className="block text-sm font-semibold mb-2">✏️ Commentaire (optionnel)</label>
                  <textarea
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                    placeholder="Motif de validation ou rejet..."
                    className="w-full border rounded-xl p-3 mb-4"
                    rows="2"
                  />
                  <div className="flex gap-3">
                    <button onClick={() => handleValidation(selectedCandidature._id, 'valider')} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold">✅ Valider</button>
                    <button onClick={() => handleValidation(selectedCandidature._id, 'rejeter')} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold">❌ Rejeter</button>
                  </div>
                </div>
              )}
              
              {/* Status déjà traité */}
              {selectedCandidature.status !== 'en_attente' && (
                <div className="bg-gray-100 rounded-xl p-4 text-center">
                  <p className="text-gray-600">Candidature traitée le {new Date(selectedCandidature.dateTraitement).toLocaleDateString('fr-FR')}</p>
                  {selectedCandidature.commentaireAdmin && <p className="text-sm text-gray-500 mt-1">Commentaire: {selectedCandidature.commentaireAdmin}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}