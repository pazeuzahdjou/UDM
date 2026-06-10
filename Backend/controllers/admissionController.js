import { query } from '../config/database.js';
import { sendEmail, getEmailSoumission, getEmailReinscription, getEmailPaiement } from '../services/mailService.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration multer pour l'upload des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

export const uploadAdmissionDocs = upload.fields([
  { name: 'diplome', maxCount: 1 },
  { name: 'certificatBac', maxCount: 1 },
  { name: 'nationalite', maxCount: 1 },
  { name: 'naissance', maxCount: 1 },
  { name: 'photo', maxCount: 1 }
]);

// Générer référence unique
const generateReference = async () => {
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
    
    const existing = await query('SELECT id FROM admissions WHERE reference = $1', [reference]);
    if (existing.rows.length === 0) {
      exists = false;
    }
    attempts++;
  }
  
  return reference;
};

// Calculer le montant selon niveau et régime
const calculerMontant = (niveau, regime) => {
  const tarifs = { Licence: 50000, Master: 75000, Doctorat: 100000 };
  let montant = tarifs[niveau] || 0;
  if (regime === 'special') {
    montant += 50000;
  }
  return montant;
};

// ============ SOUMETTRE UN NOUVEL ÉTUDIANT ============
export const soumettreCandidature = async (req, res) => {
  try {
    console.log('📝 Soumission candidature reçue');
    
    const candidatureData = { ...req.body };
    candidatureData.reference = await generateReference();
    
    // Calcul du montant
    candidatureData.montant = calculerMontant(candidatureData.niveau, candidatureData.regime || 'normal');
    candidatureData.paymentstatus = 'en_attente';
    candidatureData.status = 'en_attente';
    
    // Gérer les fichiers uploadés
    const documentsData = {};
    if (req.files) {
      Object.keys(req.files).forEach(key => {
        documentsData[key] = req.files[key][0].filename;
      });
    }
    
    // Insertion dans PostgreSQL
    const result = await query(
      `INSERT INTO admissions (
        reference, nom, prenom, email, telephone, telephoneparent,
        sexe, datenaissance, lieunaissance, paysorigine, filiere,
        niveau, sousniveau, mention, anneebac, message, montant,
        regime, paymentstatus, status, datesoumission
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW())
      RETURNING id, reference`,
      [
        candidatureData.reference,
        candidatureData.nom,
        candidatureData.prenom,
        candidatureData.email,
        candidatureData.telephone,
        candidatureData.telephoneParent || '',
        candidatureData.sexe || '',
        candidatureData.dateNaissance || null,
        candidatureData.lieuNaissance || '',
        candidatureData.paysOrigine || 'Tchad',
        candidatureData.filiere,
        candidatureData.niveau,
        candidatureData.sousNiveau || '',
        candidatureData.mention || '',
        candidatureData.anneeBac || '',
        candidatureData.message || '',
        candidatureData.montant,
        candidatureData.regime || 'normal',
        candidatureData.paymentstatus,
        candidatureData.status
      ]
    );
    
    // Insertion des documents (si présents) - CORRIGÉ : reference_candidature
    for (const [key, filename] of Object.entries(documentsData)) {
      await query(
        `INSERT INTO documents (reference_candidature, type_document, url_fichier) VALUES ($1, $2, $3)`,
        [candidatureData.reference, key, filename]
      );
    }
    
    const candidature = result.rows[0];
    
    // Envoi email de confirmation
    try {
      await sendEmail(
        candidatureData.email,
        '📧 Confirmation de candidature - Université de Moundou',
        getEmailSoumission({ ...candidatureData, reference: candidature.reference })
      );
    } catch (emailError) {
      console.log('⚠️ Email non envoyé:', emailError.message);
    }
    
    res.status(201).json({
      success: true,
      message: 'Candidature soumise avec succès',
      reference: candidature.reference,
      id: candidature.id
    });
    
  } catch (error) {
    console.error('❌ Erreur soumission:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur: ' + error.message });
  }
};

