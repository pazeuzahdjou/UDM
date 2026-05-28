import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Effacer l'erreur quand l'utilisateur modifie un champ
    setError("");
  };

  const validateForm = () => {
    // Vérifier les champs obligatoires
    if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone || !formData.motDePasse) {
      setError("Veuillez remplir tous les champs obligatoires");
      return false;
    }
    
    // Vérifier les mots de passe
    if (formData.motDePasse !== formData.confirmation) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }
    
    // Vérifier la longueur du mot de passe
    if (formData.motDePasse.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }
    
    // Vérifier le format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Veuillez entrer une adresse email valide");
      return false;
    }
    
    // Vérifier le téléphone (8-12 chiffres)
    const phoneRegex = /^\d{8,12}$/;
    const cleanPhone = formData.telephone.replace(/[^0-9]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      setError("Le numéro de téléphone doit contenir entre 8 et 12 chiffres");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const cleanPhone = formData.telephone.replace(/[^0-9]/g, '');
      
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        // Sauvegarder le token et les infos utilisateur
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        setSuccess("Compte créé avec succès ! Redirection...");
        
        // Rediriger vers la page d'admission après 2 secondes
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
    <MainLayout>
      <section
        className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-gray-100
        to-green-50
        px-6
        py-16
        "
      >
        <div
          className="
          bg-white
          rounded-3xl
          shadow-2xl
          p-10
          w-full
          max-w-2xl
          "
        >
          {/* TITRE */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎓</span>
            </div>
            <h1
              className="
              text-4xl
              font-extrabold
              text-gray-800
              mb-4
              "
            >
              Créer un compte étudiant
            </h1>
            <p className="text-gray-600">
              Inscrivez-vous pour accéder au formulaire d'admission en ligne
            </p>
          </div>

          {/* MESSAGES D'ERREUR/SUCCÈS */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl">
              ⚠️ {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r-xl">
              ✅ {success}
            </div>
          )}

          {/* FORMULAIRE */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NOM & PRÉNOM */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  placeholder="Votre nom"
                  className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-5
                  py-3
                  focus:ring-2
                  focus:ring-green-500
                  focus:border-transparent
                  outline-none
                  transition
                  "
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  placeholder="Votre prénom"
                  className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-5
                  py-3
                  focus:ring-2
                  focus:ring-green-500
                  focus:border-transparent
                  outline-none
                  transition
                  "
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Adresse email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="exemple@gmail.com"
                className="
                w-full
                border
                border-gray-300
                rounded-xl
                px-5
                py-3
                focus:ring-2
                focus:ring-green-500
                focus:border-transparent
                outline-none
                transition
                "
              />
              <p className="text-xs text-gray-400 mt-1">
                Un email de confirmation vous sera envoyé
              </p>
            </div>

            {/* TELEPHONE */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                required
                placeholder="66 XX XX XX"
                className="
                w-full
                border
                border-gray-300
                rounded-xl
                px-5
                py-3
                focus:ring-2
                focus:ring-green-500
                focus:border-transparent
                outline-none
                transition
                "
              />
              <p className="text-xs text-gray-400 mt-1">
                Format: 66 12 34 56 (8 à 12 chiffres)
              </p>
            </div>

            {/* MOT DE PASSE */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Mot de passe <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="motDePasse"
                  value={formData.motDePasse}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-5
                  py-3
                  focus:ring-2
                  focus:ring-green-500
                  focus:border-transparent
                  outline-none
                  transition
                  "
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Confirmer <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmation"
                  value={formData.confirmation}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-5
                  py-3
                  focus:ring-2
                  focus:ring-green-500
                  focus:border-transparent
                  outline-none
                  transition
                  "
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Minimum 6 caractères
            </p>

            {/* BOUTON */}
            <button
              type="submit"
              disabled={loading}
              className="
              w-full
              bg-gradient-to-r
              from-green-600
              to-green-700
              hover:from-green-700
              hover:to-green-800
              text-white
              py-4
              rounded-xl
              font-bold
              transition
              duration-300
              shadow-lg
              disabled:opacity-50
              disabled:cursor-not-allowed
              flex
              items-center
              justify-center
              gap-2
              "
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Création en cours...
                </>
              ) : (
                "Créer mon compte"
              )}
            </button>
          </form>

          {/* CONNEXION */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Vous avez déjà un compte ?
            </p>
            <Link
              to="/connexion"
              className="
              text-green-600
              font-bold
              hover:text-green-700
              hover:underline
              transition
              "
            >
              Se connecter
            </Link>
          </div>

          {/* INFORMATIONS */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl text-center">
            <p className="text-xs text-gray-500">
              En créant un compte, vous acceptez nos conditions d'utilisation
              et notre politique de confidentialité.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}