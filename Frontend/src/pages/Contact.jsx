import { useState, useEffect } from "react";
import SectionTitle from "../components/SectionTitle";

export default function Contact() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess("✅ Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.");
        setFormData({ nom: "", email: "", telephone: "", sujet: "", message: "" });
      } else {
        setError("❌ Une erreur est survenue. Veuillez réessayer.");
      }
    } catch (err) {
      setError("❌ Erreur de connexion. Vérifiez votre réseau.");
    } finally {
      setLoading(false);
    }
  };

  const infos = [
    { icon: "📍", title: "Adresse", content: "Université de Moundou, BP 123, Moundou, Tchad", color: "from-red-500 to-red-600", bg: "bg-red-50" },
    { icon: "📞", title: "Téléphone", content: "+235 63 89 98 36 / +235 93 87 60 95", color: "from-blue-500 to-blue-600", bg: "bg-blue-50" },
    { icon: "✉️", title: "Email", content: "contact@univ-moundou.td", color: "from-green-500 to-green-600", bg: "bg-green-50" },
    { icon: "🕒", title: "Horaires", content: "Lun - Ven: 08h00 - 16h00 | Sam: 08h00 - 13h00", color: "from-purple-500 to-purple-600", bg: "bg-purple-50" }
  ];

  const services = [
    { icon: "🎓", title: "Service Admissions", email: "admissions@univ-moundou.td", tel: "+235 63 89 98 36" },
    { icon: "📚", title: "Service Scolarité", email: "scolarite@univ-moundou.td", tel: "+235 63 89 98 36" },
    { icon: "💰", title: "Service Financier", email: "finance@univ-moundou.td", tel: "+235 63 89 98 36 " },
    { icon: "🔬", title: "Recherche", email: "recherche@univ-moundou.td", tel: "+235 63 89 98 36" }
  ];

  const questions = [
    { q: "Comment s'inscrire à l'université ?", a: "Rendez-vous sur notre page Admission et suivez le formulaire en ligne." },
    { q: "Quels sont les frais d'inscription ?", a: "Les frais varient selon le niveau : Licence 50.000 FCFA, Master 50.000 FCFA, Doctorat 100.000 FCFA." },
    { q: "Où se trouve l'université ?", a: "Notre campus principal est situé à Moundou, quartier Dombao." },
    { q: "Comment contacter un enseignant ?", a: "Utilisez notre annuaire en ligne ou contactez le secrétariat de la faculté." }
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">

      <div className="relative bg-gradient-to-r from-green-800 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
        {/* Décoration supplémentaire */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-400/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-sm font-semibold mb-6 animate-pulse">
            <span>📞</span> Nous sommes à votre écoute
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fadeInUp">Contactez-nous</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Une question ? Un besoin d'information ? Notre équipe est là pour vous accompagner.
          </p>
          {/* Flèche de scroll */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-2 bg-white rounded-full mt-2 animate-scrollDot"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        
        
      
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {infos.map((info, index) => (
            <div
              key={index}
              className={`group ${info.bg} rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer backdrop-blur-sm`}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                {info.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{info.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{info.content}</p>
              {/* Ligne décorative au hover */}
              <div className="w-0 group-hover:w-12 h-0.5 bg-green-500 mx-auto mt-3 transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* SECTION FORMULAIRE + MAP */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* FORMULAIRE */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500">
            <div className="bg-gradient-to-r from-green-700 to-green-600 px-8 py-6 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-yellow-400/10 rounded-full"></div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 relative z-10">
                <span>✉️</span> Envoyez-nous un message
              </h2>
              <p className="text-green-100 text-sm mt-1 relative z-10">Remplissez le formulaire ci-dessous</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-green-600 transition">Nom complet <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="Votre nom"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-green-600 transition">Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-green-600 transition">Téléphone</label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="66 XX XX XX"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-green-600 transition">Sujet <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="sujet"
                    value={formData.sujet}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="Objet de votre message"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-green-600 transition">Message <span className="text-red-500">*</span></label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
                  placeholder="Votre message..."
                ></textarea>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl text-sm animate-shake">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r-xl text-sm animate-fadeIn">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <span className="group-hover:scale-110 transition-transform">📤</span>
                    Envoyer le message
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* MAP + HORAIRES */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500">
              <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-8 py-6 relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-cyan-400/10 rounded-full"></div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 relative z-10">
                  <span>🗺️</span> Notre emplacement
                </h2>
                <p className="text-blue-100 text-sm mt-1 relative z-10">Retrouvez-nous sur le campus</p>
              </div>
              <div className="p-4">
                <div className="rounded-2xl overflow-hidden shadow-lg h-80">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.123456789012!2d16.0123456789!3d8.5678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMzQnMDQuNCJOIDE2wrAwMCc0NC40IkU!5e0!3m2!1sfr!2std!4v1234567890123"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Carte Université de Moundou"
                  ></iframe>
                </div>
                <p className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center gap-1">
                  <span>📍</span> Université de Moundou, Quartier Bonon, Moundou, Tchad
                </p>
              </div>
            </div>

          
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl p-8 text-white text-center relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-yellow-400/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🕒</div>
                <h3 className="text-2xl font-bold mb-4">Horaires d'ouverture</h3>
                <div className="space-y-2 text-purple-100">
                  <p className="flex justify-between"><span>Lundi - Jeudi:</span><span>08h00 - 17h00</span></p>
                  <p className="flex justify-between"><span>Vendredi:</span><span>08h00 - 15h00</span></p>
                  <p className="flex justify-between"><span>Samedi:</span><span>09h00 - 13h00</span></p>
                  <p className="flex justify-between"><span>Dimanche:</span><span>Fermé</span></p>
                </div>
                <div className="mt-6 pt-6 border-t border-purple-500 text-sm">
                  <p>📧 contact@univ-moundou.td</p>
                  <p>📞 +235 63 89 98 36</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION SERVICES DIRECTS */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 animate-pulse">
              🎯 Services dédiés
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Contactez directement nos services
            </h2>
            <div className="w-20 h-1 bg-green-500 mx-auto rounded-full"></div>
            <p className="text-gray-500 max-w-2xl mx-auto mt-4">
              Vous pouvez contacter directement le service concerné pour une prise en charge rapide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">{service.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">{service.title}</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center justify-center gap-2 text-gray-500">
                    <span>✉️</span> <a href={`mailto:${service.email}`} className="hover:text-green-600 transition">{service.email}</a>
                  </p>
                  <p className="flex items-center justify-center gap-2 text-gray-500">
                    <span>📞</span> {service.tel}
                  </p>
                </div>
                <div className="w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-green-500 to-green-600 mt-4 mx-auto transition-all duration-300 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        
        <div>
          <div className="text-center mb-12">
            <span className="inline-block bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              ❓ FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Questions fréquentes
            </h2>
            <div className="w-20 h-1 bg-yellow-500 mx-auto rounded-full"></div>
            <p className="text-gray-500 max-w-2xl mx-auto mt-4">
              Retrouvez les réponses aux questions les plus posées
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {questions.map((item, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 ${
                  openFaq === index ? 'ring-2 ring-green-500' : ''
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition"
                >
                  <span className="font-semibold text-gray-800 flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold transition-all duration-300 ${openFaq === index ? 'bg-green-600 text-white' : ''}`}>
                      {index + 1}
                    </span>
                    {item.q}
                  </span>
                  <span className={`text-green-600 text-xl transition-all duration-300 ${openFaq === index ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-gray-600 border-t pt-3 animate-fadeIn ml-9">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      
        <div className="mt-20 bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-12 text-white text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-yellow-400/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🎓</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à rejoindre l'Université de Moundou ?
            </h2>
            <p className="text-green-100 mb-8 text-lg">
              Inscrivez-vous dès maintenant et commencez votre parcours académique
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/admission"
                className="bg-white text-green-700 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center gap-2"
              >
                📝 S'inscrire maintenant <span className="group-hover:translate-x-1 transition">→</span>
              </a>
              <a
                href="/formations"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
              >
                📚 Découvrir nos formations <span className="group-hover:translate-x-1 transition">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollDot {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.5; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
        .animate-scrollDot {
          animation: scrollDot 1.5s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        .hover\\:shadow-3xl:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}