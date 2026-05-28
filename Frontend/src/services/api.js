// Configuration de l'API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Service API centralisé
class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  // Récupérer le token d'authentification (admin)
  getAdminToken() {
    return localStorage.getItem('adminToken');
  }

  // Récupérer le token d'authentification (étudiant)
  getUserToken() {
    return localStorage.getItem('token');
  }

  // Headers par défaut (priorité au token étudiant, puis admin)
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Priorité au token étudiant
    const userToken = this.getUserToken();
    if (userToken) {
      headers['Authorization'] = `Bearer ${userToken}`;
    } else {
      const adminToken = this.getAdminToken();
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }
    }
    
    return headers;
  }

  // Headers pour les requêtes admin uniquement
  getAdminHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    const adminToken = this.getAdminToken();
    if (adminToken) {
      headers['Authorization'] = `Bearer ${adminToken}`;
    }
    
    return headers;
  }

  // Méthodes HTTP
  async get(endpoint, useAdminAuth = false) {
    try {
      const headers = useAdminAuth ? this.getAdminHeaders() : this.getHeaders();
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers
      });
      return await response.json();
    } catch (error) {
      console.error(`Erreur GET ${endpoint}:`, error);
      throw error;
    }
  }

  async post(endpoint, data, isFormData = false, useAdminAuth = false) {
    try {
      const headers = useAdminAuth ? this.getAdminHeaders() : this.getHeaders();
      
      // Pour FormData, ne pas définir Content-Type (le navigateur le fait automatiquement)
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }
      
      const options = {
        method: 'POST',
        headers,
        body: isFormData ? data : JSON.stringify(data)
      };
      
      const response = await fetch(`${this.baseURL}${endpoint}`, options);
      return await response.json();
    } catch (error) {
      console.error(`Erreur POST ${endpoint}:`, error);
      throw error;
    }
  }

  async put(endpoint, data, useAdminAuth = false) {
    try {
      const headers = useAdminAuth ? this.getAdminHeaders() : this.getHeaders();
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error(`Erreur PUT ${endpoint}:`, error);
      throw error;
    }
  }

  async delete(endpoint, useAdminAuth = false) {
    try {
      const headers = useAdminAuth ? this.getAdminHeaders() : this.getHeaders();
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers
      });
      return await response.json();
    } catch (error) {
      console.error(`Erreur DELETE ${endpoint}:`, error);
      throw error;
    }
  }

  // ============ PAIEMENTS ============
  
  // Initier un paiement Airtel Money
  async initierPaiementAirtel(candidatureId, amount, phone, reference) {
    return this.post('/payments/airtel/initiate', {
      candidatureId,
      amount,
      phone,
      reference
    });
  }

  // Vérifier statut paiement Airtel
  async verifierStatutAirtel(transactionId) {
    return this.get(`/payments/airtel/status/${transactionId}`);
  }

  // Initier un paiement Moov Money
  async initierPaiementMoov(candidatureId, amount, phone, reference) {
    return this.post('/payments/moov/initiate', {
      candidatureId,
      amount,
      phone,
      reference
    });
  }

  // Vérifier statut paiement Moov
  async verifierStatutMoov(transactionId) {
    return this.get(`/payments/moov/status/${transactionId}`);
  }

  // Paiement direct (sans redirection)
  async paiementDirect(candidatureId, amount, method, phone, reference) {
    return this.post('/payments/direct', {
      candidatureId,
      amount,
      method,
      phone,
      reference
    });
  }

  // Confirmer un paiement
  async confirmerPaiement(candidatureId, reference, amount, method, phone) {
    return this.post('/payments/confirm', {
      candidatureId,
      reference,
      amount,
      method,
      phone
    });
  }

  // ============ AUTHENTIFICATION ============
  
  // Login étudiant
  async login(email, password) {
    return this.post('/auth/login', { email, password });
  }

  // Inscription étudiant
  async register(userData) {
    return this.post('/auth/register', userData);
  }

  // Récupérer le profil
  async getProfil() {
    return this.get('/auth/profil');
  }

  // Mettre à jour le profil
  async updateProfil(data) {
    return this.put('/auth/profil', data);
  }

  // Changer le mot de passe
  async changePassword(oldPassword, newPassword) {
    return this.put('/auth/change-password', { oldPassword, newPassword });
  }

  // Récupérer mes candidatures
  async getMesCandidatures() {
    return this.get('/auth/mes-candidatures');
  }

  // Télécharger l'attestation
  async getAttestation(candidatureId) {
    const token = this.getUserToken();
    if (!token) throw new Error('Non authentifié');
    
    const response = await fetch(`${this.baseURL}/auth/attestation/${candidatureId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur téléchargement');
    }
    
    return await response.blob();
  }

  // ============ ADMISSION ============
  
  // Soumettre une candidature (nouvel étudiant)
  async soumettreCandidature(formData) {
    return this.post('/admissions', formData, true);
  }

  // Soumettre une réinscription
  async soumettreReinscription(data) {
    return this.post('/reinscription', data);
  }

  // Vérifier le statut d'une candidature
  async verifierStatut(reference) {
    return this.get(`/statut/${reference}`);
  }

  // ============ ADMIN ============
  
  // Login admin
  async adminLogin(email, password) {
    return this.post('/auth/login', { email, password }, false, true);
  }

  // Récupérer toutes les candidatures (admin)
  async getCandidatures(status = 'tous', page = 1, search = '') {
    return this.get(`/admin/candidatures?status=${status}&page=${page}&search=${search}`, true);
  }

  // Récupérer les statistiques (admin)
  async getStats() {
    return this.get('/admin/stats', true);
  }

  // Valider une candidature (admin)
  async validerCandidature(id, commentaire = '') {
    return this.put(`/admin/candidatures/${id}/valider`, { commentaire }, true);
  }

  // Rejeter une candidature (admin)
  async rejeterCandidature(id, commentaire = '') {
    return this.put(`/admin/candidatures/${id}/rejeter`, { commentaire }, true);
  }

  // Récupérer une candidature par ID (admin)
  async getCandidatureById(id) {
    return this.get(`/admin/candidatures/${id}`, true);
  }

  // ============ CONTACT ============
  
  // Envoyer un message de contact
  async envoyerMessageContact(data) {
    return this.post('/contact', data);
  }
}

// Instance unique
export const api = new ApiService();
export default api;