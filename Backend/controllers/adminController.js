import Admission from '../models/Admission.js';
import Student from '../models/Student.js';
import { sendEmail, getEmailValidation } from '../services/mailService.js';

// Obtenir toutes les candidatures
export const getCandidatures = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    
    if (status && status !== 'tous') filter.status = status;
    if (search) {
      filter.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { prenom: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } }
      ];
    }
    
    const candidatures = await Admission.find(filter)
      .sort({ dateSoumission: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    const total = await Admission.countDocuments(filter);
    
    res.json({
      success: true,
      candidatures,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir statistiques
export const getStats = async (req, res) => {
  try {
    const stats = {
      total: await Admission.countDocuments(),
      enAttente: await Admission.countDocuments({ status: 'en_attente' }),
      valide: await Admission.countDocuments({ status: 'valide' }),
      rejete: await Admission.countDocuments({ status: 'rejete' }),
      parFiliere: await Admission.aggregate([
        { $group: { _id: '$filiere', count: { $sum: 1 } } }
      ])
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Valider une candidature
export const validerCandidature = async (req, res) => {
  try {
    const { id } = req.params;
    const { commentaire } = req.body;
    
    const candidature = await Admission.findByIdAndUpdate(
      id,
      {
        status: 'valide',
        dateTraitement: new Date(),
        commentaireAdmin: commentaire,
        traitePar: req.user._id
      },
      { new: true }
    );
    
    if (!candidature) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }
    
    // Créer un étudiant
    const student = new Student({
      admissionId: candidature._id,
      nom: candidature.nom,
      prenom: candidature.prenom,
      email: candidature.email,
      telephone: candidature.telephone,
      filiere: candidature.filiere,
      niveau: candidature.sousNiveau,
      anneeInscription: new Date().getFullYear().toString()
    });
    await student.save();
    
    await sendEmail(
      candidature.email,
      '✅ Candidature Validée - Université de Moundou',
      getEmailValidation(candidature, 'valide', commentaire)
    );
    
    res.json({ success: true, message: 'Candidature validée', matricule: student.matricule });
    
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Rejeter une candidature
export const rejeterCandidature = async (req, res) => {
  try {
    const { id } = req.params;
    const { commentaire } = req.body;
    
    const candidature = await Admission.findByIdAndUpdate(
      id,
      {
        status: 'rejete',
        dateTraitement: new Date(),
        commentaireAdmin: commentaire,
        traitePar: req.user._id
      },
      { new: true }
    );
    
    if (!candidature) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }
    
    await sendEmail(
      candidature.email,
      '❌ Mise à jour de votre candidature - Université de Moundou',
      getEmailValidation(candidature, 'rejete', commentaire)
    );
    
    res.json({ success: true, message: 'Candidature rejetée' });
    
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir une candidature par ID
export const getCandidatureById = async (req, res) => {
  try {
    const candidature = await Admission.findById(req.params.id);
    if (!candidature) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }
    res.json(candidature);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};