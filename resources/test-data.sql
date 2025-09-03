-- Script pour insérer des données de test
-- Utilisateurs de test avec mots de passe hashés (BCrypt)

-- Sam User: sam@user.com / password123
INSERT INTO users (username, email, password, role, created_at) VALUES 
('Sam User', 'sam@user.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'CLIENT', NOW())
ON DUPLICATE KEY UPDATE username = VALUES(username), password = VALUES(password);

-- Tom Admin: tom@admin.com / password123
INSERT INTO users (username, email, password, role, created_at) VALUES 
('Tom Admin', 'tom@admin.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'ADMIN', NOW())
ON DUPLICATE KEY UPDATE username = VALUES(username), password = VALUES(password);

-- Test User: test@test.com / password123
INSERT INTO users (username, email, password, role, created_at) VALUES 
('Test User', 'test@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'CLIENT', NOW())
ON DUPLICATE KEY UPDATE username = VALUES(username), password = VALUES(password);
