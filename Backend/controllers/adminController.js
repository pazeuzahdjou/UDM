import Admission from '../models/Admission.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
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

// Obtenir une candidature par ID avec consultation des documents
export const getCandidatureById = async (req, res) => {
  try {
    const candidature = await Admission.findById(req.params.id);
    if (!candidature) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }
    
    // Ajouter les URLs complètes des documents pour consultation
    const documentsUrls = {};
    if (candidature.documents) {
      Object.keys(candidature.documents).forEach(key => {
        if (candidature.documents[key]) {
          documentsUrls[key] = `${req.protocol}://${req.get('host')}/${candidature.documents[key]}`;
        }
      });
    }
    
    res.json({
      success: true,
      candidature: {
        ...candidature.toObject(),
        documentsUrls
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Valider une candidature (seule action de modification autorisée)
export const validerCandidature = async (req, res) => {
  try {
    const { id } = req.params;
    const { commentaire } = req.body;
    
    console.log(`📝 Validation de la candidature ${id}`);
    
    const candidature = await Admission.findByIdAndUpdate(
      id,
      {
        status: 'valide',
        dateTraitement: new Date(),
        commentaireAdmin: commentaire || '',
        traitePar: req.user._id
      },
      { new: true }
    );
    
    if (!candidature) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }
    
    console.log(`✅ Candidature validée: ${candidature.reference}`);
    
    // Envoyer email de validation
    await sendEmail(
      candidature.email,
      '✅ Candidature Validée - Université de Moundou',
      getEmailValidation(candidature, 'valide', commentaire)
    );
    
    res.json({ success: true, message: 'Candidature validée avec succès' });
    
  } catch (error) {
    console.error('❌ Erreur validation:', error);
    res.status(500).json({ message: 'Erreur serveur: ' + error.message });
  }
};

// Rejeter une candidature
export const rejeterCandidature = async (req, res) => {
  try {
    const { id } = req.params;
    const { commentaire } = req.body;
    
    console.log(`📝 Rejet de la candidature ${id}`);
    
    const candidature = await Admission.findByIdAndUpdate(
      id,
      {
        status: 'rejete',
        dateTraitement: new Date(),
        commentaireAdmin: commentaire || '',
        traitePar: req.user._id
      },
      { new: true }
    );
    
    if (!candidature) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }
    
    console.log(`❌ Candidature rejetée: ${candidature.reference}`);
    
    // Envoyer email de rejet
    await sendEmail(
      candidature.email,
      '❌ Candidature Non Retenue - Université de Moundou',
      getEmailValidation(candidature, 'rejete', commentaire)
    );
    
    res.json({ success: true, message: 'Candidature rejetée avec succès' });
    
  } catch (error) {
    console.error('❌ Erreur rejet:', error);
    res.status(500).json({ message: 'Erreur serveur: ' + error.message });
  }
};



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

// Obtenir tous les utilisateurs (admin seulement)
export const getUsers = async (req, res) => {
  try {
    // Seul le super_admin peut voir tous les utilisateurs
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Vérifier qu'il n'y a qu'un seul super_admin (appelé au démarrage)
export const checkUniqueSuperAdmin = async () => {
  const superAdminCount = await User.countDocuments({ role: 'super_admin' });
  if (superAdminCount > 1) {
    console.error('⚠️ ERREUR CRITIQUE : Plusieurs super_admin détectés !');
    // Garder uniquement le premier et rétrograder les autres
    const superAdmins = await User.find({ role: 'super_admin' }).sort({ createdAt: 1 });
    for (let i = 1; i < superAdmins.length; i++) {
      superAdmins[i].role = 'admin';
      await superAdmins[i].save();
      console.log(`Utilisateur ${superAdmins[i].email} rétrogradé de super_admin à admin`);
    }
  }
};