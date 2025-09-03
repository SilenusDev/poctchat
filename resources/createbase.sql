-- Table des utilisateurs
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role ENUM('ADMIN','CLIENT') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des conversations (entre 2 utilisateurs max)
CREATE TABLE conversations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user1_id BIGINT NOT NULL,
    user2_id BIGINT NOT NULL,
    titre ENUM('PROBLEME_LOCATION', 'DEMANDE_REPARATION', 'AUTRE') NOT NULL DEFAULT 'AUTRE',
    status ENUM('ACTIVE', 'CLOSE') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user1_id) REFERENCES users(id),
    FOREIGN KEY (user2_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des messages
CREATE TABLE messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insertion des utilisateurs de base
-- Sam User: sam@user.com / User!1234
INSERT INTO users (username, email, password, role, created_at) VALUES 
('Sam', 'sam@user.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye7VFnjZcmWgjk8oJY32/2xbYq4FnnKHW', 'CLIENT', NOW());

-- Tom Admin: tom@admin.com / Admin!1234  
INSERT INTO users (username, email, password, role, created_at) VALUES 
('Tom', 'tom@admin.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye7VFnjZcmWgjk8oJY32/2xbYq4FnnKHW', 'ADMIN', NOW());
