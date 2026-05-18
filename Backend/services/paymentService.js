import axios from 'axios';

// ============ Configuration Airtel Money ============
const airtelConfig = {
  baseURL: process.env.AIRTEL_API_BASE_URL || 'https://openapiuat.airtel.africa',
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  country: process.env.COUNTRY || 'TD',
  currency: process.env.CURRENCY || 'XAF'
};

// ============ Configuration Moov Money (Tigo) ============
const moovConfig = {
  baseURL: process.env.MOOV_API_BASE_URL || 'https://api.moov.td/v1',
  clientId: process.env.MOOV_CLIENT_ID,
  clientSecret: process.env.MOOV_CLIENT_SECRET
};

// Cache des tokens
let airtelTokenCache = null;
let airtelTokenExpiry = null;
let moovTokenCache = null;
let moovTokenExpiry = null;

// ============ Airtel Money - Obtenir token ============
const getAirtelAccessToken = async () => {
  if (airtelTokenCache && airtelTokenExpiry && Date.now() < airtelTokenExpiry - 60000) {
    return airtelTokenCache;
  }

  try {
    const response = await axios.post(
      `${airtelConfig.baseURL}/auth/oauth2/token`,
      {
        client_id: airtelConfig.clientId,
        client_secret: airtelConfig.clientSecret,
        grant_type: 'client_credentials'
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    airtelTokenCache = response.data.access_token;
    airtelTokenExpiry = Date.now() + (response.data.expires_in * 1000);
    
    console.log('✅ Token Airtel obtenu');
    return airtelTokenCache;
  } catch (error) {
    console.error('❌ Erreur authentification Airtel:', error.response?.data || error.message);
    throw new Error('Impossible de s\'authentifier auprès d\'Airtel');
  }
};

// ============ Moov Money - Obtenir token ============
const getMoovAccessToken = async () => {
  if (moovTokenCache && moovTokenExpiry && Date.now() < moovTokenExpiry - 60000) {
    return moovTokenCache;
  }

  try {
    const response = await axios.post(
      `${moovConfig.baseURL}/oauth/token`,
      {
        client_id: moovConfig.clientId,
        client_secret: moovConfig.clientSecret,
        grant_type: 'client_credentials'
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    moovTokenCache = response.data.access_token;
    moovTokenExpiry = Date.now() + (response.data.expires_in * 1000);
    
    console.log('✅ Token Moov obtenu');
    return moovTokenCache;
  } catch (error) {
    console.error('❌ Erreur authentification Moov:', error.response?.data || error.message);
    throw new Error('Impossible de s\'authentifier auprès de Moov');
  }
};

// ============ Airtel Money - Initier paiement ============
export const initierPaiementAirtel = async (amount, phoneNumber, reference) => {
  try {
    const token = await getAirtelAccessToken();
    
    // Nettoyer le numéro de téléphone
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    const msisdn = cleanPhone.startsWith('235') ? cleanPhone : `235${cleanPhone}`;

    const paymentData = {
      amount: amount.toString(),
      phone_number: msisdn,
      transaction_reference: reference,
      country: airtelConfig.country,
      currency: airtelConfig.currency
    };

    const response = await axios.post(
      `${airtelConfig.baseURL}/standard/v1/payments/`,
      paymentData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Country': airtelConfig.country,
          'X-Currency': airtelConfig.currency
        }
      }
    );

    console.log('✅ Paiement Airtel initié:', response.data);
    return {
      success: true,
      transactionId: response.data.transaction_id,
      status: response.data.status,
      message: 'Paiement initié avec succès'
    };
  } catch (error) {
    console.error('❌ Erreur paiement Airtel:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors du paiement Airtel'
    };
  }
};

// ============ Airtel Money - Vérifier statut ============
export const verifierStatutPaiementAirtel = async (transactionId) => {
  try {
    const token = await getAirtelAccessToken();
    
    const response = await axios.get(
      `${airtelConfig.baseURL}/standard/v1/payments/${transactionId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Country': airtelConfig.country
        }
      }
    );

    return {
      success: true,
      status: response.data.status,
      data: response.data
    };
  } catch (error) {
    console.error('❌ Erreur vérification Airtel:', error.response?.data || error.message);
    return {
      success: false,
      status: 'FAILED',
      message: 'Impossible de vérifier le statut'
    };
  }
};

// ============ Moov Money - Initier paiement ============
export const initierPaiementMoov = async (amount, phoneNumber, reference) => {
  try {
    const token = await getMoovAccessToken();
    
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    const msisdn = cleanPhone.startsWith('235') ? cleanPhone : `235${cleanPhone}`;

    const paymentData = {
      amount: amount,
      currency: 'XAF',
      external_id: reference,
      payer: {
        party_id_type: 'MSISDN',
        party_id: msisdn
      },
      payer_message: 'Paiement inscription Université de Moundou',
      payee_note: 'Frais de scolarité'
    };

    const response = await axios.post(
      `${moovConfig.baseURL}/collection/token/request-to-pay`,
      paymentData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': process.env.MOOV_SUBSCRIPTION_KEY || ''
        }
      }
    );

    console.log('✅ Paiement Moov initié:', response.data);
    return {
      success: true,
      transactionId: response.data.transaction_id || response.data.reference_id,
      status: 'PENDING',
      message: 'Paiement initié avec succès'
    };
  } catch (error) {
    console.error('❌ Erreur paiement Moov:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Erreur lors du paiement Moov'
    };
  }
};

// ============ Moov Money - Vérifier statut ============
export const verifierStatutPaiementMoov = async (transactionId) => {
  try {
    const token = await getMoovAccessToken();
    
    const response = await axios.get(
      `${moovConfig.baseURL}/collection/token/request-to-pay/${transactionId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Ocp-Apim-Subscription-Key': process.env.MOOV_SUBSCRIPTION_KEY || ''
        }
      }
    );

    return {
      success: true,
      status: response.data.status,
      data: response.data
    };
  } catch (error) {
    console.error('❌ Erreur vérification Moov:', error.response?.data || error.message);
    return {
      success: false,
      status: 'FAILED',
      message: 'Impossible de vérifier le statut'
    };
  }
};

// ============ Simulation de paiement (pour test sans API réelle) ============
export const simulerPaiement = async (amount, phoneNumber, reference) => {
  console.log(`💳 [SIMULATION] Paiement de ${amount} FCFA par ${phoneNumber}, réf: ${reference}`);
  
  // Simuler un délai de traitement
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simuler un succès aléatoire (90% de succès)
  const success = Math.random() < 0.9;
  
  if (success) {
    return {
      success: true,
      transactionId: `SIM-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      status: 'SUCCESS',
      message: 'Paiement simulé avec succès'
    };
  } else {
    return {
      success: false,
      message: 'Simulation: Le paiement a échoué'
    };
  }
};