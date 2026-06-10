-- Fichier: schema.sql

-- Table pour les admins
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'admin'
);

-- Table pour les étudiants (c'est le cœur du projet !)
CREATE TABLE etudiants (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    telephone_parent VARCHAR(20),
    date_naissance DATE,
    lieu_naissance VARCHAR(100),
    pays_origine VARCHAR(100),
    filiere VARCHAR(100) NOT NULL,
    niveau VARCHAR(50) NOT NULL,
    annee_bac VARCHAR(4),
    reference_cand VARCHAR(50) UNIQUE NOT NULL,
    statut VARCHAR(20) DEFAULT 'en_attente',
    date_soumission TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les documents
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    etudiant_id INTEGER REFERENCES etudiants(id),
    type_document VARCHAR(50) NOT NULL,
    url_fichier TEXT NOT NULL
);