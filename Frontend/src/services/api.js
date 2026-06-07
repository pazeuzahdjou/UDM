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

  // Headers pour les requêtes normales (sans Content-Type fixe)
  getHeaders(isFormData = false) {
    const headers = {};
    
    // Ajouter le token
    const userToken = this.getUserToken();
    if (userToken) {
      headers['Authorization'] = `Bearer ${userToken}`;
    } else {
      const adminToken = this.getAdminToken();
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }
    }
    
    // Ajouter Content-Type uniquement si ce n'est pas du FormData
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    return headers;
  }

  // Headers pour les requêtes admin uniquement
  getAdminHeaders(isFormData = false) {
    const headers = {};
    
    const adminToken = this.getAdminToken();
    if (adminToken) {
      headers['Authorization'] = `Bearer ${adminToken}`;
    }
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    return headers;
  }

  // Méthodes HTTP
  async get(endpoint, useAdminAuth = false) {
    try {
      const headers = useAdminAuth ? this.getAdminHeaders(false) : this.getHeaders(false);
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
      // 🔧 CORRECTION : Passer isFormData pour ne pas ajouter Content-Type
      const headers = useAdminAuth 
        ? this.getAdminHeaders(isFormData) 
        : this.getHeaders(isFormData);
      
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
      const headers = useAdminAuth ? this.getAdminHeaders(false) : this.getHeaders(false);
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
      const headers = useAdminAuth ? this.getAdminHeaders(false) : this.getHeaders(false);
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

  // ============ AUTHENTIFICATION ============
  
  async login(email, password) {
    return this.post('/auth/login', { email, password });
  }

  async register(userData) {
    return this.post('/auth/register', userData);
  }

  async getProfil() {
    return this.get('/auth/profil');
  }

  async updateProfil(data) {
    return this.put('/auth/profil', data);
  }

  async changePassword(oldPassword, newPassword) {
    return this.put('/auth/change-password', { oldPassword, newPassword });
  }

  async getMesCandidatures() {
    return this.get('/auth/mes-candidatures');
  }

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
  
  async soumettreCandidature(formData) {
    return this.post('/admissions', formData, true);
  }

  async soumettreReinscription(data) {
    return this.post('/reinscription', data);
  }

  async verifierStatut(reference) {
    return this.get(`/statut/${reference}`);
  }

  // ============ PAIEMENTS ============
  
  async initierPaiementAirtel(candidatureId, amount, phone, reference) {
    return this.post('/payments/airtel/initiate', {
      candidatureId,
      amount,
      phone,
      reference
    });
  }

  async verifierStatutAirtel(transactionId) {
    return this.get(`/payments/airtel/status/${transactionId}`);
  }

  async initierPaiementMoov(candidatureId, amount, phone, reference) {
    return this.post('/payments/moov/initiate', {
      candidatureId,
      amount,
      phone,
      reference
    });
  }

  async verifierStatutMoov(transactionId) {
    return this.get(`/payments/moov/status/${transactionId}`);
  }

  async paiementDirect(candidatureId, amount, method, phone, reference) {
    return this.post('/payments/direct', {
      candidatureId,
      amount,
      method,
      phone,
      reference
    });
  }

  async confirmerPaiement(candidatureId, reference, amount, method, phone) {
    return this.post('/payments/confirm', {
      candidatureId,
      reference,
      amount,
      method,
      phone
    });
  }

  // ============ ADMIN ============
  
  async adminLogin(email, password) {
    return this.post('/auth/login', { email, password }, false, true);
  }

  async getCandidatures(status = 'tous', page = 1, search = '') {
    return this.get(`/admin/candidatures?status=${status}&page=${page}&search=${search}`, true);
  }

  async getStats() {
    return this.get('/admin/stats', true);
  }

  async validerCandidature(id, commentaire = '') {
    return this.put(`/admin/candidatures/${id}/valider`, { commentaire }, true);
  }

  async rejeterCandidature(id, commentaire = '') {
    return this.put(`/admin/candidatures/${id}/rejeter`, { commentaire }, true);
  }

  async getCandidatureById(id) {
    return this.get(`/admin/candidatures/${id}`, true);
  }

  // ============ CONTACT ============
  
  async envoyerMessageContact(data) {
    return this.post('/contact', data);
  }
}

// Instance unique
export const api = new ApiService();
export default api;