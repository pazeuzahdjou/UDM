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

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

   

    navigate("/");
  };

  return (

    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-blue-950
      via-blue-900
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
          from-blue-900
          to-blue-700
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
              text-blue-100
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
              bg-blue-100
              flex
              items-center
              justify-center
              text-blue-900
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

          {/* FORMULAIRE */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

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
                focus-within:border-blue-600
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
                focus-within:border-blue-600
                transition
                "
              >

                <Lock
                  size={20}
                  className="text-gray-400"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
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
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >

                  {showPassword ? (
                    <EyeOff
                      size={20}
                      className="text-gray-500"
                    />
                  ) : (
                    <Eye
                      size={20}
                      className="text-gray-500"
                    />
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
                "
              >

                <input type="checkbox" />

                Se souvenir de moi

              </label>

              <Link
                to="/forgot-password"
                className="
                text-blue-700
                hover:underline
                "
              >
                Mot de passe oublié ?
              </Link>

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="
              w-full
              bg-blue-900
              hover:bg-blue-800
              text-white
              py-4
              rounded-2xl
              font-semibold
              transition
              shadow-lg
              "
            >
              Se connecter
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
              to="/register"
              className="
              text-blue-700
              font-semibold
              ml-2
              hover:underline
              "
            >
              Créer un compte
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}