import mongoose from 'mongoose';
import 'dotenv/config';

const MONGO_URI = 'mongodb://localhost:27017/universite_moundou';

const fixPaths = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connecté à MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('admissions');
    
    // Trouver tous les documents
    const docs = await collection.find({}).toArray();
    let modifiedCount = 0;
    
    for (const doc of docs) {
      let needUpdate = false;
      const updateFields = {};
      
      if (doc.documents) {
        for (const [key, value] of Object.entries(doc.documents)) {
          if (value && typeof value === 'string' && value.includes('/home/')) {
            // Extraire uniquement le nom du fichier
            const parts = value.split('/');
            const filename = parts[parts.length - 1];
            updateFields[`documents.${key}`] = filename;
            needUpdate = true;
            console.log(`📝 ${key}: ${value.substring(0, 50)}... -> ${filename}`);
          }
        }
      }
      
      if (needUpdate) {
        await collection.updateOne(
          { _id: doc._id },
          { $set: updateFields }
        );
        modifiedCount++;
      }
    }
    
    console.log(`\n✅ ${modifiedCount} documents corrigés`);
    
    // Vérification
    const remaining = await collection.find({ "documents.diplome": { $regex: "/home/" } }).count();
    console.log(`📊 Restent: ${remaining} documents avec chemins absolus`);
    
    await mongoose.disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

fixPaths();