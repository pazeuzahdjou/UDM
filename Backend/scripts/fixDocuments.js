import mongoose from 'mongoose';
import 'dotenv/config';
import Admission from '../models/Admission.js';

const fixDocuments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');
    
    // Trouver toutes les candidatures avec documents
    const candidatures = await Admission.find({});
    let count = 0;
    
    for (const candidature of candidatures) {
      let modified = false;
      
      if (candidature.documents) {
        Object.keys(candidature.documents).forEach(key => {
          const value = candidature.documents[key];
          
          // Si le chemin contient '/home/' (chemin absolu)
          if (value && value.includes('/home/')) {
            // Extraire seulement le nom du fichier
            const filename = value.split('/').pop();
            candidature.documents[key] = filename;
            modified = true;
            console.log(`📝 Corrigé ${key}: ${value} -> ${filename}`);
            count++;
          }
        });
        
        if (modified) {
          await candidature.save();
        }
      }
    }
    
    console.log(`✅ ${count} documents corrigés`);
    await mongoose.disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

fixDocuments();