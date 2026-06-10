import { useState, useEffect } from "react";
import SectionTitle from "../components/SectionTitle";
import udmaMd1 from "../assets/images/md1.png"

export default function Recherche() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProjet, setSelectedProjet] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Slides pour le carrousel principal
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=1200",
      title: "Laboratoire d'Innovation Technologique",
      subtitle: "Des équipements de pointe pour la recherche",
      description: "Découvrez nos laboratoires modernes équipés des dernières technologies"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200",
      title: "Recherche Environnementale",
      subtitle: "Solutions durables pour l'avenir",
      description: "Nos chercheurs travaillent sur les défis climatiques et environnementaux"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200",
      title: "Collaboration Internationale",
      subtitle: "Partenariats académiques mondiaux",
      description: "Des échanges scientifiques avec les meilleures universités mondiales"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200",
      title: "Transformation Digitale",
      subtitle: "L'innovation au service de l'éducation",
      description: "Développement de solutions numériques pour l'enseignement"
    }
  ];

  // Projets de recherche (inchangé)
  const projetsRecherche = [
    {
      id: 1,
      titre: "Intelligence Artificielle pour l'Agriculture",
      domaine: "Technologie",
      chef: "Dr.Aside Christian",
      equipe: 8,
      budget: "150M FCFA",
      duree: "2025-2028",
      status: "En cours",
      description: "Développement de solutions IA pour optimiser les rendements agricoles au Tchad.",
      image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600"
    },
    {
      id: 2,
      titre: "Énergies Renouvelables en Zone Rurale",
      domaine: "Environnement",
      chef: "Pr.MBAINAIBEYE Jérome ",
      equipe: 12,
      budget: "250M FCFA",
      duree: "2025-2028",
      status: "En cours",
      description: "Installation de mini-réseaux solaires dans les zones rurales du Sud Tchad.",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600"
    },
    {
      id: 3,
      titre: "Télémédecine et Santé Digitale",
      domaine: "Santé",
      chef: "Dr. Naimoun",
      equipe: 15,
      budget: "200M FCFA",
      duree: "2024-2028",
      status: "Démarrage",
      description: "Plateforme de consultation médicale à distance pour zones reculées.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600"
    },
    {
      id: 4,
      titre: "Biodiversité et Conservation",
      domaine: "Environnement",
      chef: "Dr.Franklin",
      equipe: 10,
      budget: "180M FCFA",
      duree: "2023-2027",
      status: "En cours",
      description: "Étude et préservation des espèces menacées dans les parcs nationaux.",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600"
    },
    {
      id: 5,
      titre: "udm Campus - Université Connectée",
      domaine: "Technologie",
      chef: "Dr.Octave",
      equipe: 20,
      budget: "300M FCFA",
      duree: "2026-2030",
      status: "Planification",
      description: "Transformation numérique complète du campus universitaire.",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?w=600"
    },
    {
      id: 6,
      titre: "Économie Circulaire et Développement Durable",
      domaine: "Économie",
      chef: "Mr.Ali",
      equipe: 7,
      budget: "100M FCFA",
      duree: "2024-2028",
      status: "En cours",
      description: "Modèles économiques circulaires pour les petites entreprises.",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600"
    }
  ];

  // Publications récentes (inchangé)
  const publications = [
    {
      id: 1,
      titre: "Impact du changement climatique sur l'agriculture au Sahel",
      auteurs: "Degoto fréderic., Palouma éric., Djondené delly.",
      revue: "Le journal africain et la science environnementale",
      annee: 2025,
      citations: 15,
      lien: "#"
    },
    {
      id: 2,
      titre: "Intelligence artificielle pour la prédiction des maladies",
      auteurs: "Dr.adrien., Mr.DELLY., M.Josué",
      revue: "Le journal de la recherche médical",
      annee: 2025,
      citations: 25,
      lien: "#"
    },
    {
      id: 3,
      titre: "Energies renouvelables et développement rural",
      auteurs: "Djonba Ferkalbo., Lakdjolbo Julien., Neumambé ChristiantS.",
      revue: "énergie rénouvelabe",
      annee: 2023,
      citations: 37,
      lien: "#"
    },
    {
      id: 4,
      titre: "Digitalisation de l'enseignement supérieur en Afrique",
      auteurs: "Mr.Moyellbaye., Mr.Mantangare., Mr.Adoum.",
      revue: "La Technologie éducative en Afrique",
      annee: 2024,
      citations: 28,
      lien: "#"
    }
  ];

  // Événements scientifiques (inchangé)
  const evenements = [
    {
      id: 1,
      titre: "Débat International sur le Réseau 5G",
      date: "15-17 Mars 2025",
      lieu: "Université de Moundou",
      theme: "Problème de la connexion en Afrique et au Tchad"
    },
    {
      id: 2,
      titre: "Journées de la Recherche Scientifique",
      date: "20-22 Mai 2025",
      lieu: "Grand Amphithéâtre",
      theme: "Innovation et Développement Durable"
    },
    {
      id: 3,
      titre: "Atelier sur les Énergies Renouvelables",
      date: "10 Juin 2025",
      lieu: "Laboratoire d'Énergie",
      theme: "Solutions vertes pour demain"
    }
  ];

  // ============ NOUVEAUX DOMAINES D'EXCELLENCE - DESIGN MODERNE ============
  const domaines = [
    {
      id: 1,
      titre: "Innovation Technologique",
      icon: "💡",
      description: "Développement de solutions digitales et systèmes intelligents pour répondre aux défis locaux.",
      couleur: "from-blue-500 to-cyan-500",
      stats: "12 projets actifs",
      bg: "bg-gradient-to-br from-blue-50 to-cyan-50"
    },
    {
      id: 2,
      titre: "Partenariats Académiques",
      icon: "🤝",
      description: "Collaborations internationales pour renforcer la recherche et les échanges scientifiques.",
      couleur: "from-green-500 to-emerald-500",
      stats: "10 partenaires",
      bg: "bg-gradient-to-br from-green-50 to-emerald-50"
    },
    {
      id: 3,
      titre: "Recherche Environnementale",
      icon: "🌍",
      description: "Études sur le climat, la prévision météorologique, l'agriculture durable et la protection des ressources naturelles.",
      couleur: "from-emerald-500 to-teal-500",
      stats: "8 projets",
      bg: "bg-gradient-to-br from-emerald-50 to-teal-50"
    },
    {
      id: 4,
      titre: "Transformation Numérique",
      icon: "🖥️",
      description: "Modernisation des processus éducatifs et administratifs via les technologies digitales.",
      couleur: "from-purple-500 to-pink-500",
      stats: "5 plateformes",
      bg: "bg-gradient-to-br from-purple-50 to-pink-50"
    },
    {
      id: 5,
      titre: "Sciences de la Santé",
      icon: "🏥",
      description: "Recherche médicale et développement de solutions de santé publique.",
      couleur: "from-red-500 to-rose-500",
      stats: "10 projets",
      bg: "bg-gradient-to-br from-red-50 to-rose-50"
    },
    {
      id: 6,
      titre: "Innovation Sociale",
      icon: "👥",
      description: "Projets communautaires pour l'inclusion et le développement social.",
      couleur: "from-orange-500 to-amber-500",
      stats: "6 projets",
      bg: "bg-gradient-to-br from-orange-50 to-amber-50"
    }
  ];

  const statistiques = [
    { valeur: "15+", titre: "Laboratoires", icon: "🔬", description: "Équipements modernes" },
    { valeur: "50+", titre: "Chercheurs", icon: "👨‍🔬", description: "Experts qualifiés" },
    { valeur: "25+", titre: "Projets", icon: "📊", description: "En cours" },
    { valeur: "10+", titre: "Partenariats", icon: "🌐", description: "Internationalx" },
    { valeur: "120+", titre: "Publications", icon: "📚", description: "Articles scientifiques" },
    { valeur: "50M+", titre: "Financement", icon: "💰", description: "FCFA levés" }
  ];

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const openModal = (projet) => {
    setSelectedProjet(projet);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'En cours': return 'bg-green-100 text-green-700';
      case 'Avancé': return 'bg-blue-100 text-blue-700';
      case 'Démarrage': return 'bg-yellow-100 text-yellow-700';
      case 'Planification': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      
      {/* SLIDER PRINCIPAL (inchangé) */}
      <div className="relative h-screen max-h-[700px] overflow-hidden">
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute w-full h-full transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="absolute inset-0 bg-black/50 z-10"></div>
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-6">
                <div className="max-w-4xl animate-fadeInUp">
                  <span className="inline-block bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                    Centre de Recherche
                  </span>
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-200 mb-4">
                    {slide.subtitle}
                  </p>
                  <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={prevSlide} className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition">←</button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition">→</button>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, index) => (
            <button key={index} onClick={() => setCurrentSlide(index)} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "w-8 bg-white" : "bg-white/50"}`} />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        
        {/* TITRE SECTION */}
        <div className="text-center mb-16">
          <SectionTitle title="Recherche & Innovation" />
          <p className="text-gray-600 max-w-3xl mx-auto mt-4 text-lg">
            L'Université de Moundou se positionne comme un pôle d'excellence scientifique au service du développement
          </p>
        </div>

        {/* STATISTIQUES */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-20">
          {statistiques.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="text-3xl font-bold text-green-700 mb-2">{item.valeur}</h3>
              <p className="font-semibold text-gray-800">{item.titre}</p>
              <p className="text-xs text-gray-400 mt-1">{item.description}</p>
            </div>
          ))}
        </div>

        {/* ============ NOUVEAUX DOMAINES D'EXCELLENCE (DESIGN MODERNE) ============ */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🔬 Excellence scientifique
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Domaines d'Excellence</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto mt-3">
              Des axes de recherche stratégiques pour répondre aux défis du Tchad et de l'Afrique
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {domaines.map((item, index) => (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer"
              >
                {/* Bande colorée en haut */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${item.couleur}`}></div>
                
                <div className="p-6">
                  {/* Icône avec animation */}
                  <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center text-3xl mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <span>{item.icon}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition">
                    {item.titre}
                  </h3>
                  
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>
                  
                  {/* Badge statistique */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    {item.stats}
                  </div>
                  
                  {/* Ligne animée au hover */}
                  <div className="mt-4 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PROJETS DE RECHERCHE */}
        <div className="mb-24">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Projets de Recherche</h2>
            <button className="text-green-600 font-semibold hover:text-green-700">Voir tous →</button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projetsRecherche.map((projet) => (
              <div
                key={projet.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                onClick={() => openModal(projet)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={projet.image} alt={projet.titre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(projet.status)}`}>
                      {projet.status}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{projet.titre}</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    <span className="font-semibold">Chef de projet:</span> {projet.chef}
                  </p>
                  <p className="text-gray-600 line-clamp-2 mb-4">{projet.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-green-600 font-semibold">{projet.budget}</span>
                    <span className="text-gray-400">{projet.duree}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PUBLICATIONS & ÉVÉNEMENTS */}
        <div className="grid lg:grid-cols-2 gap-10 mb-24">
          <div>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">📄 Publications Scientifiques</h2>
            <div className="space-y-4">
              {publications.map((pub) => (
                <div key={pub.id} className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition">
                  <h3 className="font-bold text-gray-800 mb-2">{pub.titre}</h3>
                  <p className="text-sm text-gray-600 mb-2">{pub.auteurs}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{pub.revue} • {pub.annee}</span>
                    <span className="text-sm text-green-600">📊 {pub.citations} citations</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">📅 Événements Scientifiques</h2>
            <div className="space-y-4">
              {evenements.map((event) => (
                <div key={event.id} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-5 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">📌</div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">{event.titre}</h3>
                      <p className="text-sm text-gray-600 mb-1">📅 {event.date}</p>
                      <p className="text-sm text-gray-600">📍 {event.lieu}</p>
                      <p className="text-xs text-gray-500 mt-2">🎯 {event.theme}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PARTENAIRES */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Nos Partenaires Académiques</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { nom: "Université de N'Djaména", logo: "🏛️" },
              { nom: "AUF", logo: "🌍" },
              { nom: "Banque Mondiale", logo: "🏦" },
              { nom: "UE", logo: "🇪🇺" },
            ].map((part, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition group">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{part.logo}</div>
                <p className="font-semibold text-gray-700">{part.nom}</p>
              </div>
            ))}
          </div>
        </div>

        {/* APPEL À ACTION */}
        <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-3xl p-12 text-white text-center shadow-2xl">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Rejoignez nos équipes de recherche</h2>
            <p className="text-green-100 mb-8 text-lg">
              Vous êtes chercheur, doctorant ou partenaire ? Contribuez à l'avancement de la science.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-green-700 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition shadow-lg">
                Proposer un projet
              </button>
              <button className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-xl font-semibold transition">
                Devenir partenaire
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL PROJET */}
      {showModal && selectedProjet && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={closeModal}>
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-64 overflow-hidden">
              <img src={selectedProjet.image} alt={selectedProjet.titre} className="w-full h-full object-cover" />
              <button onClick={closeModal} className="absolute top-4 right-4 bg-black/50 text-white w-10 h-10 rounded-full hover:bg-black/70 transition">✕</button>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedProjet.titre}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedProjet.status)}`}>
                  {selectedProjet.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <div><p className="text-sm text-gray-500">Chef de projet</p><p className="font-semibold">{selectedProjet.chef}</p></div>
                <div><p className="text-sm text-gray-500">Équipe</p><p className="font-semibold">{selectedProjet.equipe} chercheurs</p></div>
                <div><p className="text-sm text-gray-500">Budget</p><p className="font-semibold text-green-600">{selectedProjet.budget}</p></div>
                <div><p className="text-sm text-gray-500">Durée</p><p className="font-semibold">{selectedProjet.duree}</p></div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">{selectedProjet.description}</p>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition">
                Contacter l'équipe
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 1s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}