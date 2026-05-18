// Configuration de l'API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Service API centralisé
class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  // Récupérer le token d'authentification
  getToken() {
    return localStorage.getItem('adminToken');
  }

  // Headers par défaut
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Méthodes HTTP
  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error(`Erreur GET ${endpoint}:`, error);
      throw error;
    }
  }

  async post(endpoint, data, isFormData = false) {
    try {
      const options = {
        method: 'POST',
        headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        body: isFormData ? data : JSON.stringify(data)
      };
      
      if (!isFormData && this.getToken()) {
        options.headers['Authorization'] = `Bearer ${this.getToken()}`;
      } else if (isFormData && this.getToken()) {
        options.headers['Authorization'] = `Bearer ${this.getToken()}`;
      }
      
      const response = await fetch(`${this.baseURL}${endpoint}`, options);
      return await response.json();
    } catch (error) {
      console.error(`Erreur POST ${endpoint}:`, error);
      throw error;
    }
  }

  async put(endpoint, data) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error(`Erreur PUT ${endpoint}:`, error);
      throw error;
    }
  }

  async delete(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders()
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
    return this.post('/auth/login', { email, password });
  }

  // Récupérer toutes les candidatures
  async getCandidatures(status = 'tous', page = 1, search = '') {
    return this.get(`/admin/candidatures?status=${status}&page=${page}&search=${search}`);
  }

  // Récupérer les statistiques
  async getStats() {
    return this.get('/admin/stats');
  }

  // Valider une candidature
  async validerCandidature(id, commentaire = '') {
    return this.put(`/admin/candidatures/${id}/valider`, { commentaire });
  }

  // Rejeter une candidature
  async rejeterCandidature(id, commentaire = '') {
    return this.put(`/admin/candidatures/${id}/rejeter`, { commentaire });
  }

  // Récupérer une candidature par ID
  async getCandidatureById(id) {
    return this.get(`/admin/candidatures/${id}`);
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