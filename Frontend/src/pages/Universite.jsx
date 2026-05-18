// ⚠️ SUPPRIMEZ cette ligne :
// import MainLayout from "../layouts/MainLayout";

import udmImage from "../assets/images/udm3.png";
import feminieImage from "../assets/images/femine.png";
import SectionTitle from "../components/SectionTitle";

export default function Universite() {
  const valeurs = [
    {
      id: 1,
      icon: "🎓",
      titre: "Excellence académique",
      description:
        "Une formation universitaire de qualité adaptée aux standards internationaux du système LMD.",
    },
    {
      id: 2,
      icon: "💻",
      titre: "Transformation numérique",
      description:
        "L’université modernise progressivement ses services grâce à la digitalisation académique et administrative.",
    },
    {
      id: 3,
      icon: "🔬",
      titre: "Recherche scientifique",
      description:
        "Les enseignants-chercheurs participent activement aux projets scientifiques et technologiques.",
    },
    {
      id: 4,
      icon: "👩‍🎓",
      titre: "Promotion féminine",
      description:
        "L’Université encourage fortement la participation des femmes dans toutes les facultés et filières.",
    },
  ];

  const statistiques = [
    {
      valeur: "5000+",
      titre: "Étudiants",
    },
    {
      valeur: "20+",
      titre: "Filières",
    },
    {
      valeur: "300+",
      titre: "Diplômés par an",
    },
    {
      valeur: "10+",
      titre: "Partenariats",
    },
  ];

  return (
    // ⚠️ SUPPRIMEZ <MainLayout> ici aussi
    // ⚠️ Plus de <MainLayout> car c'est déjà dans App.jsx

    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* TITRE */}
        <SectionTitle title="Présentation de l'Université" />

        {/* IMAGE PRINCIPALE */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-16">
          <img
            src="https://manara.td/wp-content/uploads/2025/06/481221274_615083091274686_2964677196075038350_n.jpg"
            alt="Université de Moundou"
            className="rounded-2xl w-full h-[650px] object-cover"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/70 flex items-center justify-center text-center px-8">
            <div>
              <span className="inline-block bg-white/20 backdrop-blur-md border border-white/20 text-black px-5 py-2 rounded-full text-sm font-semibold tracking-wide mb-6">
                Université publique du Tchad
              </span>

              <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight drop-shadow-2xl">
                Université de Moundou
              </h1>

              <p className="text-xl md:text-2xl text-gray-100 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-lg">
                Une institution publique moderne, innovante et engagée dans la formation
                des cadres du Tchad ainsi que dans la transformation numérique
                de l’enseignement supérieur.
              </p>
            </div>
          </div>
        </div>

        {/* PRÉSENTATION */}
        <div className="bg-white rounded-3xl shadow-xl p-12 mb-20">
          <h2 className="text-4xl font-extrabold text-black-900 mb-8">
            Une université tournée vers l’avenir
          </h2>

          <p className="text-lg leading-10 text-gray-700 mb-6">
            L’Université de Moundou est un établissement public
            d’enseignement supérieur situé dans le sud du Tchad.
            Depuis sa création, elle participe activement
            à la formation des étudiants et des hauts cadres
            dans plusieurs domaines stratégiques :
            informatique, gestion, droit, sciences et technologies.
          </p>

          <p className="text-lg leading-10 text-gray-700 mb-6">
            Grâce à ses facultés modernes, ses enseignants qualifiés
            et ses infrastructures académiques, l’université offre un environnement
            favorable à l’apprentissage, à la recherche scientifique
            et au développement personnel des étudiants.
          </p>

          <p className="text-lg leading-10 text-gray-700">
            L’établissement œuvre également dans le domaine de la numérisation
            et de la digitalisation des services universitaires
            afin d’améliorer la gestion académique, les inscriptions en ligne,
            la communication institutionnelle et l’accès aux ressources pédagogiques.
          </p>
        </div>

        {/* STATISTIQUES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          {statistiques.map((item, index) => (
            <div
              key={index}
              className="bg-gray-200 rounded-3xl shadow-lg p-10 text-center hover:shadow-2xl hover:-translate-y-2 transition duration-300"
            >
              <h3 className="text-5xl font-extrabold text-black-900 mb-4">
                {item.valeur}
              </h3>
              <p className="text-gray-600 text-lg">{item.titre}</p>
            </div>
          ))}
        </div>

        {/* VALEURS */}
        <div className="mb-24">
          <h2 className="text-4xl font-extrabold text-center text-black-900 mb-16">
            Nos valeurs institutionnelles
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valeurs.map((item) => (
              <div
                key={item.id}
                className="bg-gray-300 rounded-3xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition duration-300"
              >
                <div className="text-5xl mb-6">{item.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {item.titre}
                </h3>
                <p className="text-gray-900 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* DIGITALISATION */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-24 min-h-[500px] flex items-center justify-center">
          <img
            src={udmImage}
            alt="Digitalisation"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/70" />

          <div className="relative z-10 max-w-5xl px-10 text-center">
            <span className="inline-block bg-white/20 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-full text-sm font-semibold tracking-wide mb-6">
              Université numérique
            </span>

            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8 drop-shadow-2xl">
              Innovation & Digitalisation
            </h2>

            <p className="text-lg md:text-xl text-gray-100 leading-9 font-medium drop-shadow-lg">
              L’Université de Moundou modernise progressivement ses services
              grâce à la transformation numérique. Les inscriptions universitaires,
              les plateformes pédagogiques, les services administratifs
              et les outils académiques évoluent vers des solutions digitales
              modernes afin d’améliorer l’expérience des étudiants
              et des enseignants.
            </p>
          </div>
        </div>

        {/* PROMOTION FÉMININE */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[500px] flex items-center justify-center">
          <img
            src={feminieImage}
            alt="Promotion féminine"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/70" />

          <div className="relative z-10 max-w-5xl px-10 text-center">
            <span className="inline-block bg-white/20 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-full text-sm font-semibold tracking-wide mb-6">
              Inclusion & leadership féminin
            </span>

            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8 drop-shadow-2xl">
              Promotion féminine & inclusion
            </h2>

            <p className="text-lg md:text-xl text-gray-100 leading-9 font-medium drop-shadow-lg">
              L’Université de Moundou encourage activement la promotion féminine
              dans toutes les facultés. Plusieurs initiatives sont mises en place
              afin de favoriser l’accès des jeunes filles aux formations scientifiques,
              technologiques et professionnelles. L’établissement soutient également
              l’égalité des chances, le leadership féminin
              et l’inclusion académique dans tous les domaines universitaires.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}