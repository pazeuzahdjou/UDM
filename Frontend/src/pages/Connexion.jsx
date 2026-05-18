import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Connexion() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const res = await API.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Connexion réussie");

      navigate("/");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Erreur de connexion"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="
    min-h-screen
    flex
    items-center
    justify-center
    bg-gray-100
    px-4
    ">

      <div className="
      bg-white
      shadow-2xl
      rounded-2xl
      w-full
      max-w-md
      p-8
      ">

        <h1 className="
        text-3xl
        font-bold
        text-center
        text-blue-950
        mb-2
        ">
          Connexion
        </h1>

        <p className="
        text-center
        text-gray-500
        mb-8
        ">
          Connectez-vous à votre compte
        </p>

        <form
          onSubmit={handleLogin}
          className="
          space-y-5
          "
        >

          {/* EMAIL */}
          <div>

            <label className="
            block
            mb-2
            font-medium
            text-gray-700
            ">
              Email
            </label>

            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              className="
              w-full
              border
              border-gray-300
              rounded-lg
              px-4
              py-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-700
              "
            />

          </div>

          {/* PASSWORD */}
          <div>

            <label className="
            block
            mb-2
            font-medium
            text-gray-700
            ">
              Mot de passe
            </label>

            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              className="
              w-full
              border
              border-gray-300
              rounded-lg
              px-4
              py-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-700
              "
            />

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
            w-full
            bg-blue-950
            hover:bg-blue-800
            transition
            duration-300
            text-white
            py-3
            rounded-lg
            font-semibold
            "
          >
            {
              loading
              ? "Connexion..."
              : "Se connecter"
            }
          </button>

        </form>

        {/* REGISTER */}
        <p className="
        mt-6
        text-center
        text-gray-600
        ">

          Pas encore de compte ?

          <Link
            to="/register"
            className="
            text-blue-800
            font-semibold
            ml-2
            hover:underline
            "
          >
            Créer un compte
          </Link>

        </p>

      </div>

    </div>
  );
}