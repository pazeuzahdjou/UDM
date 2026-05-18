import mongoose from 'mongoose';

const AdmissionSchema = new mongoose.Schema({
  // Type d'inscription
  inscriptionType: { type: String, enum: ['nouveau', 'reinscription'], default: 'nouveau' },
  
  // Informations personnelles
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  telephone: { type: String, required: true },
  telephoneParent: { type: String, default: '' },
  sexe: { type: String, enum: ['Masculin', 'Féminin', ''], default: '' },  // Ajout de '' comme valeur valide
  dateNaissance: { type: String, default: '' },
  lieuNaissance: { type: String, default: '' },
  paysOrigine: { type: String, default: '' },
  
  // Informations académiques
  filiere: { type: String, required: true },
  niveau: { type: String, required: true },
  sousNiveau: { type: String, default: '' },
  mention: { type: String, default: '' },
  anneeBac: { type: String, default: '' },
  
  // Documents
  documents: {
    diplome: { type: String, default: '' },
    certificatBac: { type: String, default: '' },
    nationalite: { type: String, default: '' },
    naissance: { type: String, default: '' },
    photo: { type: String, default: '' }
  },
  
  // Réinscription uniquement
  matricule: { type: String, default: '' },
  anneeAcademique: { type: String, default: '2025-2026' },
  paymentType: { type: String, enum: ['premiere', 'deuxieme', 'total', ''], default: 'premiere' },
  
  // Paiement
  montant: { type: Number, default: null },
  reference: { type: String, required: true, unique: true },
  modePaiement: { type: String, enum: ['Airtel Money', 'Moov Money', '', null], default: null }, // Accepte null et chaîne vide
  paymentStatus: { type: String, enum: ['en_attente', 'paye'], default: 'en_attente' },
  paymentReference: { type: String, default: '' },
  paymentDate: { type: Date, default: null },
  paymentPhone: { type: String, default: '' },
  
  // Message
  message: { type: String, default: '' },
  
  // Statut
  status: { 
    type: String, 
    enum: ['en_attente', 'valide', 'rejete'], 
    default: 'en_attente' 
  },
  
  // Admin
  commentaireAdmin: { type: String, default: '' },
  dateTraitement: { type: Date, default: null },
  traitePar: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  
  // Dates
  dateSoumission: { type: Date, default: Date.now }
}, {
  // Option pour permettre les valeurs null
  strict: false
});

export default mongoose.model('Admission', AdmissionSchema);