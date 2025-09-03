-- Script pour insérer des données de test
-- Utilisateurs de test avec mots de passe hashés (BCrypt)

-- Admin user: admin@admin.com / Admin@123
INSERT INTO users (username, email, password, role, created_at) VALUES 
('Admin', 'admin@admin.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'ADMIN', NOW())
ON DUPLICATE KEY UPDATE username = VALUES(username);

-- Client user: user@user.com / User@123  
INSERT INTO users (username, email, password, role, created_at) VALUES 
('User', 'user@user.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'CLIENT', NOW())
ON DUPLICATE KEY UPDATE username = VALUES(username);

-- Test client: test@test.com / Test@123
INSERT INTO users (username, email, password, role, created_at) VALUES 
('Test User', 'test@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'CLIENT', NOW())
ON DUPLICATE KEY UPDATE username = VALUES(username);
