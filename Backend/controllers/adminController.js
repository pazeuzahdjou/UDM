import { query } from '../config/database.js';

// Obtenir toutes les candidatures
export const getCandidatures = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    let sql = 'SELECT * FROM admissions ORDER BY datesoumission DESC';
    const params = [];
    
    if (status && status !== 'tous') {
      sql = 'SELECT * FROM admissions WHERE status = $1 ORDER BY datesoumission DESC';
      params.push(status);
    }
    
    const result = await query(sql, params);
    
    res.json({
      success: true,
      candidatures: result.rows,
      pagination: { page, limit, total: result.rows.length, pages: 1 }
    });
    
  } catch (error) {
    console.error('Erreur getCandidatures:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir une candidature par ID
export const getCandidatureById = async (req, res) => {
  try {
    const result = await query('SELECT * FROM admissions WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }
    res.json({ success: true, candidature: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Valider une candidature
export const validerCandidature = async (req, res) => {
  try {
    const { id } = req.params;
    const { commentaire } = req.body;
    
    const result = await query(
      `UPDATE admissions 
       SET status = 'valide', 
           commentaireadmin = $1, 
           datetraitement = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [commentaire || '', id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }
    
    res.json({ success: true, message: 'Candidature validée' });
  } catch (error) {
    console.error('Erreur validation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Rejeter une candidature
export const rejeterCandidature = async (req, res) => {
  try {
    const { id } = req.params;
    const { commentaire } = req.body;
    
    const result = await query(
      `UPDATE admissions 
       SET status = 'rejete', 
           commentaireadmin = $1, 
           datetraitement = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [commentaire || '', id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }
    
    res.json({ success: true, message: 'Candidature rejetée' });
  } catch (error) {
    console.error('Erreur rejet:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir les statistiques
export const getStats = async (req, res) => {
  try {
    const total = await query('SELECT COUNT(*) FROM admissions');
    const enAttente = await query("SELECT COUNT(*) FROM admissions WHERE status = 'en_attente'");
    const valide = await query("SELECT COUNT(*) FROM admissions WHERE status = 'valide'");
    const rejete = await query("SELECT COUNT(*) FROM admissions WHERE status = 'rejete'");
    
    res.json({
      total: parseInt(total.rows[0].count),
      enAttente: parseInt(enAttente.rows[0].count),
      valide: parseInt(valide.rows[0].count),
      rejete: parseInt(rejete.rows[0].count)
    });
  } catch (error) {
    console.error('Erreur stats:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};