import { useState, useEffect } from "react";
import Hero from "../components/Hero";
import udmImage from "../assets/images/udm1.png";
import udmCampus from "../assets/images/udm3.png";

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const statistiques = [
    { valeur: "10+", titre: "Filières disponibles", icon: "📚", description: "Programmes diversifiés" },
    { valeur: "5000+", titre: "Étudiants inscrits", icon: "👨‍🎓", description: "Communauté active" },
    { valeur: "100%", titre: "Inscription numérique", icon: "💻", description: "100% en ligne" },
    { valeur: "LMD", titre: "Système académique", icon: "🎓", description: "Standards internationaux" },
    { valeur: "98%", titre: "Taux de réussite", icon: "🏆", description: "Excellence académique" },
    { valeur: "50+", titre: "Enseignants", icon: "👨‍🏫", description: "Experts qualifiés" }
  ];

  const formations = [
    { titre: "Informatique", icon: "💻", description: "Données et Intelligences, Java, Administration réseau", color: "from-blue-500 to-cyan-500", details: "Licence/Master" },
    { titre: "Gestion", icon: "📊", description: "Finance, marketing, RH, Recherche Opérationnelle", color: "from-green-500 to-emerald-500", details: "Licence/Master" },
    { titre: "Droit", icon: "⚖️", description: "Droit des affaires, droit public, carrières judiciaires", color: "from-purple-500 to-indigo-500", details: "Licence" },
    { titre: "Mathématiques", icon: "📐", description: "Statistiques, modélisation, data science", color: "from-orange-500 to-red-500", details: "Licence" },
    { titre: "Physique", icon: "🔬", description: "Physique appliquée, Physique nucléaire", color: "from-cyan-500 to-blue-500", details: "Licence" },
    { titre: "Biologie", icon: "🧬", description: "Biotechnologies, Biologie Végétale", color: "from-emerald-500 to-green-500", details: "Licence" },
    { titre: "Chimie", icon: "⚗️", description: "Chimie industrielle, pharmacie, matériaux", color: "from-teal-500 to-cyan-500", details: "Licence" },
    { titre: "Télécommunications", icon: "📡", description: "Réseaux, 5G, IoT, fibre optique", color: "from-indigo-500 to-purple-500", details: "Licence" },
    { titre: "Géographie", icon: "⛰️", description: "Exploitation environnementale, climatologie, urbanisme", color: "from-green-500 to-orange-500", details: "Licence/Master" },
    { titre: "Comptabilité & Finance", icon: "⛰️", description: "Moyen technique de la comptabilité et finace, ", color: "from-amber-500 to-orange-500", details: "Licence" },
    { titre: "Economie Monaitaire et Banquaire", icon: "⛰️", description: "Etude de la monnaie électronique et de billets de banque", color: "from-amber-500 to-orange-500", details: "Licence" }
  ];

  const actualites = [
    {
      id: 1,
      categorie: "📢 Admission",
      date: "01 Septembre 2026",
      titre: "Ouverture officielle des préinscriptions académiques",
      description: "Les nouveaux étudiants peuvent désormais effectuer leur préinscription en ligne via la plateforme universitaire. Les inscriptions sont ouvertes jusqu'au 31 Décembre 2026.",
      image: "../assets/images/femine.png",
      auteur: "Service Admissions"
    },
    {
      id: 2,
      categorie: "🚀 Innovation",
      date: "16 Mai 2026",
      titre: "Lancement du portail numérique étudiant",
      description: "Une plateforme digitale révolutionnaire facilite désormais l’accès aux services universitaires, aux cours en ligne et à la gestion administrative.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600",
      auteur: "Direction Digital"
    },
    {
      id: 3,
      categorie: "🎓 Formation",
      date: "Janvier 2026",
      titre: "Nouvelle filière Intelligence Artificielle",
      description: "L’université élargit ses programmes avec des filières modernes dédiées à l'IA, à la science des données et à l'administration réseau.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600",
      auteur: "Faculté des Sciences"
    },
    {
      id: 4,
      categorie: "🏆 Distinction",
      date: "10 Juin 2026",
      titre: "L'Université primée pour l'innovation digitale",
      description: "L'Université de Moundou a reçu le prix de l'innovation numérique pour sa plateforme d'admission 100% en ligne.",
      image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600",
      auteur: "Prix de l'Innovation"
    }
  ];

  const temoignages = [
    {
      nom: "Falmata Mahamat",
      role: "Étudiante en Master Informatique",
      image: "",
      texte: "L'Université de Moundou m'a offert une formation de qualité avec des infrastructures modernes. Les enseignants sont à l'écoute et très compétents.",
      note: 5
    },
    {
      nom: "Yannick YAMTE",
      role: "Diplômé en administration réseau",
      image: "",
      texte: "Grâce à ma formation à l'UDM, j'ai pu intégrer rapidement le monde professionnel. Les stages et projets pratiques m'ont beaucoup aidé.",
      note: 5
    },
    {
      nom: "Loupma Emile",
      role: "Développeur fullstack",
      image: "",
      texte: "Un encadrement exceptionnel pour la recherche. Les laboratoires sont bien équipés et les collaborations internationales sont nombreuses.",
      note: 5
    }
  ];

  const events = [
    { date: "15 Oct", jour: "15", mois: "OCT", titre: "Rentrée académique", lieu: "Grand Amphithéâtre", heure: "09h00" },
    { date: "20 Nov", jour: "20", mois: "NOV", titre: "Journée Portes Ouvertes", lieu: "Campus Universitaire", heure: "10h-17h" },
    { date: "05 Déc", jour: "05", mois: "DÉC", titre: "Conférence sur l'IA", lieu: "Salle de Conférence", heure: "14h00" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % temoignages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-white overflow-x-hidden">
      
      <Hero />

      {/* SECTION STATISTIQUES */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
              L'Université en quelques <span className="text-green-600">chiffres</span>
            </h2>
            <p className="text-gray-900 max-w-2xl mx-auto mt-4">
              Découvrez les performances et l'impact de notre institution
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {statistiques.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-3xl font-extrabold text-green-600 mb-2">{item.valeur}</h3>
                <p className="font-semibold text-gray-800 text-sm">{item.titre}</p>
                <p className="text-xs text-gray-400 mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION PRÉSENTATION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl opacity-20 group-hover:opacity-30 transition duration-500 blur-xl"></div>
              <img
                src={udmImage}
                alt="Université de Moundou"
                className="relative w-full h-[500px] object-cover rounded-3xl shadow-2xl group-hover:scale-[1.02] transition duration-500"
              />
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
                Une institution moderne <br/>
                <span className="text-green-600">tournée vers l'avenir</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                L'Université de Moundou accompagne les étudiants dans une formation académique moderne adaptée aux besoins professionnels et technologiques actuels.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-3"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">✅</div><span className="text-gray-700">Formation de qualité</span></div>
                <div className="flex items-center gap-3"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">🌍</div><span className="text-gray-700">Partenariats internationaux</span></div>
                <div className="flex items-center gap-3"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">💡</div><span className="text-gray-700">Innovation pédagogique</span></div>
              </div>
              <div className="flex flex-wrap gap-4">
                <a href="/admission" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl font-semibold transition shadow-lg transform hover:scale-105">S'inscrire maintenant</a>
                <a href="#formations" className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 rounded-xl font-semibold transition">Explorer les formations</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="formations" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          
        
          <div className="text-center mb-16">
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Des formations qui vous <span className="text-green-600">ressemblent</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Que vous soyez passionné par les chiffres, les codes, la nature ou les hommes, 
              vous trouverez votre place parmi nos 9 filières d'excellence.
            </p>
            <div className="flex justify-center gap-2 mt-6">
              <div className="w-12 h-1 bg-green-500 rounded-full"></div>
              <div className="w-4 h-1 bg-gray-300 rounded-full"></div>
              <div className="w-4 h-1 bg-gray-300 rounded-full"></div>
            </div>
          </div>

          {/* Grille des formations */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {formations.map((formation, index) => (
              <div 
                key={index} 
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              >
                <div className={`h-2 bg-gradient-to-r ${formation.color}`}></div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${formation.color} rounded-2xl flex items-center justify-center text-3xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      {formation.icon}
                    </div>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-500">
                      {formation.details}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition">
                    {formation.titre}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {formation.description}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-green-500 text-sm">✨</span>
                        <span className="text-xs text-gray-400">+ de 200 étudiants formés</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message de conseil personnalisé */}
          <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center border border-green-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="text-left">
                  <h4 className="font-bold text-gray-800">Dans le cas où vous auriez besoin d'une orientation</h4>
                  <p className="text-gray-500 text-sm">Nos conseillers pédagogiques sont là pour vous guider</p>
                </div>
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-md hover:shadow-lg flex items-center gap-2">
                <span>📞</span> Prendre rendez-vous
              </button>
            </div>
          </div>

          {/* Statistiques des débouchés */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-xl hover:bg-green-50 transition group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition">💼</div>
              <p className="font-bold text-gray-800 text-xl">92%</p>
              <p className="text-xs text-gray-400">d'insertion professionnelle</p>
            </div>
            <div className="text-center p-4 rounded-xl hover:bg-green-50 transition group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition">🌍</div>
              <p className="font-bold text-gray-800 text-xl">15+</p>
              <p className="text-xs text-gray-400">partenaires internationaux</p>
            </div>
            <div className="text-center p-4 rounded-xl hover:bg-green-50 transition group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition">🏆</div>
              <p className="font-bold text-gray-800 text-xl">3</p>
              <p className="text-xs text-gray-400">lauréats aux concours</p>
            </div>
            <div className="text-center p-4 rounded-xl hover:bg-green-50 transition group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition">📚</div>
              <p className="font-bold text-gray-800 text-xl">2000+</p>
              <p className="text-xs text-gray-400">diplômés depuis la création</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION ACTUALITÉS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block bg-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">📰 Dernières actualités</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Actualités universitaires</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">Restez informés des dernières annonces et événements</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {actualites.map((actu) => (
              <div key={actu.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row">
                <div className="md:w-2/5 h-48 md:h-auto overflow-hidden">
                  <img src={actu.image} alt={actu.titre} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                </div>
                <div className="md:w-3/5 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">{actu.categorie}</span>
                    <span className="text-xs text-gray-400">{actu.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">{actu.titre}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{actu.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Par {actu.auteur}</span>
                    <button className="text-green-600 font-semibold text-sm hover:text-green-700 transition">Lire plus →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold transition">Voir toutes les actualités →</button>
          </div>
        </div>
      </section>

      {/* SECTION CAMPUS & INFRASTRUCTURES */}
      <section className="py-24 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold mb-6">Campus moderne</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Un cadre d'étude exceptionnel</h2>
              <p className="text-blue-200 text-lg leading-relaxed mb-8">Notre campus dispose d'infrastructures modernes pour offrir aux étudiants les meilleures conditions d'apprentissage.</p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3"><div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">📚</div><div><p className="font-bold">Bibliothèque digitale</p><p className="text-sm text-blue-200">15.000+ ouvrages</p></div></div>
                <div className="flex items-center gap-3"><div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">💻</div><div><p className="font-bold">Laboratoires high-tech</p><p className="text-sm text-blue-200">Équipements modernes</p></div></div>
                <div className="flex items-center gap-3"><div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🏀</div><div><p className="font-bold">Complexe sportif</p><p className="text-sm text-blue-200">Divers domaines sportifs</p></div></div>
                <div className="flex items-center gap-3"><div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🍽️</div><div><p className="font-bold">Restaurant universitaire</p><p className="text-sm text-blue-200">Service continu</p></div></div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl opacity-30 group-hover:opacity-50 transition blur-2xl"></div>
              <img src={udmCampus} alt="Campus universitaire" className="relative rounded-3xl shadow-2xl w-full h-[400px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION TÉMOIGNAGES */}
      <section className="py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">⭐ Témoignages</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Ce que disent nos étudiants</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">Des parcours réussis et des carrières prometteuses</p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
              <div className="relative">
                <div className="text-8xl text-green-200 mb-4">“</div>
                <p className="text-gray-700 text-lg italic leading-relaxed mb-8">{temoignages[currentTestimonial].texte}</p>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl">👤</div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800">{temoignages[currentTestimonial].nom}</p>
                    <p className="text-sm text-gray-500">{temoignages[currentTestimonial].role}</p>
                  </div>
                </div>
                <div className="flex justify-center gap-2">
                  <div className="text-yellow-400 text-xl">{"★".repeat(temoignages[currentTestimonial].note)}</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {temoignages.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentTestimonial(idx)} className={`w-2 h-2 rounded-full transition-all duration-300 ${currentTestimonial === idx ? "w-8 bg-green-600" : "bg-gray-300"}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION ÉVÉNEMENTS & NEWSLETTER */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2"><span>📅</span> Prochains événements</h2>
              <div className="space-y-4">
                {events.map((event, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:shadow-md transition">
                    <div className="text-center min-w-[80px]">
                      <div className="text-2xl font-bold text-green-600">{event.jour}</div>
                      <div className="text-xs text-gray-500">{event.mois}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{event.titre}</h3>
                      <p className="text-sm text-gray-500">{event.lieu}</p>
                    </div>
                    <div className="text-sm text-green-600 font-semibold">{event.heure}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-400 rounded-3xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">Ne manquez aucune actualité</h3>
              <p className="text-green-100 mb-6">Inscrivez-vous à notre newsletter</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="email" placeholder="Votre email" className="flex-1 px-4 py-3 rounded-xl text-gray-800 outline-none" />
                <button className="bg-white text-green-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition">S'abonner</button>
              </div>
              <p className="text-xs text-green-200 mt-4">N'hésitez vraiment pas ! vous n'allez pas regretter</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle, #10b981 1px, transparent 1px);
          background-size: 30px 30px;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </main>
  );
}