// ============ SOUMETTRE UNE RÉINSCRIPTION ============
export const soumettreReinscription = async (req, res) => {
  try {
    console.log('📝 Données reçues:', req.body);
    
    const { matricule, nom, prenom, niveau, telephone, email, filiere, anneeAcademique, regime } = req.body;
    
    if (!matricule || !nom || !prenom || !niveau || !telephone || !email || !filiere) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tous les champs sont obligatoires' 
      });
    }
    
    const reference = await generateReference();
    const montant = calculerMontant(niveau, regime || 'normal');
    
    const result = await query(
      `INSERT INTO admissions (
        reference, nom, prenom, email, telephone, filiere,
        niveau, matricule, anneeacademique, regime, montant,
        paymentstatus, status, datesoumission
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'en_attente', 'valide', NOW())
      RETURNING id, reference`,
      [reference, nom, prenom, email, telephone, filiere, niveau, matricule, anneeAcademique || '2025-2026', regime || 'normal', montant]
    );
    
    const reinscription = result.rows[0];
    console.log('✅ Réinscription enregistrée:', reinscription.reference);
    
    // Envoyer email de confirmation
    try {
      await sendEmail(
        email,
        '🔄 Confirmation de réinscription - Université de Moundou',
        getEmailReinscription({ prenom, nom, reference, matricule, filiere, niveau })
      );
    } catch (emailError) {
      console.log('⚠️ Email non envoyé:', emailError.message);
    }
    
    res.status(201).json({
      success: true,
      message: 'Réinscription enregistrée avec succès',
      reference: reinscription.reference,
      id: reinscription.id,
      montant: montant
    });
    
  } catch (error) {
    console.error('❌ Erreur réinscription:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur: ' + error.message });
  }
};

// ============ VÉRIFIER STATUT ============
export const verifierStatut = async (req, res) => {
  try {
    const { reference } = req.params;
    
    const result = await query(
      `SELECT id, reference, nom, prenom, email, telephone, filiere, niveau, 
              sousniveau, status, paymentstatus, montant, modepaiement, 
              paymentreference, datesoumission
       FROM admissions 
       WHERE reference = $1`,
      [reference]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Référence introuvable' });
    }
    
    const candidature = result.rows[0];
    
    // Récupérer les documents - CORRIGÉ : reference_candidature
    const docsResult = await query(
      'SELECT type_document, url_fichier FROM documents WHERE reference_candidature = $1',
      [reference]
    );
    
    res.json({
      success: true,
      status: candidature.status,
      paymentStatus: candidature.paymentstatus,
      montant: candidature.montant,
      nom: `${candidature.nom} ${candidature.prenom}`,
      dateSoumission: candidature.datesoumission,
      niveau: candidature.niveau,
      filiere: candidature.filiere,
      email: candidature.email,
      telephone: candidature.telephone,
      documents: docsResult.rows
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ============ CONFIRMER PAIEMENT ============
export const confirmerPaiement = async (req, res) => {
  try {
    const { candidatureId, reference, amount, method, phone } = req.body;
    
    const result = await query(
      `UPDATE admissions 
       SET paymentstatus = 'paye', 
           paymentreference = $1, 
           paymentphone = $2, 
           modepaiement = $3,
           montant = $4,
           paymentdate = NOW()
       WHERE id = $5 OR reference = $6
       RETURNING id, reference, nom, prenom, email`,
      [reference, phone, method === 'airtel' ? 'Airtel Money' : 'Moov Money', amount, candidatureId, reference]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Candidature non trouvée' });
    }
    
    const candidature = result.rows[0];
    console.log(`✅ Paiement confirmé pour ${candidature.nom} ${candidature.prenom}`);
    
    // Envoyer email de confirmation
    try {
      await sendEmail(
        candidature.email,
        '💰 Confirmation de paiement - Université de Moundou',
        getEmailPaiement(candidature, reference)
      );
    } catch (emailError) {
      console.log('⚠️ Email de confirmation non envoyé:', emailError.message);
    }
    
    res.status(200).json({ success: true, message: 'Paiement confirmé', reference });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ============ ENREGISTRER PAIEMENT ============
export const enregistrerPaiement = async (req, res) => {
  try {
    const { candidatureId, reference, amount, method, phone } = req.body;
    
    const result = await query(
      `UPDATE admissions 
       SET paymentstatus = 'paye', 
           paymentreference = $1, 
           paymentphone = $2, 
           modepaiement = $3,
           paymentdate = NOW()
       WHERE id = $4 OR reference = $5
       RETURNING id`,
      [reference, phone, method === 'airtel' ? 'Airtel Money' : 'Moov Money', amount, candidatureId, reference]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Candidature non trouvée' });
    }
    
    res.status(200).json({ success: true, message: 'Paiement enregistré', reference });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};