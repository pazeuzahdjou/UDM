import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function PaymentStatus({ paymentId }) {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await API.get(`/payments/status/${paymentId}`);
        setPayment(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
    
    // Rafraîchir toutes les 5 secondes si en attente
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [paymentId]);

  const telechargerRecu = async () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/payments/receipt/${paymentId}?token=${token}`, '_blank');
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">💰 Statut du paiement</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span>Référence</span>
          <span className="font-mono font-bold">{payment?.reference}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span>Montant</span>
          <span className="font-bold text-green-600">{payment?.amount?.toLocaleString()} FCFA</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span>Statut</span>
          {payment?.status === 'confirme' && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">✅ Confirmé</span>
          )}
          {payment?.status === 'en_attente' && (
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">⏳ En attente de confirmation</span>
          )}
          {payment?.status === 'echoue' && (
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">❌ Échoué</span>
          )}
        </div>
        
        {payment?.confirmedAt && (
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span>Date confirmation</span>
            <span>{new Date(payment.confirmedAt).toLocaleString('fr-FR')}</span>
          </div>
        )}
        
        {payment?.status === 'confirme' && payment?.receiptUrl && (
          <button
            onClick={telechargerRecu}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            📄 Télécharger le reçu PDF
          </button>
        )}
      </div>
    </div>
  );
}