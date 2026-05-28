import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  // Références
  candidatureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admission', required: true },
  reference: { type: String, required: true, unique: true },
  
  // Informations paiement
  amount: { type: Number, required: true },
  method: { type: String, enum: ['airtel', 'moov'], required: true },
  phone: { type: String, required: true },
  
  // Statut du paiement
  status: { 
    type: String, 
    enum: ['en_attente', 'confirme', 'echoue', 'rembourse'], 
    default: 'en_attente' 
  },
  
  // Transaction IDs
  transactionId: { type: String, unique: true, sparse: true },
  providerReference: { type: String },
  
  // Preuves
  receiptUrl: { type: String },
  screenshotUrl: { type: String },
  
  // Horodatage
  initiatedAt: { type: Date, default: Date.now },
  confirmedAt: { type: Date },
  
  // Admin tracking
  confirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adminNotes: { type: String },
  
  // Webhook
  webhookReceived: { type: Boolean, default: false },
  webhookData: { type: Object }
});

export default mongoose.model('Payment', PaymentSchema);