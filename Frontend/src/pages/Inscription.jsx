import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Inscription() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    motDePasse: "",
    confirmation: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone || !formData.motDePasse) {
      setError("Veuillez remplir tous les champs obligatoires");
      return false;
    }
    if (formData.motDePasse !== formData.confirmation) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }
    if (formData.motDePasse.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Veuillez entrer une adresse email valide");
      return false;
    }
    const cleanPhone = formData.telephone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 8 || cleanPhone.length > 12) {
      setError("Le numéro de téléphone doit contenir entre 8 et 12 chiffres");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const cleanPhone = formData.telephone.replace(/[^0-9]/g, '');
      
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          password: formData.motDePasse,
          telephone: cleanPhone,
          adresse: ""
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // ✅ Déclencher la mise à jour de la navbar
        window.dispatchEvent(new Event('storage'));
        
        setSuccess("Compte créé avec succès ! Redirection...");
        
        setTimeout(() => {
          navigate("/admission");
        }, 2000);
      } else {
        setError(data.message || "Erreur lors de la création du compte");
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur de connexion au serveur. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          
          <h1 className="text-3xl font-bold text-gray-700">Université de Moundou</h1>
          <p className="text-black mt-2">Créez votre compte étudiant</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Inscription</h2>

          {error && <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl">⚠️ {error}</div>}
          {success && <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r-xl">✅ {success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nom *</label>
                <input type="text" name="nom" value={formData.nom} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Prénom *</label>
                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Téléphone *</label>
              <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="66 XX XX XX" className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe *</label>
                <input type="password" name="motDePasse" value={formData.motDePasse} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Confirmer *</label>
                <input type="password" name="confirmation" value={formData.confirmation} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500" required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-xl font-semibold transition mt-4 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Création...</>) : "Créer mon compte"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Déjà un compte ? <Link to="/connexion" className="text-green-600 hover:text-green-700 font-semibold">Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  );
}