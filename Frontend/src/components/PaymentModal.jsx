import { useState, useEffect } from 'react';
import api from '../services/api';

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  candidatureId, 
  reference, 
  amount 
}) {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('choix'); // choix, validation, confirmation
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Détection de l'appareil
  const isAndroid = /android/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isMobile = isAndroid || isIOS;
  const isDesktop = !isMobile;

  if (!isOpen) return null;

  // URLs de téléchargement
  const downloadUrls = {
    airtel: {
      playStore: 'https://play.google.com/store/apps/details?id=com.airtel.africa',
      appStore: 'https://apps.apple.com/fr/app/airtel-africa/id1234567890',
      webApp: 'https://myairtel.airtel.africa/',
      apk: 'https://www.apkmirror.com/apk/airtel/airtel-money/',
      official: 'https://www.airtel.africa/mobile-money/'
    },
    moov: {
      playStore: 'https://play.google.com/store/apps/details?id=com.moov.africa',
      appStore: 'https://apps.apple.com/fr/app/moov-money/id1234567891',
      webApp: 'https://moovmoney.moov.africa/',
      apk: 'https://www.apkmirror.com/apk/moov/moov-money/',
      official: 'https://www.moov.africa/moov-money/'
    }
  };

  // Schémas d'application pour redirection
  const appSchemes = {
    airtel: {
      android: 'airtel://',
      ios: 'airtelmoney://',
      universal: 'https://myairtel.airtel.africa/pay'
    },
    moov: {
      android: 'moovmoney://',
      ios: 'moovmoney://',
      universal: 'https://moovmoney.moov.africa/pay'
    }
  };

  // Rediriger vers l'application mobile ou page de téléchargement
  const redirectToMobileApp = (method) => {
    const scheme = appSchemes[method];
    const download = downloadUrls[method];
    
    let appUrl = '';
    let downloadUrl = '';
    
    if (isAndroid) {
      appUrl = scheme.android;
      downloadUrl = download.playStore;
    } else if (isIOS) {
      appUrl = scheme.ios;
      downloadUrl = download.appStore;
    } else {
      // Sur ordinateur, ouvrir directement le site web
      appUrl = scheme.universal;
      downloadUrl = download.official;
    }
    
    // Ouvrir l'application avec un délai
    window.location.href = appUrl;
    
    // Afficher un message pendant la redirection
    setSuccess(`Redirection vers ${method === 'airtel' ? 'AIRTEL MONEY' : 'MOOV MONEY'}...`);
    
    // Si l'application n'est pas installée, proposer le téléchargement après 3 secondes
    setTimeout(() => {
      const message = `
        ⚠️ L'application ${method === 'airtel' ? 'AIRTEL MONEY' : 'MOOV MONEY'} n'est pas installée sur votre appareil.
        
        Souhaitez-vous la télécharger ?
        
        ✓ Play Store (Android)
        ✓ App Store (iOS)
        ✓ Version Web
      `;
      
      const userChoice = window.confirm(message);
      
      if (userChoice) {
        // Ouvrir le Play Store/App Store dans un nouvel onglet
        window.open(downloadUrl, '_blank');
      }
    }, 3000);
  };

  // Afficher une modal d'instruction pour ordinateur
  const showDesktopInstructions = (method) => {
    const download = downloadUrls[method];
    
    setError(`
      📱 Paiement sur mobile uniquement !
      
      Pour effectuer votre paiement ${method === 'airtel' ? 'AIRTEL MONEY' : 'MOOV MONEY'} :
      
      1️⃣ Utilisez votre téléphone mobile
      2️⃣ Scannez le QR code ci-dessous (si disponible)
      3️⃣ Ou utilisez le code USSD : ${method === 'airtel' ? '*422#' : '*556#'}
      
      📲 Téléchargez l'application sur : ${download.official}
    `);
  };

  // Initier le paiement via API
  const handleInitiatePayment = async (method) => {
    setPaymentMethod(method);
    setError('');
    
    if (!phone || phone.length < 8) {
      setError('Veuillez entrer un numéro de téléphone valide (8 chiffres minimum)');
      return;
    }
    
    setLoading(true);
    setStep('validation');
    
    try {
      let response;
      if (method === 'airtel') {
        response = await api.initierPaiementAirtel(candidatureId, amount, phone, reference);
      } else {
        response = await api.initierPaiementMoov(candidatureId, amount, phone, reference);
      }
      
      if (response.success) {
        setTransactionId(response.transactionId);
        setSuccess('✅ Paiement initié ! Veuillez confirmer sur votre téléphone.');
        
        // Démarrer le compte à rebours
        setCountdown(30);
        
        // Vérifier le statut périodiquement
        const checkInterval = setInterval(async () => {
          let statusResponse;
          if (method === 'airtel') {
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
            setStep('choix');
            setLoading(false);
          }
        }, 3000);
        
        // Arrêter après 2 minutes
        setTimeout(() => clearInterval(checkInterval), 120000);
        
      } else {
        setError(response.message || 'Erreur lors de l\'initiation du paiement');
        setStep('choix');
        setLoading(false);
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      setStep('choix');
      setLoading(false);
    }
  };

  // Redirection directe vers l'application + vérification
  const handleRedirectPayment = (method) => {
    setPaymentMethod(method);
    
    if (isMobile) {
      // Sur mobile : rediriger vers l'application
      redirectToMobileApp(method);
      setStep('waiting_mobile');
    } else {
      // Sur ordinateur : afficher instructions
      showDesktopInstructions(method);
    }
  };

  // Télécharger l'application
  const handleDownloadApp = (method) => {
    const download = downloadUrls[method];
    
    if (isAndroid) {
      window.open(download.playStore, '_blank');
    } else if (isIOS) {
      window.open(download.appStore, '_blank');
    } else {
      window.open(download.official, '_blank');
    }
  };

  // Code USSD
  const getUssdCode = (method) => {
    return method === 'airtel' ? '*422#' : '*556#';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full p-8 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">
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

        {/* ÉTAPE 1 : CHOIX DU MODE DE PAIEMENT */}
        {step === 'choix' && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Numéro de téléphone</label>
            <input
              type="tel"
              placeholder="66 XX XX XX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            
            {/* Airtel Money */}
            <button
              onClick={() => handleRedirectPayment('airtel')}
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 rounded-2xl font-bold transition flex items-center justify-between px-6 disabled:opacity-50 group"
            >
              <span className="text-2xl">📱</span>
              <span className="flex flex-col items-center">
                <span>AIRTEL MONEY</span>
                <span className="text-xs opacity-75">Paiement mobile</span>
              </span>
              <span className="group-hover:translate-x-1 transition">→</span>
            </button>
            
            {/* Moov Money */}
            <button
              onClick={() => handleRedirectPayment('moov')}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-2xl font-bold transition flex items-center justify-between px-6 disabled:opacity-50 group"
            >
              <span className="text-2xl">📱</span>
              <span className="flex flex-col items-center">
                <span>MOOV MONEY</span>
                <span className="text-xs opacity-75">Paiement mobile</span>
              </span>
              <span className="group-hover:translate-x-1 transition">→</span>
            </button>
            
            <div className="mt-4 p-3 bg-yellow-50 rounded-xl text-xs text-yellow-800 text-center">
              <p>🔒 Paiement sécurisé par chiffrement SSL</p>
              <p className="mt-1">📱 Pour les paiements sur ordinateur, utilisez le code USSD : <strong>{getUssdCode(paymentMethod || 'airtel')}</strong></p>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : ATTENTE SUR MOBILE */}
        {step === 'waiting_mobile' && (
          <div className="text-center space-y-4">
            <div className="animate-spin text-5xl mb-4">⏳</div>
            <p className="text-gray-700 font-semibold">Redirection vers {paymentMethod === 'airtel' ? 'AIRTEL MONEY' : 'MOOV MONEY'}...</p>
            <p className="text-sm text-gray-500">
              Si l'application ne s'ouvre pas automatiquement :
            </p>
            <button
              onClick={() => handleDownloadApp(paymentMethod)}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
            >
              📲 Télécharger l'application
            </button>
            <button
              onClick={() => {
                setStep('choix');
                setError('');
              }}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
            >
              ← Retour
            </button>
            <div className="mt-3 p-3 bg-blue-50 rounded-xl">
              <p className="text-xs text-blue-800">
                💡 Alternative : Composez le code USSD <strong>{getUssdCode(paymentMethod)}</strong> sur votre téléphone
              </p>
            </div>
          </div>
        )}

        {/* ÉTAPE 2bis : VALIDATION APRÈS PAIEMENT */}
        {step === 'validation' && (
          <div className="text-center space-y-4">
            <div className="animate-spin text-5xl mb-4">⏳</div>
            <p className="text-gray-700 font-semibold">En attente de confirmation...</p>
            <p className="text-sm text-gray-500">
              Veuillez confirmer le paiement sur votre application {paymentMethod === 'airtel' ? 'AIRTEL MONEY' : 'MOOV MONEY'}
            </p>
            {countdown > 0 && (
              <p className="text-xs text-gray-400">Expire dans {countdown} secondes</p>
            )}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              onClick={() => {
                setStep('choix');
                setError('');
              }}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
            >
              ← Annuler
            </button>
          </div>
        )}

        {/* ÉTAPE 3 : CONFIRMATION */}
        {step === 'confirmation' && (
          <div className="text-center space-y-4">
            <div className="text-6xl">✅</div>
            <h4 className="text-xl font-bold text-green-600">Paiement confirmé !</h4>
            <p className="text-gray-600">Votre paiement a été enregistré avec succès.</p>
            <p className="text-xs text-gray-500">Référence: {transactionId}</p>
            <button
              onClick={() => {
                onClose();
                window.location.reload();
              }}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Terminer
            </button>
          </div>
        )}

        {/* Affichage des erreurs */}
        {error && step !== 'validation' && (
          <div className="mt-4 p-3 bg-red-50 rounded-xl text-red-700 text-sm whitespace-pre-line">
            {error}
          </div>
        )}

        {/* Liens de téléchargement */}
        {step === 'choix' && (
          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-xs text-gray-400 mb-2">Applications disponibles sur :</p>
            <div className="flex justify-center gap-4">
              <a 
                href={downloadUrls.airtel.playStore} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700 text-xs flex items-center gap-1"
              >
                <span>📱</span> Airtel
              </a>
              <a 
                href={downloadUrls.moov.playStore} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
              >
                <span>📱</span> Moov
              </a>
              <span className="text-gray-300">|</span>
              <span className="text-xs text-gray-400">Code USSD: *422# / *556#</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}