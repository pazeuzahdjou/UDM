import { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

export default function Inscription() {
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      formData.motDePasse !==
      formData.confirmation
    ) {
      alert(
        "Les mots de passe ne correspondent pas."
      );
      return;
    }

    console.log(formData);

    alert("Compte créé avec succès !");
  };

  return (
    <MainLayout>
      <section
        className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-100
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
            <h1
              className="
              text-4xl
              font-extrabold
              text-blue-950
              mb-4
              "
            >
              Créer un compte
            </h1>

            <p className="text-gray-600">
              Inscrivez-vous pour accéder
              aux services universitaires.
            </p>
          </div>

          {/* FORMULAIRE */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* NOM */}
            <div>
              <label className="block mb-2 font-semibold">
                Nom
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
                rounded-2xl
                px-5
                py-4
                focus:ring-2
                focus:ring-blue-900
                outline-none
                "
              />
            </div>

            {/* PRENOM */}
            <div>
              <label className="block mb-2 font-semibold">
                Prénom
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
                rounded-2xl
                px-5
                py-4
                focus:ring-2
                focus:ring-blue-900
                outline-none
                "
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block mb-2 font-semibold">
                Adresse email
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
                rounded-2xl
                px-5
                py-4
                focus:ring-2
                focus:ring-blue-900
                outline-none
                "
              />
            </div>

            {/* TELEPHONE */}
            <div>
              <label className="block mb-2 font-semibold">
                Téléphone
              </label>

              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                required
                placeholder="+235 XX XX XX XX"
                className="
                w-full
                border
                border-gray-300
                rounded-2xl
                px-5
                py-4
                focus:ring-2
                focus:ring-blue-900
                outline-none
                "
              />
            </div>

            {/* MOT DE PASSE */}
            <div>
              <label className="block mb-2 font-semibold">
                Mot de passe
              </label>

              <input
                type="password"
                name="motDePasse"
                value={formData.motDePasse}
                onChange={handleChange}
                required
                placeholder="********"
                className="
                w-full
                border
                border-gray-300
                rounded-2xl
                px-5
                py-4
                focus:ring-2
                focus:ring-blue-900
                outline-none
                "
              />
            </div>

            {/* CONFIRMATION */}
            <div>
              <label className="block mb-2 font-semibold">
                Confirmer le mot de passe
              </label>

              <input
                type="password"
                name="confirmation"
                value={formData.confirmation}
                onChange={handleChange}
                required
                placeholder="********"
                className="
                w-full
                border
                border-gray-300
                rounded-2xl
                px-5
                py-4
                focus:ring-2
                focus:ring-blue-900
                outline-none
                "
              />
            </div>

            {/* BOUTON */}
            <button
              type="submit"
              className="
              w-full
              bg-blue-950
              hover:bg-blue-800
              text-white
              py-4
              rounded-2xl
              font-bold
              transition
              duration-300
              shadow-lg
              "
            >
              Créer mon compte
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
              text-blue-900
              font-bold
              hover:underline
              "
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}