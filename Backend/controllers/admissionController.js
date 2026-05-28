import Admission from '../models/Admission.js';
import { sendEmail } from '../services/mailService.js';

// Générer référence unique avec vérification
const generateUniqueReference = async () => {
  let reference;
  let exists = true;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (exists && attempts < maxAttempts) {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    reference = `UNIV-${year}${month}${day}-${random}`;
    
    const existing = await Admission.findOne({ reference });
    if (!existing) {
      exists = false;
    }
    attempts++;
  }
  
  return reference;
};

// SOUMETTRE UN NOUVEL ÉTUDIANT (avec chemin relatif des fichiers)
export const soumettreCandidature = async (req, res) => {
  try {
    const candidatureData = { ...req.body, inscriptionType: 'nouveau' };
    candidatureData.reference = await generateUniqueReference();
    
    // Stocker uniquement le nom du fichier (chemin relatif)
    if (req.files) {
      candidatureData.documents = {};
      Object.keys(req.files).forEach(key => {
        // Récupérer uniquement le nom du fichier, pas le chemin absolu
        const filename = req.files[key][0].filename;
        candidatureData.documents[key] = filename;
      });
    }
    
    const tarifs = { Licence: 50000, Master: 75000, Doctorat: 100000 };
    candidatureData.montant = tarifs[candidatureData.niveau] || 0;
    candidatureData.paymentStatus = 'en_attente';
    
    const candidature = new Admission(candidatureData);
    await candidature.save();
    
    // Envoyer email de confirmation
    try {
      await sendEmail(
        candidature.email,
        '📧 Confirmation de candidature - Université de Moundou',
        `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #166534;">📧 Confirmation de candidature</h1>
            <p>Bonjour <strong>${candidature.prenom} ${candidature.nom}</strong>,</p>
            <p>Nous accusons réception de votre dossier de candidature pour l'année académique <strong>2025-2026</strong>.</p>
            <div style="background: #f0fdf4; padding: 15px; border-radius: 10px; margin: 20px 0;">
              <p><strong>📌 Votre référence unique:</strong> ${candidature.reference}</p>
              <p><strong>📚 Filière:</strong> ${candidature.filiere}</p>
            </div>
            <p>Notre équipe examinera votre dossier sous 48h.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">Université de Moundou</p>
          </div>
        </body>
        </html>
        `
      );
    } catch (emailError) {
      console.log('⚠️ Email non envoyé:', emailError.message);
    }
    
    res.status(201).json({
      success: true,
      message: 'Candidature soumise avec succès',
      reference: candidature.reference,
      id: candidature._id
    });
    
  } catch (error) {
    console.error('Erreur soumission:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur: ' + error.message });
  }
};

// SOUMETTRE UNE RÉINSCRIPTION
export const soumettreReinscription = async (req, res) => {
  try {
    console.log('📝 Données reçues:', req.body);
    
    const { matricule, nom, prenom, niveau, telephone, email, filiere, anneeAcademique } = req.body;
    
    if (!matricule || !nom || !prenom || !niveau || !telephone || !email || !filiere) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tous les champs sont obligatoires' 
      });
    }
    
    const reference = await generateUniqueReference();
    console.log('📌 Référence générée:', reference);
    
    const reinscriptionData = {
      inscriptionType: 'reinscription',
      matricule,
      nom,
      prenom,
      niveau,
      telephone,
      email,
      filiere,
      anneeAcademique: anneeAcademique || '2025-2026',
      reference: reference,
      montant: 50000,
      paymentStatus: 'en_attente',
      status: 'valide',
      sexe: '',
      telephoneParent: '',
      dateNaissance: '',
      lieuNaissance: '',
      paysOrigine: 'Tchad',
      sousNiveau: '',
      mention: '',
      anneeBac: '',
      message: ''
    };
    
    const reinscription = new Admission(reinscriptionData);
    await reinscription.save();
    
    console.log('✅ Réinscription enregistrée:', reinscription.reference);
    
    try {
      await sendEmail(
        reinscription.email,
        '🔄 Confirmation de réinscription - Université de Moundou',
        `
        <h1>🔄 Confirmation de réinscription</h1>
        <p>Bonjour ${prenom} ${nom},</p>
        <p>Votre réinscription a été enregistrée.</p>
        <p>Référence: ${reference}</p>
        <p>Montant: 50 000 FCFA</p>
        `
      );
    } catch (emailError) {
      console.log('⚠️ Email non envoyé:', emailError.message);
    }
    
    res.status(201).json({
      success: true,
      message: 'Réinscription enregistrée avec succès',
      reference: reinscription.reference,
      id: reinscription._id,
      montant: 50000
    });
    
  } catch (error) {
    console.error('❌ Erreur réinscription:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cette réinscription existe déjà.' 
      });
    }
    
    res.status(500).json({ success: false, message: 'Erreur serveur: ' + error.message });
  }
};

// VÉRIFIER STATUT
export const verifierStatut = async (req, res) => {
  try {
    const { reference } = req.params;
    const candidature = await Admission.findOne({ reference });
    
    if (!candidature) {
      return res.status(404).json({ success: false, message: 'Référence introuvable' });
    }
    
    res.json({
      success: true,
      status: candidature.status,
      paymentStatus: candidature.paymentStatus,
      montant: candidature.montant,
      inscriptionType: candidature.inscriptionType,
      nom: `${candidature.nom} ${candidature.prenom}`,
      dateSoumission: candidature.dateSoumission,
      niveau: candidature.niveau,
      filiere: candidature.filiere,
      email: candidature.email,
      telephone: candidature.telephone,
      documents: candidature.documents
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ENREGISTRER PAIEMENT
export const enregistrerPaiement = async (req, res) => {
  try {
    const { candidatureId, reference, amount, method, phone } = req.body;
    
    const candidature = await Admission.findById(candidatureId);
    
    if (!candidature) {
      return res.status(404).json({ success: false, message: 'Candidature non trouvée' });
    }
    
    candidature.montant = amount;
    candidature.modePaiement = method === 'airtel' ? 'Airtel Money' : 'Moov Money';
    candidature.paymentStatus = 'paye';
    candidature.paymentReference = reference;
    candidature.paymentDate = new Date();
    candidature.paymentPhone = phone;
    
    await candidature.save();
    
    res.status(200).json({ success: true, message: 'Paiement enregistré', reference });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// CONFIRMER PAIEMENT
export const confirmerPaiement = async (req, res) => {
  try {
    const { candidatureId, reference, amount, method, phone } = req.body;
    
    const candidature = await Admission.findById(candidatureId);
    
    if (!candidature) {
      return res.status(404).json({ success: false, message: 'Candidature non trouvée' });
    }
    
    candidature.paymentStatus = 'paye';
    candidature.paymentReference = reference;
    candidature.paymentDate = new Date();
    candidature.paymentPhone = phone;
    candidature.modePaiement = method === 'airtel' ? 'Airtel Money' : 'Moov Money';
    candidature.montant = amount;
    
    await candidature.save();
    
    console.log(`✅ Paiement confirmé pour ${candidature.nom} ${candidature.prenom}`);
    
    res.status(200).json({ success: true, message: 'Paiement confirmé', reference });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};