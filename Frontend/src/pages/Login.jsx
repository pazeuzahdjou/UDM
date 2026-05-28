import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
} from "lucide-react";

import udmImage from "../assets/images/udm2.png";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Effacer l'erreur quand l'utilisateur modifie un champ
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation simple
    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sauvegarder le token et les infos utilisateur
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        setSuccess("Connexion réussie ! Redirection...");
        
        // Rediriger vers la page d'admission après 2 secondes
        setTimeout(() => {
          navigate("/admission");
        }, 1500);
      } else {
        setError(data.message || "Email ou mot de passe incorrect");
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur de connexion au serveur. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-green-900
      via-green-800
      to-black
      flex
      items-center
      justify-center
      px-4
      py-10
      "
    >
      <div
        className="
        w-full
        max-w-6xl
        bg-white
        rounded-3xl
        overflow-hidden
        shadow-2xl
        grid
        lg:grid-cols-2
        "
      >
        {/* SECTION GAUCHE */}
        <div
          className="
          hidden
          lg:flex
          flex-col
          justify-center
          p-16
          bg-gradient-to-br
          from-green-900
          to-green-700
          text-white
          relative
          overflow-hidden
          "
        >
          <div
            className="
            absolute
            top-0
            right-0
            w-72
            h-72
            bg-white/10
            rounded-full
            blur-3xl
            "
          />

          <div className="relative z-10">
            <img
              src={udmImage}
              alt="UDM"
              className="
              w-28
              h-28
              rounded-full
              object-cover
              border-4
              border-white
              shadow-2xl
              mb-8
              "
            />

            <h1
              className="
              text-5xl
              font-extrabold
              leading-tight
              mb-6
              "
            >
              Bienvenue à
              l’Université
              de Moundou
            </h1>

            <p
              className="
              text-green-100
              text-lg
              leading-relaxed
              "
            >
              Connectez-vous pour accéder
              aux services universitaires,
              soumettre vos formulaires
              d’admission et suivre
              votre dossier académique.
            </p>
          </div>
        </div>

        {/* SECTION DROITE */}
        <div
          className="
          p-8
          md:p-14
          flex
          flex-col
          justify-center
          "
        >
          <div className="mb-10">
            <div
              className="
              w-16
              h-16
              rounded-2xl
              bg-green-100
              flex
              items-center
              justify-center
              text-green-800
              mb-6
              "
            >
              <GraduationCap size={32} />
            </div>

            <h2
              className="
              text-4xl
              font-extrabold
              text-gray-900
              mb-3
              "
            >
              Connexion
            </h2>

            <p className="text-gray-600">
              Connectez-vous à votre espace étudiant
            </p>
          </div>

          {/* MESSAGES */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r-xl flex items-center gap-2">
              <span>✅</span> {success}
            </div>
          )}

          {/* FORMULAIRE */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL */}
            <div>
              <label
                className="
                block
                mb-2
                text-sm
                font-semibold
                text-gray-700
                "
              >
                Adresse email
              </label>

              <div
                className="
                flex
                items-center
                border
                border-gray-300
                rounded-2xl
                px-4
                py-4
                focus-within:border-green-500
                focus-within:ring-2
                focus-within:ring-green-100
                transition
                "
              >
                <Mail
                  size={20}
                  className="text-gray-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="exemple@gmail.com"
                  className="
                  w-full
                  ml-3
                  outline-none
                  bg-transparent
                  "
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label
                className="
                block
                mb-2
                text-sm
                font-semibold
                text-gray-700
                "
              >
                Mot de passe
              </label>

              <div
                className="
                flex
                items-center
                border
                border-gray-300
                rounded-2xl
                px-4
                py-4
                focus-within:border-green-500
                focus-within:ring-2
                focus-within:ring-green-100
                transition
                "
              >
                <Lock
                  size={20}
                  className="text-gray-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="
                  w-full
                  ml-3
                  outline-none
                  bg-transparent
                  "
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-500" />
                  ) : (
                    <Eye size={20} className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* OPTIONS */}
            <div
              className="
              flex
              items-center
              justify-between
              text-sm
              "
            >
              <label
                className="
                flex
                items-center
                gap-2
                text-gray-600
                cursor-pointer
                "
              >
                <input type="checkbox" className="rounded" />
                Se souvenir de moi
              </label>

              <Link
                to="/forgot-password"
                className="
                text-green-700
                hover:underline
                "
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* BUTTON */}
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
              rounded-2xl
              font-semibold
              transition
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
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* FOOTER */}
          <div
            className="
            mt-8
            text-center
            text-gray-600
            "
          >
            Vous n’avez pas de compte ?

            <Link
              to="/inscription"
              className="
              text-green-700
              font-semibold
              ml-2
              hover:underline
              "
            >
              Créer un compte
            </Link>
          </div>

          {/* INFORMATIONS */}
          <div className="mt-6 p-3 bg-gray-50 rounded-xl text-center">
            <p className="text-xs text-gray-500">
              Accès sécurisé - Espace étudiant Université de Moundou
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}