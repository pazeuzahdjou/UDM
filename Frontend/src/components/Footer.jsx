export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid md:grid-cols-3 gap-10">

          {/* Logo / Présentation */}
          <div>
            <h2 className="text-3xl font-bold mb-4 text-green-400">
              Université de Moundou
            </h2>

            <p className="text-gray-300 leading-relaxed">
              Plateforme numérique officielle de gestion des inscriptions et des réinscription
              universitaires et des services académiques.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Liens rapides
            </h3>

            <ul className="space-y-3 text-gray-300">
              <li>
                <a href="#formations" className="hover:text-green-400 transition">
                  Formations
                </a>
              </li>

              <li>
                <a href="#inscription" className="hover:text-green-400 transition">
                  Inscriptions
                </a>
              </li>

              <li>
                <a href="#contact" className="hover:text-green-400 transition">
                  Contact
                </a>
              </li>



              <li>
                <a href="https://www.univ-mdou.org/" className="hover:text-green-400 transition">
                  Université
                </a>
              </li>

               <li>
                <a href="https://www.facebook.com/UniversiteMoundou" className="hover:text-green-400 transition">
                  facebook
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Contact
            </h3>

            <div className="space-y-2 text-gray-300">
              <p>Moundou - Tchad</p>
              <p>BP 206</p>
              <p>(+235) 63 89 98 36</p>
              <p>contact@univ-moundou.td</p>
            </div>
          </div>

        </div>

        {/* Bas du footer */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
          <p>
            © 2026 Université de Moundou — Tous droits réservés.
          </p>
        </div>

      </div>

    </footer>
  );
}