import { useState } from 'react';
import api from '../services/api';

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  candidatureId, 
  reference, 
  amount 
}) {
  const [step, setStep] = useState('choix'); // choix, selection_mode, validation, confirmation
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  // Redirection vers l'application mobile
  const redirectToMobileApp = () => {
    const isAndroid = /android/i.test(navigator.userAgent);
    let appUrl = '';
    let downloadUrl = '';
    
    if (selectedOperator === 'airtel') {
      appUrl = isAndroid ? 'airtel://' : 'airtelmoney://';
      downloadUrl = 'https://play.google.com/store/apps/details?id=com.airtel.africa';
    } else {
      appUrl = isAndroid ? 'moovmoney://' : 'moovmoney://';
      downloadUrl = 'https://play.google.com/store/apps/details?id=com.moov.africa';
    }
    
    window.location.href = appUrl;
    
    setTimeout(() => {
      const confirmDownload = window.confirm(
        `L'application ${selectedOperator === 'airtel' ? 'Airtel Money' : 'Moov Money'} n'est pas installée.\n\n` +
        `Voulez-vous la télécharger depuis le Play Store ?`
      );
      if (confirmDownload) {
        window.open(downloadUrl, '_blank');
      }
    }, 2000);
  };

  // Paiement via API (intégré)
  const handleApiPayment = async () => {
    setError('');
    
    if (!phone || phone.length < 8) {
      setError('Veuillez entrer un numéro de téléphone valide');
      return;
    }
    
    setLoading(true);
    setStep('validation');
    
    try {
      let response;
      if (selectedOperator === 'airtel') {
        response = await api.initierPaiementAirtel(candidatureId, amount, phone, reference);
      } else {
        response = await api.initierPaiementMoov(candidatureId, amount, phone, reference);
      }
      
      if (response.success) {
        setTransactionId(response.transactionId);
        setSuccess('Paiement initié ! Vérification en cours...');
        
        // Vérifier le statut périodiquement
        const checkInterval = setInterval(async () => {
          let statusResponse;
          if (selectedOperator === 'airtel') {
            statusResponse = await api.verifierStatutAirtel(response.transactionId);
          } else {
            statusResponse = await api.verifierStatutMoov(response.transactionId);
          }
          
          if (statusResponse.status === 'SUCCESS' || statusResponse.status === 'SUCCESSFUL') {
            clearInterval(checkInterval);
            setStep('confirmation');
            setLoading(false);
            setSuccess('✅ Paiement confirmé avec succès !');
            setTimeout(() => {
              onClose();
              window.location.reload();
            }, 2000);
          } else if (statusResponse.status === 'FAILED') {
            clearInterval(checkInterval);
            setError('❌ Le paiement a échoué. Veuillez réessayer.');
            setStep('selection_mode');
            setLoading(false);
          }
        }, 3000);
        
        setTimeout(() => clearInterval(checkInterval), 120000);
      } else {
        setError(response.message || 'Erreur lors du paiement');
        setStep('selection_mode');
        setLoading(false);
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      setStep('selection_mode');
      setLoading(false);
    }
  };

  // Paiement via application mobile
  const handleMobilePayment = () => {
    redirectToMobileApp();
    setStep('validation_mobile');
    setSuccess('Redirection vers l\'application mobile...');
    
    setTimeout(() => {
      setStep('confirmation');
      setSuccess('✅ Si le paiement est effectué, il sera confirmé automatiquement.');
    }, 5000);
  };

  const resetModal = () => {
    setStep('choix');
    setSelectedOperator(null);
    setPhone('');
    setError('');
    setSuccess('');
    setLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div className="bg-white rounded-3xl max-w-md w-full p-8 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">💰</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Paiement sécurisé</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{amount?.toLocaleString()} FCFA</p>
          <p className="text-xs text-gray-500 mt-1">Réf: {reference}</p>
        </div>

        {/* ÉTAPE 1: Choix de l'opérateur */}
        {step === 'choix' && (
          <div className="space-y-3">
            <button
              onClick={() => { setSelectedOperator('airtel'); setStep('selection_mode'); }}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-5 rounded-2xl font-bold transition flex items-center justify-between px-6"
            >
              <span className="text-3xl">📱</span>
              <span className="text-xl">AIRTEL MONEY</span>
              <span className="text-2xl">→</span>
            </button>
            
            <button
              onClick={() => { setSelectedOperator('moov'); setStep('selection_mode'); }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-5 rounded-2xl font-bold transition flex items-center justify-between px-6"
            >
              <span className="text-3xl">📱</span>
              <span className="text-xl">MOOV MONEY</span>
              <span className="text-2xl">→</span>
            </button>
            
            <div className="mt-4 p-3 bg-yellow-50 rounded-xl text-xs text-yellow-800 text-center">
              🔒 Paiement sécurisé par chiffrement SSL
            </div>
          </div>
        )}

        {/* ÉTAPE 2: Choix du mode de paiement */}
        {step === 'selection_mode' && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${selectedOperator === 'airtel' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                {selectedOperator === 'airtel' ? '📱 Airtel Money' : '📱 Moov Money'}
              </div>
            </div>
            
            <button
              onClick={handleMobilePayment}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-4 rounded-2xl font-semibold transition flex items-center justify-between px-6"
            >
              <span className="text-2xl">📲</span>
              <span>Payer via l'application mobile</span>
              <span className="text-xl">→</span>
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Numéro de téléphone</label>
              <input
                type="tel"
                placeholder="66 XX XX XX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              
              <button
                onClick={handleApiPayment}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-2xl font-semibold transition disabled:opacity-50 flex items-center justify-between px-6"
              >
                <span className="text-2xl">💳</span>
                <span>Payer directement (sans application)</span>
                <span className="text-xl">→</span>
              </button>
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-r-xl text-sm">
                {error}
              </div>
            )}
            
            <button
              onClick={() => setStep('choix')}
              className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm"
            >
              ← Retour
            </button>
          </div>
        )}

        {/* ÉTAPE 3a: Paiement via API en cours */}
        {step === 'validation' && (
          <div className="text-center space-y-4">
            <div className="animate-spin text-5xl mb-4">⏳</div>
            <p className="text-gray-700 font-semibold">Traitement du paiement en cours...</p>
            <p className="text-sm text-gray-500">
              Veuillez patienter pendant que nous vérifions votre transaction
            </p>
            {success && <div className="text-green-600 text-sm">{success}</div>}
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>
        )}

        {/* ÉTAPE 3b: Paiement via application mobile */}
        {step === 'validation_mobile' && (
          <div className="text-center space-y-4">
            <div className="text-5xl mb-4">📱</div>
            <p className="text-gray-700 font-semibold">Redirection vers l'application...</p>
            <p className="text-sm text-gray-500">
              Veuillez effectuer le paiement sur votre application {selectedOperator === 'airtel' ? 'Airtel Money' : 'Moov Money'}
            </p>
            {success && <div className="text-green-600 text-sm">{success}</div>}
            
            <button
              onClick={() => {
                setStep('confirmation');
                setSuccess('✅ Paiement effectué ? Cliquez sur confirmer');
              }}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold mt-4"
            >
              J'ai effectué le paiement
            </button>
          </div>
        )}

        {/* ÉTAPE 4: Confirmation */}
        {step === 'confirmation' && (
          <div className="text-center space-y-4">
            <div className="text-6xl">✅</div>
            <h4 className="text-xl font-bold text-green-600">Paiement traité</h4>
            {success && <p className="text-gray-600">{success}</p>}
            {transactionId && (
              <div className="bg-gray-100 rounded-xl p-3">
                <p className="text-xs text-gray-500">Référence transaction</p>
                <p className="font-mono text-sm">{transactionId}</p>
              </div>
            )}
            <button
              onClick={() => {
                handleClose();
                window.location.reload();
              }}
              className="w-full bg-gray-200 hover:bg-gray-300 py-3 rounded-xl font-semibold transition"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}