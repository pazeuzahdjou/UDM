import mongoose from 'mongoose';
import 'dotenv/config';
import User from '../models/User.js';

const checkAndFixAdmins = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  const superAdmins = await User.find({ role: 'super_admin' });
  
  if (superAdmins.length === 0) {
    console.log('❌ Aucun super_admin trouvé !');
  } else if (superAdmins.length === 1) {
    console.log('✅ Un seul super_admin : OK');
    console.log(`   Email: ${superAdmins[0].email}`);
  } else {
    console.log(`⚠️ ${superAdmins.length} super_admin trouvés ! Correction...`);
    
    // Garder le premier, rétrograder les autres
    const keep = superAdmins[0];
    const toDowngrade = superAdmins.slice(1);
    
    for (const admin of toDowngrade) {
      admin.role = 'admin';
      await admin.save();
      console.log(`   ${admin.email} rétrogradé en admin`);
    }
    
    console.log('✅ Correction terminée');
  }
  
  await mongoose.disconnect();
  process.exit();
};

checkAndFixAdmins();