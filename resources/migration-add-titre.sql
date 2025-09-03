-- Script de migration pour ajouter la colonne titre à la table conversations
-- À exécuter sur la base de données existante

-- Ajouter la colonne titre à la table conversations
ALTER TABLE conversations 
ADD COLUMN titre ENUM('PROBLEME_LOCATION', 'DEMANDE_REPARATION', 'AUTRE') NOT NULL DEFAULT 'AUTRE' 
AFTER user2_id;

-- Vérifier que la migration s'est bien passée
DESCRIBE conversations;
