import { motion } from "framer-motion";
import udmImage from "../assets/images/udm1.png";

export default function Hero() {

  return (

    <section
      className="
      relative
      min-h-screen
      flex
      items-center
      justify-center
      overflow-hidden
      "
    >

      {/* IMAGE PRINCIPALE */}
      <img
        src={udmImage}
        alt="Université de Moundou"
        className="
        absolute
        inset-0
        w-full
        h-full
        object-cover
        "
      />

      {/* OVERLAY */}
      <div
        className="
        absolute
        inset-0
        bg-black/55
        "
      />

      {/* CONTENU */}
      <div
        className="
        relative
        z-10
        max-w-6xl
        mx-auto
        px-6
        text-center
        text-white
        "
      >

        {/* BADGE */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="
          inline-block
          bg-white/10
          backdrop-blur-md
          border
          border-white/20
          px-6
          py-3
          rounded-full
          text-sm
          font-semibold
          tracking-wide
          mb-8
          "
        >

          🎓 Plateforme officielle d’admission universitaire

        </motion.div>

        {/* TITRE */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="
          text-5xl
          md:text-7xl
          font-black
          leading-tight
          mb-8
          "
        >

          Université de Moundou

        </motion.h1>

        {/* DESCRIPTION */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="
          text-lg
          md:text-2xl
          text-gray-200
          max-w-4xl
          mx-auto
          leading-relaxed
          mb-12
          "
        >

          Rejoignez une université moderne,
          innovante et engagée dans
          l’excellence académique,
          la transformation numérique
          et la formation des futurs cadres du Tchad.

        </motion.p>

        {/* BOUTONS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="
          flex
          flex-col
          sm:flex-row
          items-center
          justify-center
          gap-5
          "
        >

          {/* BOUTON INSCRIPTION */}
          <a
            href="/admission"
            className="
            bg-green-700
            hover:bg-blue-600
            px-8
            py-4
            rounded-2xl
            text-lg
            font-semibold
            transition
            shadow-2xl
            "
          >

            Commencer l’inscription

          </a>

          {/* BOUTON FORMATIONS */}
          <a
            href="#formations"
            className="
            bg-black-900
            hover:bg-white/20
            backdrop-blur-md
            border
            border-white/20
            px-8
            py-4
            rounded-2xl
            text-lg
            font-semibold
            transition
            "
          >

            Découvrir les formations

          </a>

        </motion.div>

        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="
          grid
          grid-cols-2
          md:grid-cols-4
          gap-6
          mt-20
          "
        >

          {/* CARD */}
          <div
            className="
            bg-white/10
            backdrop-blur-lg
            border
            border-white/10
            rounded-3xl
            p-6
            shadow-xl
            "
          >

            <h3 className="text-4xl font-extrabold">
              10+
            </h3>

            <p className="text-gray-200 mt-2">
              Filières disponibles
            </p>

          </div>

          {/* CARD */}
          <div
            className="
            bg-white/10
            backdrop-blur-lg
            border
            border-white/10
            rounded-3xl
            p-6
            shadow-xl
            "
          >

            <h3 className="text-4xl font-extrabold">
              5000+
            </h3>

            <p className="text-gray-200 mt-2">
              Étudiants inscrits
            </p>

          </div>

          {/* CARD */}
          <div
            className="
            bg-white/10
            backdrop-blur-lg
            border
            border-white/10
            rounded-3xl
            p-6
            shadow-xl
            "
          >

            <h3 className="text-4xl font-extrabold">
              100%
            </h3>

            <p className="text-gray-200 mt-2">
              Inscription numérique
            </p>

          </div>

          {/* CARD */}
          <div
            className="
            bg-white/10
            backdrop-blur-lg
            border
            border-white/10
            rounded-3xl
            p-6
            shadow-xl
            "
          >

            <h3 className="text-4xl font-extrabold">
              LMD
            </h3>

            <p className="text-gray-200 mt-2">
              Système académique
            </p>

          </div>

        </motion.div>

      </div>

    </section>
  );
}