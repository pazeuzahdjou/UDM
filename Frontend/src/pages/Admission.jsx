import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PaymentModal from "../components/PaymentModal";

export default function Admission() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [candidatureId, setCandidatureId] = useState(null);
  const [candidatureRef, setCandidatureRef] = useState(null);
  const [candidatureStatus, setCandidatureStatus] = useState(null);
  const [candidatureInfo, setCandidatureInfo] = useState(null);
  
  const [fieldErrors, setFieldErrors] = useState({
    dateNaissance: "",
    anneeBac: ""
  });

  const [inscriptionType, setInscriptionType] = useState("nouveau");
  
  const [formData, setFormData] = useState({
    nom: "", prenom: "", email: "", telephone: "", telephoneParent: "",
    sexe: "", dateNaissance: "", lieuNaissance: "", paysOrigine: "",
    filiere: "", niveau: "", sousNiveau: "", mention: "", anneeBac: "", 
    message: "",
    matricule: "",
    anneeAcademique: "2025-2026"
  });
  
  const [documents, setDocuments] = useState({ diplome: null, certificatBac: null, nationalite: null, naissance: null, photo: null });
  const [fileNames, setFileNames] = useState({ diplome: "", certificatBac: "", nationalite: "", naissance: "", photo: "" });
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  
  const [searchRef, setSearchRef] = useState("");
  const [showSuivi, setShowSuivi] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  
  const [erreur, setErreur] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputs = { diplome: useRef(null), certificatBac: useRef(null), nationalite: useRef(null), naissance: useRef(null), photo: useRef(null) };

  // ============ VÉRIFICATION DE L'AUTHENTIFICATION ============
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token) {
      // Rediriger vers la page de connexion
      navigate("/connexion");
      return;
    }
    
    try {
      const userInfo = JSON.parse(userData);
      setUser(userInfo);
      setIsAuthenticated(true);
      
      // Pré-remplir l'email avec celui de l'utilisateur connecté
      if (userInfo.email) {
        setFormData(prev => ({ ...prev, email: userInfo.email }));
        if (userInfo.nom) setFormData(prev => ({ ...prev, nom: userInfo.nom }));
        if (userInfo.prenom) setFormData(prev => ({ ...prev, prenom: userInfo.prenom }));
        if (userInfo.telephone) setFormData(prev => ({ ...prev, telephone: userInfo.telephone }));
      }
    } catch (error) {
      console.error("Erreur lecture user:", error);
      navigate("/connexion");
    } finally {
      setCheckingAuth(false);
    }
  }, [navigate]);

  // Si authentification en cours, afficher un loader
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-5xl text-white mb-4">⏳</div>
          <p className="text-white">Vérification de votre session...</p>
        </div>
      </div>
    );
  }

  // Si non authentifié, ne pas afficher le contenu (redirection déjà faite)
  if (!isAuthenticated) {
    return null;
  }

  // ============ FONCTIONS DE VALIDATION (inchangées) ============
  const validateDateNaissance = (date) => {
    if (!date) return "La date de naissance est requise";
    const birthYear = new Date(date).getFullYear();
    const maxYear = 2008;
    
    if (birthYear > maxYear) {
      return `La date de naissance ne peut pas être supérieure à ${maxYear} (vous devez avoir au moins 17 ans)`;
    }
    if (birthYear < 1950) {
      return "Année de naissance invalide";
    }
    return "";
  };

  const validateAnneeBac = (annee) => {
    if (!annee) return "L'année du Bac est requise";
    if (!/^\d{4}$/.test(annee)) {
      return "L'année du Bac doit contenir exactement 4 chiffres";
    }
    const anneeNum = parseInt(annee);
    const maxYear = 2026;
    
    if (anneeNum > maxYear) {
      return `L'année du Bac ne peut pas être supérieure à ${maxYear}`;
    }
    if (anneeNum < 2000) {
      return "L'année du Bac est invalide";
    }
    return "";
  };

  const validateTelephone = (tel) => {
    if (!tel) return "Le téléphone est requis";
    if (!/^\d{8,12}$/.test(tel)) {
      return "Le téléphone doit contenir entre 8 et 12 chiffres";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "L'email est requis";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Email invalide (exemple: nom@domaine.com)";
    }
    return "";
  };

  const validateName = (name, fieldName) => {
    if (!name) return `${fieldName} est requis`;
    if (!/^[a-zA-ZÀ-ÿ\s-]{2,50}$/.test(name)) {
      return `${fieldName} doit contenir uniquement des lettres (2-50 caractères)`;
    }
    return "";
  };

  const validateFormComplete = () => {
    const dateError = validateDateNaissance(formData.dateNaissance);
    if (dateError) { setErreur(dateError); return false; }
    
    const bacError = validateAnneeBac(formData.anneeBac);
    if (bacError) { setErreur(bacError); return false; }
    
    const phoneError = validateTelephone(formData.telephone);
    if (phoneError) { setErreur(phoneError); return false; }
    
    if (formData.telephoneParent) {
      const parentPhoneError = validateTelephone(formData.telephoneParent);
      if (parentPhoneError) { setErreur(parentPhoneError); return false; }
    }
    
    const emailError = validateEmail(formData.email);
    if (emailError) { setErreur(emailError); return false; }
    
    const nomError = validateName(formData.nom, "Le nom");
    if (nomError) { setErreur(nomError); return false; }
    
    const prenomError = validateName(formData.prenom, "Le prénom");
    if (prenomError) { setErreur(prenomError); return false; }
    
    return true;
  };

  const validateFieldOnChange = (name, value) => {
    if (name === "dateNaissance") {
      const error = validateDateNaissance(value);
      setFieldErrors(prev => ({ ...prev, dateNaissance: error }));
      return error === "";
    }
    if (name === "anneeBac") {
      const error = validateAnneeBac(value);
      setFieldErrors(prev => ({ ...prev, anneeBac: error }));
      return error === "";
    }
    if (name === "telephone") {
      const error = validateTelephone(value);
      setFieldErrors(prev => ({ ...prev, telephone: error }));
      return error === "";
    }
    if (name === "email") {
      const error = validateEmail(value);
      setFieldErrors(prev => ({ ...prev, email: error }));
      return error === "";
    }
    return true;
  };

  // ============ FONCTIONS EXISTANTES ============

  const checkCandidatureStatus = async () => {
    if (!searchRef) {
      setErreur("Veuillez entrer une référence");
      return;
    }
    
    setCheckingStatus(true);
    try {
      const data = await api.verifierStatut(searchRef);
      
      if (data.success) {
        setCandidatureStatus(data.status);
        setCandidatureInfo(data);
        if (data.status === 'valide') {
          const montant = data.montant || tarifs[data.niveau] || 50000;
          setPaymentAmount(montant);
          setCandidatureId(data.id);
          setCandidatureRef(searchRef);
        }
        setShowSuivi(true);
      } else {
        setErreur("Référence non trouvée");
      }
    } catch (error) {
      setErreur("Erreur de connexion");
    } finally {
      setCheckingStatus(false);
    }
  };

  const soumettreCandidature = async () => {
    if (!validateFormComplete()) {
      return;
    }
    
    setLoading(true);
    setErreur("");
    
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(k => formData[k] && formDataToSend.append(k, formData[k]));
      Object.keys(documents).forEach(k => documents[k] && formDataToSend.append(k, documents[k]));
      formDataToSend.append("inscriptionType", inscriptionType);
      formDataToSend.append("montant", tarifs[formData.niveau] || 0);
      
      const data = await api.soumettreCandidature(formDataToSend);
      
      if (data.success) {
        setCandidatureId(data.id);
        setCandidatureRef(data.reference);
        setSubmitted(true);
        setSuccess(`✅ Candidature soumise ! Votre référence: ${data.reference}`);
      } else {
        setErreur(data.message || "Erreur lors de la soumission");
      }
    } catch (error) {
      setErreur("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const soumettreReinscription = async () => {
    if (!formData.matricule || !formData.nom || !formData.prenom || 
        !formData.niveau || !formData.telephone || !formData.email || !formData.filiere) {
      setErreur("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    setLoading(true);
    setErreur("");
    
    try {
      const data = await api.soumettreReinscription({
        matricule: formData.matricule,
        nom: formData.nom,
        prenom: formData.prenom,
        niveau: formData.niveau,
        telephone: formData.telephone,
        email: formData.email,
        filiere: formData.filiere,
        anneeAcademique: formData.anneeAcademique
      });
      
      if (data.success) {
        setCandidatureId(data.id);
        setCandidatureRef(data.reference);
        setPaymentAmount(data.montant || 50000);
        setSuccess("✅ Réinscription enregistrée !");
        setShowPaymentModal(true);
      } else {
        setErreur(data.message || "Erreur lors de la réinscription");
      }
    } catch (error) {
      setErreur("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateFieldOnChange(name, value);
    if (name === "niveau" && inscriptionType === "nouveau") {
      setFormData(prev => ({ ...prev, niveau: value, sousNiveau: "" }));
    }
  };

  const handleFileSelected = (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) { setErreur("Format accepté : PDF, JPG, JPEG, PNG"); return; }
    if (file.size > 5 * 1024 * 1024) { setErreur("Fichier trop grand (max 5MB)"); return; }
    
    setDocuments(prev => ({ ...prev, [docType]: file }));
    setFileNames(prev => ({ ...prev, [docType]: file.name }));
    setErreur("");
  };

  const removeDocument = (docType) => {
    setDocuments(prev => ({ ...prev, [docType]: null }));
    setFileNames(prev => ({ ...prev, [docType]: "" }));
    if (fileInputs[docType]?.current) fileInputs[docType].current.value = "";
  };

  const openFileDialog = (docType) => { if (fileInputs[docType]?.current) fileInputs[docType].current.click(); };

  const nextStep = () => {
    if (currentStep === 1) {
      const required = ["nom", "prenom", "email", "telephone", "telephoneParent", "sexe", "dateNaissance", "lieuNaissance", "paysOrigine"];
      const missing = required.filter(f => !formData[f]);
      if (missing.length) { setErreur("Veuillez remplir tous les champs"); return; }
      const dateError = validateDateNaissance(formData.dateNaissance);
      if (dateError) { setErreur(dateError); return; }
    }
    if (currentStep === 2) {
      const required = ["filiere", "niveau", "sousNiveau", "mention", "anneeBac"];
      const missing = required.filter(f => !formData[f]);
      if (missing.length) { setErreur("Veuillez remplir tous les champs académiques"); return; }
      const bacError = validateAnneeBac(formData.anneeBac);
      if (bacError) { setErreur(bacError); return; }
    }
    if (currentStep === 3 && inscriptionType === "nouveau") {
      const docsRequired = ["diplome", "certificatBac", "nationalite", "naissance", "photo"];
      const missingDocs = docsRequired.filter(d => !documents[d]);
      if (missingDocs.length) { setErreur(`Documents manquants: ${missingDocs.length}`); return; }
    }
    setErreur("");
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const tarifs = { 
    Licence: 50000, 
    Master: 75000, 
    Doctorat: 100000,
    premiereTranche: 50000,
    deuxiemeTranche: 50000
  };
  
  const filieres = ["Informatique", "Gestion", "Droit", "Mathématiques", "Biologie", "Physique", "Chimie", "Télécommunication", "Géologie"];
  
  const sousNiveauxOptions = {
    Licence: [{ value: "L1", label: "Licence 1" }, { value: "L2", label: "Licence 2" }, { value: "L3", label: "Licence 3" }],
    Master: [{ value: "M1", label: "Master 1" }, { value: "M2", label: "Master 2" }],
    Doctorat: [{ value: "D1", label: "Doctorat 1" }, { value: "D2", label: "Doctorat 2" }, { value: "D3", label: "Doctorat 3" }],
  };
  
  const niveauxReinscription = ["Licence 2", "Licence 3", "Master 1", "Master 2", "Doctorat 1", "Doctorat 2", "Doctorat 3"];

  const FileUploadCard = ({ label, docType, icon }) => (
    <div className={`relative border-2 rounded-2xl p-5 transition-all duration-300 cursor-pointer ${fileNames[docType] ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-300 hover:border-green-400 hover:shadow-lg'}`} onClick={() => openFileDialog(docType)}>
      <div className="text-center">
        <div className="text-5xl mb-3">{icon}</div>
        <p className="font-semibold text-gray-700 mb-1">{label} *</p>
        <p className="text-xs text-gray-400">PDF, JPG, PNG (max 5MB)</p>
        {fileNames[docType] && (
          <div className="mt-3 flex items-center justify-between bg-white rounded-xl p-2">
            <span className="text-xs text-gray-600 truncate flex-1">📄 {fileNames[docType]}</span>
            <button onClick={(e) => { e.stopPropagation(); removeDocument(docType); }} className="text-red-500 hover:text-red-700 text-lg ml-2">✕</button>
          </div>
        )}
      </div>
      <input type="file" ref={fileInputs[docType]} accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileSelected(e, docType)} className="hidden" />
    </div>
  );

  const StepIndicator = () => (
    <div className="flex justify-between mb-10 px-4">
      {[{ num: 1, label: "Identité", icon: "👤" }, { num: 2, label: "Académique", icon: "📚" }, { num: 3, label: "Documents", icon: "📎" }, { num: 4, label: "Soumission", icon: "✅" }].map(step => (
        <div key={step.num} className="flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 ${currentStep >= step.num ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}>
            {currentStep > step.num ? "✓" : step.icon}
          </div>
          <p className={`text-sm mt-2 ${currentStep >= step.num ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>{step.label}</p>
        </div>
      ))}
    </div>
  );

  // Page de succès après soumission
  if (submitted && inscriptionType === "nouveau") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden text-center">
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-8">
            <div className="text-6xl mb-4">📬</div>
            <h1 className="text-2xl font-bold text-white">Candidature soumise avec succès !</h1>
          </div>
          <div className="p-8">
            <div className="bg-green-50 rounded-2xl p-6 mb-6">
              <p className="text-green-800 font-semibold">Votre référence unique</p>
              <p className="text-2xl font-mono font-bold text-green-700">{candidatureRef}</p>
            </div>
            <div className="text-left mb-6">
              <h3 className="font-bold text-gray-800 mb-3">📌 Prochaines étapes :</h3>
              <ul className="space-y-3">
                <li className="flex gap-2"><span>1️⃣</span> Notre équipe examinera votre dossier sous 48-72h</li>
                <li className="flex gap-2"><span>2️⃣</span> Vous recevrez un email de validation ou de rejet</li>
                <li className="flex gap-2"><span>3️⃣</span> Si validé, revenez sur cette page pour payer via Airtel/Moov Money</li>
              </ul>
            </div>
            <button onClick={() => window.location.href = "/"} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold">Retour à l'accueil</button>
          </div>
        </div>
      </div>
    );
  }

  // RENDU PRINCIPAL (après authentification)
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Message de bienvenue */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-6 text-black text-center">
          <p>👋 Bonjour <strong>{user?.nom || user?.email}</strong>, bienvenue dans votre espace d'inscription</p>
        </div>
        
        {/* Sélection type d'inscription */}
        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => { setInscriptionType("nouveau"); setCurrentStep(1); setErreur(""); setSuccess(""); }} className={`px-8 py-3 rounded-xl font-semibold transition ${inscriptionType === "nouveau" ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
            Nouvel étudiant
          </button>
          <button onClick={() => { setInscriptionType("reinscription"); setCurrentStep(1); setErreur(""); setSuccess(""); }} className={`px-8 py-3 rounded-xl font-semibold transition ${inscriptionType === "reinscription" ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
            🔄 Réinscription
          </button>
        </div>

        {/* Module de suivi */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">🔍 Suivre ma candidature / paiement</h3>
          <div className="flex gap-3">
            <input type="text" placeholder="Entrez votre référence" value={searchRef} onChange={(e) => setSearchRef(e.target.value)} className="flex-1 border rounded-xl p-3" />
            <button onClick={checkCandidatureStatus} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">Suivre</button>
          </div>
          
          {showSuivi && candidatureInfo && (
            <div className={`mt-4 p-4 rounded-xl ${candidatureStatus === 'valide' ? 'bg-green-50 border-green-500' : candidatureStatus === 'rejete' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'} border-l-4`}>
              <p><strong>Statut:</strong> {candidatureStatus === 'valide' ? '✅ Validée' : candidatureStatus === 'rejete' ? '❌ Rejetée' : '⏳ En cours d\'examen'}</p>
              {candidatureStatus === 'valide' && (
                <div className="mt-3">
                  <p className="font-semibold">💰 Montant à payer: {paymentAmount.toLocaleString()} FCFA</p>
                  <button onClick={() => setShowPaymentModal(true)} className="mt-3 bg-orange-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-orange-600 transition">💳 Payer maintenant</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Indicateur d'étapes */}
        {inscriptionType === "nouveau" && <StepIndicator />}

        <div className="bg-gray-500 rounded-3xl shadow-2xl overflow-hidden">
          <div className={`bg-gradient-to-r ${inscriptionType === "reinscription" ? "from-blue-700 to-blue-600" : "from-green-700 to-green-600"} px-8 py-5`}>
            <h2 className="text-xl font-bold text-white">{inscriptionType === "reinscription" ? "🔄 Formulaire de réinscription" : "📝 Nouvelle candidature"}</h2>
            <p className="text-green-100 text-sm mt-1">Tous les champs marqués d'un * sont obligatoires</p>
          </div>

          <div className="p-8">
            {erreur && <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl">⚠️ {erreur}</div>}
            {success && <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r-xl">✅ {success}</div>}

            {/* RÉINSCRIPTION */}
            {inscriptionType === "reinscription" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-5">
                  <div><label className="text-sm font-semibold text-gray-700">Matricule *</label><input type="text" name="matricule" value={formData.matricule} onChange={handleChange} className="w-full border rounded-xl p-3 mt-1" placeholder="UDM-2024-0001" /></div>
                  <div><label className="text-sm font-semibold text-gray-700">Nom *</label><input type="text" name="nom" value={formData.nom} onChange={handleChange} className="w-full border rounded-xl p-3 mt-1" placeholder="Votre nom" /></div>
                  <div><label className="text-sm font-semibold text-gray-700">Prénom *</label><input type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="w-full border rounded-xl p-3 mt-1" placeholder="Votre prénom" /></div>
                  <div><label className="text-sm font-semibold text-gray-700">Niveau *</label><select name="niveau" value={formData.niveau} onChange={handleChange} className="w-full border rounded-xl p-3 mt-1"><option value="">Sélectionner</option>{niveauxReinscription.map(n => <option key={n}>{n}</option>)}</select></div>
                  <div><label className="text-sm font-semibold text-gray-700">Téléphone *</label><input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} className="w-full border rounded-xl p-3 mt-1" placeholder="66 XX XX XX" /></div>
                  <div><label className="text-sm font-semibold text-gray-700">Email *</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded-xl p-3 mt-1" placeholder="exemple@email.com" /></div>
                  <div><label className="text-sm font-semibold text-gray-700">Filière *</label><select name="filiere" value={formData.filiere} onChange={handleChange} className="w-full border rounded-xl p-3 mt-1"><option value="">Sélectionner</option>{filieres.map(f => <option key={f}>{f}</option>)}</select></div>
                  <div><label className="text-sm font-semibold text-gray-700">Année académique</label><input type="text" name="anneeAcademique" value={formData.anneeAcademique} disabled className="w-full border rounded-xl p-3 mt-1 bg-gray-50" /></div>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-5">
                  <h3 className="font-bold text-gray-800 mb-3">💰 Frais de scolarité 2025-2026</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                      <p className="text-sm text-gray-500">Régime Normal</p>
                      <p className="text-2xl font-bold text-green-600">50 000 FCFA</p>
                      <p className="text-xs text-gray-400">À payer dès la rentrée académique</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                      <p className="text-sm text-gray-500">Régime Spécial</p>
                      <p className="text-2xl font-bold text-green-600">100 000 FCFA</p>
                      <p className="text-xs text-gray-400">À payer dès la rentrée académique</p>
                    </div>
                  </div>
                </div>
                
                <button onClick={soumettreReinscription} disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-semibold transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? "⏳ Traitement..." : "💳 Procéder au paiement"}
                </button>
              </div>
            )}

            {/* NOUVEL ÉTUDIANT - ÉTAPE 1 (le reste du code inchangé) */}
            {inscriptionType === "nouveau" && currentStep === 1 && (
              <div className="grid md:grid-cols-2 gap-5">
                <div><label className="text-sm font-semibold">Nom *</label><input type="text" name="nom" value={formData.nom} onChange={handleChange} className="w-full border rounded-xl p-3" /></div>
                <div><label className="text-sm font-semibold">Prénom *</label><input type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="w-full border rounded-xl p-3" /></div>
                <div><label className="text-sm font-semibold">Email *</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded-xl p-3" /></div>
                <div><label className="text-sm font-semibold">Téléphone *</label><input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} className="w-full border rounded-xl p-3" /></div>
                <div><label className="text-sm font-semibold">Tél. parent *</label><input type="tel" name="telephoneParent" value={formData.telephoneParent} onChange={handleChange} className="w-full border rounded-xl p-3" /></div>
                <div><label className="text-sm font-semibold">Sexe *</label><select name="sexe" value={formData.sexe} onChange={handleChange} className="w-full border rounded-xl p-3"><option value="">Sélectionner</option><option>Masculin</option><option>Féminin</option></select></div>
                <div><label className="text-sm font-semibold">Date naissance *</label><input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} className="w-full border rounded-xl p-3" /></div>
                <div><label className="text-sm font-semibold">Lieu naissance *</label><input type="text" name="lieuNaissance" value={formData.lieuNaissance} onChange={handleChange} className="w-full border rounded-xl p-3" /></div>
                <div><label className="text-sm font-semibold">Pays d'origine *</label><input type="text" name="paysOrigine" value={formData.paysOrigine} onChange={handleChange} className="w-full border rounded-xl p-3" /></div>
              </div>
            )}

            {/* (Le reste des étapes 2, 3, 4 reste identique à la version précédente) */}
            {inscriptionType === "nouveau" && currentStep === 2 && (
              <div className="grid md:grid-cols-2 gap-5">
                <div><label className="text-sm font-semibold">Filière *</label><select name="filiere" value={formData.filiere} onChange={handleChange} className="w-full border rounded-xl p-3"><option value="">Sélectionner</option>{filieres.map(f => <option key={f}>{f}</option>)}</select></div>
                <div><label className="text-sm font-semibold">Niveau *</label><select name="niveau" value={formData.niveau} onChange={handleChange} className="w-full border rounded-xl p-3"><option value="">Sélectionner</option><option>Licence</option><option>Master</option><option>Doctorat</option></select></div>
                {formData.niveau && (<div><label className="text-sm font-semibold">Année *</label><select name="sousNiveau" value={formData.sousNiveau} onChange={handleChange} className="w-full border rounded-xl p-3"><option value="">Sélectionner</option>{sousNiveauxOptions[formData.niveau]?.map(opt => <option key={opt.value} value={opt.label}>{opt.label}</option>)}</select></div>)}
                <div><label className="text-sm font-semibold">Mention Bac *</label><select name="mention" value={formData.mention} onChange={handleChange} className="w-full border rounded-xl p-3"><option value="">Sélectionner</option><option>Passable</option><option>Assez Bien</option><option>Bien</option><option>Très Bien</option></select></div>
                <div><label className="text-sm font-semibold">Année Bac *</label><input type="text" name="anneeBac" value={formData.anneeBac} onChange={handleChange} className="w-full border rounded-xl p-3" placeholder="2024" maxLength="4" /></div>
                <div className="col-span-2 p-4 bg-green-50 rounded-xl text-center">
                  <p>💰 Frais d'inscription: <strong className="text-2xl">{tarifs[formData.niveau]?.toLocaleString() || 0} FCFA</strong></p>
                  <p className="text-xs text-gray-500 mt-1">Le paiement vous sera demandé après validation de votre dossier</p>
                </div>
              </div>
            )}

            {inscriptionType === "nouveau" && currentStep === 3 && (
              <div className="grid md:grid-cols-3 gap-5">
                <FileUploadCard label="Diplôme / Relevé" docType="diplome" icon="🎓" />
                <FileUploadCard label="Certificat Bac" docType="certificatBac" icon="📜" />
                <FileUploadCard label="Nationalité" docType="nationalite" icon="🛂" />
                <FileUploadCard label="Acte naissance" docType="naissance" icon="📄" />
                <FileUploadCard label="Photo 4x4" docType="photo" icon="📸" />
              </div>
            )}

            {inscriptionType === "nouveau" && currentStep === 4 && (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto"><span className="text-5xl">📋</span></div>
                <h3 className="text-2xl font-bold">Vérification finale</h3>
                <div className="bg-gray-50 rounded-xl p-6 text-left max-w-md mx-auto">
                  <p><strong>👤 Candidat:</strong> {formData.nom} {formData.prenom}</p>
                  <p><strong>📚 Filière:</strong> {formData.filiere} - {formData.sousNiveau}</p>
                  <p><strong>💰 Frais:</strong> {tarifs[formData.niveau]?.toLocaleString()} FCFA</p>
                </div>
                <p className="text-sm text-gray-500">Un email de confirmation vous sera envoyé après soumission</p>
              </div>
            )}

            {inscriptionType === "nouveau" && (
              <div className="flex justify-between mt-10 pt-6 border-t">
                {currentStep > 1 && <button onClick={prevStep} className="px-6 py-3 bg-gray-200 rounded-xl font-semibold">← Précédent</button>}
                {currentStep < 4 ? <button onClick={nextStep} className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold ml-auto">Suivant →</button> : <button onClick={soumettreCandidature} disabled={loading} className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold ml-auto">{loading ? "Soumission..." : "📤 Soumettre"}</button>}
              </div>
            )}
          </div>
        </div>

        {/* Partenaires paiement */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-3">Partenaires paiement sécurisé</p>
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><span className="text-red-600">📱</span><span className="font-semibold">AIRTEL MONEY</span></div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><span className="text-blue-600">📱</span><span className="font-semibold">MOOV MONEY</span></div>
          </div>
        </div>
      </div>
  
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
        }}
        candidatureId={candidatureId}
        reference={candidatureRef}
        amount={paymentAmount}
      />
    </div>
  );
}