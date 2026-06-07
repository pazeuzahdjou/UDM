import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, UserCircle } from "lucide-react";
import udmImage from "../assets/images/udm2.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Vérifier l'état de connexion au chargement
  useEffect(() => {
    checkAuthStatus();
    
    // Écouter les changements dans localStorage
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier toutes les 500ms (pour les changements dans la même page)
    const interval = setInterval(() => {
      checkAuthStatus();
    }, 500);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Erreur parsing user:", e);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    setIsLoggedIn(false);
    setUser(null);
    window.dispatchEvent(new Event('storage'));
    navigate("/");
  };

  return (
    <nav
      className="
      bg-blue-950
      text-white
      shadow-xl
      sticky
      top-0
      z-50
      border-b
      border-white/10
      "
    >
      <div
        className="
        max-w-7xl
        mx-auto
        px-6
        py-4
        flex
        items-center
        justify-between
        "
      >
        {/* LOGO + TITRE */}
        <Link
          to="/"
          className="
          flex
          items-center
          gap-4
          "
        >
          <img
            src={udmImage}
            alt="Logo UDM"
            className="
            w-14
            h-14
            object-cover
            rounded-full
            border-2
            border-white
            shadow-lg
            "
          />
          <div>
            <p className="text-sm text-blue-100">
              Université <br />de Moundou
            </p>
          </div>
        </Link>

        {/* MENU DESKTOP */}
        <div className="hidden lg:flex items-center gap-8 text-[16px] font-medium">
          <Link to="/" className="hover:text-yellow-500 transition duration-300">
            Accueil
          </Link>
          <Link to="/universite" className="hover:text-yellow-500 transition duration-300">
            Université
          </Link>
          <Link to="/admission" className="hover:text-yellow-500 transition duration-300">
            Admissions
          </Link>
          <Link to="/recherche" className="hover:text-yellow-500 transition duration-300">
            Recherche
          </Link>
          <Link to="/contact" className="hover:text-yellow-500 transition duration-300">
            Contact
          </Link>

          {/* AFFICHAGE CONDITIONNEL SELON CONNEXION */}
          {isLoggedIn ? (
            <>
              <Link
                to="/admission"
                className="
                bg-orange-500
                hover:bg-orange-600
                text-white
                px-5
                py-3
                rounded-2xl
                font-semibold
                transition
                shadow-lg
                "
              >
                📝 Admission
              </Link>
              
              <Link
                to="/profil"
                className="
                flex
                items-center
                gap-2
                bg-green-600
                hover:bg-green-700
                text-white
                px-5
                py-3
                rounded-2xl
                font-semibold
                transition
                shadow-lg
                "
              >
                <UserCircle size={18} />
                {user?.prenom || user?.nom || 'Mon profil'}
              </Link>
              
              <button
                onClick={handleLogout}
                className="
                flex
                items-center
                gap-2
                bg-red-600
                hover:bg-red-700
                text-white
                px-5
                py-3
                rounded-2xl
                font-semibold
                transition
                shadow-lg
                cursor-pointer
                "
              >
                <LogOut size={18} />
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              to="/connexion"
              className="
              flex
              items-center
              gap-2
              bg-yellow-400
              hover:bg-yellow-300
              text-blue-950
              px-5
              py-3
              rounded-2xl
              font-semibold
              transition
              shadow-lg
              "
            >
              <User size={18} />
              Connexion
            </Link>
          )}
        </div>

        {/* MENU MOBILE BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-white"
        >
          {menuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* MENU MOBILE */}
      {menuOpen && (
        <div className="lg:hidden bg-blue-950 border-t border-white/10 px-6 py-6 flex flex-col gap-5">
          <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-yellow-300 transition">
            Accueil
          </Link>
          <Link to="/universite" onClick={() => setMenuOpen(false)} className="hover:text-yellow-300 transition">
            Université
          </Link>
          <Link to="/admission" onClick={() => setMenuOpen(false)} className="hover:text-yellow-300 transition">
            Admissions
          </Link>
          <Link to="/recherche" onClick={() => setMenuOpen(false)} className="hover:text-yellow-300 transition">
            Recherche
          </Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:text-yellow-300 transition">
            Contact
          </Link>

          {/* MENU MOBILE CONDITIONNEL */}
          {isLoggedIn ? (
            <>
              <Link
                to="/admission"
                onClick={() => setMenuOpen(false)}
                className="bg-orange-500 text-white px-5 py-3 rounded-2xl font-semibold text-center"
              >
                📝 Admission
              </Link>
              <Link
                to="/profil"
                onClick={() => setMenuOpen(false)}
                className="bg-green-600 text-white px-5 py-3 rounded-2xl font-semibold text-center flex items-center justify-center gap-2"
              >
                <UserCircle size={18} />
                {user?.prenom || user?.nom || 'Mon profil'}
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-red-600 text-white px-5 py-3 rounded-2xl font-semibold text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut size={18} />
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              to="/connexion"
              onClick={() => setMenuOpen(false)}
              className="
              flex
              items-center
              justify-center
              gap-2
              bg-yellow-400
              hover:bg-yellow-300
              text-blue-950
              px-5
              py-3
              rounded-2xl
              font-semibold
              transition
              shadow-lg
              mt-4
              "
            >
              <User size={18} />
              Connexion
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}