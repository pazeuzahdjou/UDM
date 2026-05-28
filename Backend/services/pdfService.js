import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Génère une attestation d'inscription au format PDF
 * @param {Object} candidature - Les données de la candidature
 * @returns {Promise<string>} - Le chemin du fichier généré
 */
export const genererAttestation = async (candidature) => {
  return new Promise((resolve, reject) => {
    try {
      const filename = `attestation_${candidature.reference || candidature._id}.pdf`;
      const filepath = path.join(uploadsDir, filename);
      
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);
      
      // En-tête
      doc.fontSize(22).font('Helvetica-Bold').fillColor('#1e5a3a').text('UNIVERSITÉ DE MOUNDOU', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(14).font('Helvetica').fillColor('#4a5568').text('Service des Admissions', { align: 'center' });
      doc.moveDown(1);
      doc.strokeColor('#2e7d54').lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(2);
      
      // Titre
      doc.fontSize(20).font('Helvetica-Bold').fillColor('#2d3748').text('ATTESTATION D\'INSCRIPTION', { align: 'center' });
      doc.moveDown(1.5);
      
      // Corps
      doc.fontSize(12).font('Helvetica').fillColor('#2d3748');
      doc.text('Je soussigné(e), Directeur des Admissions de l\'Université de Moundou, certifie que :', { align: 'left' });
      doc.moveDown(1);
      
      doc.font('Helvetica-Bold');
      doc.text(`Monsieur/Madame : ${candidature.nom || ''} ${candidature.prenom || ''}`, { indent: 20 });
      doc.font('Helvetica');
      doc.text(`Né(e) le : ${candidature.dateNaissance || 'Non renseignée'} à ${candidature.lieuNaissance || 'Non renseigné'}`, { indent: 20 });
      doc.text(`Nationalité : ${candidature.paysOrigine || 'Tchadienne'}`, { indent: 20 });
      doc.text(`Email : ${candidature.email || 'Non renseigné'}`, { indent: 20 });
      doc.text(`Téléphone : ${candidature.telephone || 'Non renseigné'}`, { indent: 20 });
      
      doc.moveDown(1);
      doc.text(`Est régulièrement inscrit(e) à l'Université de Moundou pour l'année académique 2025-2026 dans la filière :`, { align: 'left' });
      doc.moveDown(0.5);
      
      doc.font('Helvetica-Bold').fontSize(14).fillColor('#2e7d54')
        .text(`${candidature.filiere || ''} - Niveau ${candidature.niveau || ''} ${candidature.sousNiveau || ''}`, { align: 'center' });
      
      doc.moveDown(1);
      doc.fontSize(12).font('Helvetica').fillColor('#2d3748');
      doc.text(`Référence d'inscription : ${candidature.reference || 'Non attribuée'}`, { align: 'left' });
      doc.text(`Date d'inscription : ${new Date(candidature.dateSoumission || Date.now()).toLocaleDateString('fr-FR')}`, { align: 'left' });
      
      doc.moveDown(2);
      doc.fontSize(10).fillColor('#718096').text('La présente attestation est délivrée pour servir et valoir ce que de droit.', { align: 'center' });
      doc.moveDown(2);
      
      doc.fontSize(11).font('Helvetica').fillColor('#2d3748')
        .text(`Fait à Moundou, le ${new Date().toLocaleDateString('fr-FR')}`, { align: 'right' });
      
      doc.moveDown(1.5);
      doc.moveTo(350, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.3);
      doc.fontSize(10).text('Le Directeur des Admissions', { align: 'right' });
      doc.text('Dr. Aside Christiant', { align: 'right' });
      
      doc.end();
      
      stream.on('finish', () => {
        console.log(`✅ Attestation PDF générée: ${filename}`);
        resolve(filepath);
      });
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

export const genererAttestationSimple = async (candidature) => {
  return new Promise((resolve, reject) => {
    try {
      const filename = `attestation_simple_${candidature.reference || candidature._id}.pdf`;
      const filepath = path.join(uploadsDir, filename);
      
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);
      
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#1e5a3a').text('UNIVERSITÉ DE MOUNDOU', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(14).text('ATTESTATION D\'INSCRIPTION', { align: 'center' });
      doc.moveDown(2);
      
      doc.fontSize(12).font('Helvetica')
        .text(`Nom : ${candidature.nom} ${candidature.prenom}`, { align: 'left' })
        .text(`Filière : ${candidature.filiere}`, { align: 'left' })
        .text(`Niveau : ${candidature.niveau} ${candidature.sousNiveau}`, { align: 'left' })
        .text(`Référence : ${candidature.reference}`, { align: 'left' })
        .text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, { align: 'left' });
      
      doc.moveDown(2);
      doc.text('Cachet et signature', { align: 'right' });
      doc.end();
      
      stream.on('finish', () => resolve(filepath));
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

export const supprimerAttestation = async (filepath) => {
  try {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      console.log(`🗑️ Attestation supprimée: ${filepath}`);
    }
  } catch (error) {
    console.error('Erreur suppression attestation:', error);
  }
};

export default {
  genererAttestation,
  genererAttestationSimple,
  supprimerAttestation
};