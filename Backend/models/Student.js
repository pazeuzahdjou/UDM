import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  admissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admission', required: true },
  matricule: { type: String, required: true, unique: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true },
  telephone: { type: String, required: true },
  filiere: { type: String, required: true },
  niveau: { type: String, required: true },
  anneeInscription: { type: String, required: true },
  estActif: { type: Boolean, default: true },
  dateInscription: { type: Date, default: Date.now }
});

StudentSchema.pre('save', async function(next) {
  if (!this.matricule) {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.matricule = `UDM-${year}-${random}`;
  }
  next();
});

export default mongoose.model('Student', StudentSchema);