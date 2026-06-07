import { useState, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef } from "react";
import udmImage from "../assets/images/udm3.png";
import feminieImage from "../assets/images/femine.png";
import SectionTitle from "../components/SectionTitle";
import campuceImages from "../assets/images/campuce.png"

export default function Universite() {
  const [scrolled, setScrolled] = useState(false);
  const [activeStat, setActiveStat] = useState(null);
  
  // Références pour animations
  const statsRef = useRef(null);
  const valeursRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const isValeursInView = useInView(valeursRef, { once: true, amount: 0.3 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const valeurs = [
    {
      id: 1,
      icon: "🎓",
      titre: "Excellence académique",
      description: "Une formation universitaire de qualité adaptée aux standards internationaux du système LMD.",
      color: "from-blue-500 to-indigo-600",
      delay: 0
    },
    {
      id: 2,
      icon: "💻",
      titre: "Transformation numérique",
      description: "L'université modernise progressivement ses services grâce à la digitalisation académique et administrative.",
      color: "from-green-500 to-emerald-600",
      delay: 0.1
    },
    {
      id: 3,
      icon: "🔬",
      titre: "Recherche scientifique",
      description: "Les enseignants-chercheurs participent activement aux projets scientifiques et technologiques.",
      color: "from-purple-500 to-pink-600",
      delay: 0.2
    },
    {
      id: 4,
      icon: "👩‍🎓",
      titre: "Promotion féminine",
      description: "L'Université encourage fortement la participation des femmes dans toutes les facultés et filières.",
      color: "from-rose-500 to-red-600",
      delay: 0.3
    },
  ];

  const statistiques = [
    { valeur: "5000+", titre: "Étudiants", icon: "👨‍🎓", color: "from-blue-500 to-cyan-500" },
    { valeur: "20+", titre: "Filières", icon: "📚", color: "from-green-500 to-emerald-500" },
    { valeur: "300+", titre: "Diplômés par an", icon: "🎓", color: "from-orange-500 to-red-500" },
    { valeur: "10+", titre: "Partenariats", icon: "🤝", color: "from-purple-500 to-pink-500" },
  ];

  // Animation des compteurs
  const Counter = ({ target, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    useEffect(() => {
      if (isInView) {
        let start = 0;
        const duration = 2000;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);
        return () => clearInterval(timer);
      }
    }, [isInView, target]);

    return <span ref={ref}>{count}{suffix}</span>;
  };

  return (
    <div className="overflow-x-hidden">
      
      {/* HERO SECTION AVEC PARALLAXE */}
      <section className="relative h-screen max-h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={campuceImages}
            alt="Université de Moundou"
            className="w-full h-full object-cover scale-110"
            style={{ transform: `scale(${1 + scrolled * 0.002})` }}
          />
        
        </div>
        
        {/* Cercles décoratifs */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-green-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl"
          >
            
            <h1 className="text-5xl md:text-8xl font-bold text-white mb-8 leading-tight drop-shadow-2xl">
              Université de <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                Moundou
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
              Une institution publique moderne, innovante et engagée dans la formation
              des cadres du Tchad ainsi que dans la transformation numérique
              de l'enseignement supérieur.
            </p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex gap-4 justify-center"
            >
              <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-full font-semibold transition shadow-lg hover:scale-105">
                📝 S'inscrire
              </button>
              <button className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-full font-semibold transition">
                🔍 En savoir plus
              </button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Indicateur de scroll */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2 animate-scrollDot"></div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20">
        
        {/* SECTION TITRE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            À propos de l'université
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            Présentation de l'<span className="text-green-600">Université</span>
          </h2>
          <div className="w-24 h-1 bg-green-600 mx-auto mt-6 rounded-full"></div>
        </motion.div>

        {/* CARTE PRÉSENTATION */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-2xl p-10 md:p-14 mb-20 hover:shadow-3xl transition-all duration-500"
        >
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="flex-1">
              
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                Une université tournée vers l'avenir
              </h3>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  L'Université de Moundou est un établissement public d'enseignement supérieur situé dans le sud du Tchad.
                  Depuis sa création, elle participe activement à la formation des étudiants et des hauts cadres
                  dans plusieurs domaines stratégiques : informatique, gestion, droit, sciences et technologies.
                </p>
                <p>
                  Grâce à ses facultés modernes, ses enseignants qualifiés et ses infrastructures académiques,
                  l'université offre un environnement favorable à l'apprentissage, à la recherche scientifique
                  et au développement personnel des étudiants.
                </p>
                <p>
                  L'établissement œuvre également dans le domaine de la numérisation et de la digitalisation
                  des services universitaires afin d'améliorer la gestion académique, les inscriptions en ligne,
                  la communication institutionnelle et l'accès aux ressources pédagogiques.
                </p>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl opacity-20 group-hover:opacity-30 transition blur-xl"></div>
                <img
                  src={campuceImages}
                  alt="Campus"
                  className="relative rounded-2xl shadow-2xl w-full h-80 object-cover group-hover:scale-105 transition duration-500"
                />
                
              </div>
            </div>
          </div>
        </motion.div>

        {/* STATISTIQUES ANIMÉES */}
        <div ref={statsRef}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              L'Université en <span className="text-green-600">chiffres</span>
            </h2>
            <p className="text-gray-500 mt-2">Découvrez les performances de notre institution</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
            {statistiques.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isStatsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                onMouseEnter={() => setActiveStat(index)}
                onMouseLeave={() => setActiveStat(null)}
                className="bg-white rounded-2xl shadow-lg p-8 text-center cursor-pointer transition-all duration-300 group"
              >
                <div className={`text-5xl mb-4 group-hover:scale-110 transition-transform ${activeStat === index ? 'animate-bounce' : ''}`}>
                  {item.icon}
                </div>
                <h3 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent mb-2">
                  <Counter target={parseInt(item.valeur)} suffix={item.valeur.includes('+') ? '+' : ''} />
                </h3>
                <p className="text-gray-600 font-medium">{item.titre}</p>
                <div className="w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-green-500 to-green-600 mx-auto mt-3 transition-all duration-300 rounded-full"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* VALEURS INSTITUTIONNELLES */}
        <div ref={valeursRef}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isValeursInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Nos <span className="text-green-600">valeurs institutionnelles</span>
            </h2>
            <p className="text-gray-500 mt-2">Les principes qui guident notre action</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {valeurs.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isValeursInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: item.delay }}
                whileHover={{ y: -15, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 blur"></div>
                <div className="relative bg-white rounded-3xl shadow-lg p-8 text-center transition-all duration-300">
                  <div className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{item.titre}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition">
                    <span className="text-green-600 text-sm font-semibold">En savoir plus →</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* DIGITALISATION */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6}}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden shadow-2xl mb-24 min-h-[550px] flex items-center justify-center group"
        >
          <img
            src={udmImage}
            alt="Digitalisation"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
          
          <div className="relative z-10 max-w-5xl px-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block bg-white/20 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-full text-sm font-semibold tracking-wide mb-6"
            >
              Université numérique
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 drop-shadow-2xl">
              Innovation & <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Digitalisation</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-4xl mx-auto">
              L'Université de Moundou modernise progressivement ses services grâce à la transformation numérique.
              Les inscriptions universitaires, les plateformes pédagogiques, les services administratifs
              et les outils académiques évoluent vers des solutions digitales modernes afin d'améliorer
              l'expérience des étudiants et des enseignants.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="mt-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-full font-semibold transition shadow-lg"
            >
              Découvrir nos initiatives numériques →
            </motion.button>
          </div>
        </motion.div>

        {/* PROMOTION FÉMININE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[550px] flex items-center justify-center group"
        >
          <img
            src={feminieImage}
            alt="Promotion féminine"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
          
          <div className="relative z-10 max-w-5xl px-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block bg-white/20 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-full text-sm font-semibold tracking-wide mb-6"
            >
              Inclusion & leadership féminin
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 drop-shadow-2xl">
              Promotion féminine & <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">inclusion</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-4xl mx-auto">
              L'Université de Moundou encourage activement la promotion féminine dans toutes les facultés.
              Plusieurs initiatives sont mises en place afin de favoriser l'accès des jeunes filles aux formations scientifiques,
              technologiques et professionnelles. L'établissement soutient également l'égalité des chances,
              le leadership féminin et l'inclusion académique dans tous les domaines universitaires.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="mt-8 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white px-8 py-3 rounded-full font-semibold transition shadow-lg"
            >
              Découvrir nos actions →
            </motion.button>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes scrollDot {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.5; }
        }
        .animate-scrollDot {
          animation: scrollDot 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}