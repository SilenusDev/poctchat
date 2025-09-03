# POC Tchat - Application de Chat en Temps Réel

Application de chat multi-utilisateurs avec authentification et WebSocket, développée avec Spring Boot (backend) et Angular (frontend).

## 🛠️ Technologies

- **Backend**: Spring Boot 3.3, MySQL, WebSocket, JWT
- **Frontend**: Angular, TypeScript, SockJS/STOMP
- **Base de données**: MySQL

## 📋 Prérequis

- **Java 17+**
- **Node.js 18+** et npm
- **MySQL 8.0+**
- **Angular CLI**: `npm install -g @angular/cli`

## 🚀 Installation et Configuration

### 1. Configuration de la Base de Données

Créer une base de données MySQL :
```sql
CREATE DATABASE poctchat;
```

Exécuter le script SQL pour créer les tables et insérer les données de test :
```bash
mysql -u votre_username -p poctchat < resources/createbase.sql
```

Configurer les identifiants dans `back/.env` :
```env
DATABASE_URL=jdbc:mysql://localhost:3306/poctchat?serverTimezone=UTC
DATABASE_USERNAME=votre_username
DATABASE_PASSWORD=votre_password
JWT_SECRET=maSuperCleSecretePourMonJWTQuiDoitEtreTresLonguePourLaSecurite123456789
```

### 2. Installation du Backend (Spring Boot)

```bash
cd back
mvn clean install
./mvnw spring-boot:run
```

Le backend sera accessible sur `http://localhost:3001`

### 3. Installation du Frontend (Angular)

```bash
cd front
npm install
ng serve
```

Le frontend sera accessible sur `http://localhost:4200`

## 🔧 Commandes de Développement

### Backend
```bash
# Compiler le projet
mvn clean compile

# Lancer les tests
mvn test

# Démarrer l'application
./mvnw spring-boot:run

# Build pour production
mvn clean package
```

### Frontend
```bash
# Installer les dépendances
npm install

# Démarrer en mode développement
ng serve

# Build pour production
ng build

# Lancer les tests
ng test
```

## 🌟 Fonctionnalités

- ✅ **Authentification JWT** avec rôles (CLIENT/ADMIN)
- ✅ **Chat en temps réel** via WebSocket
- ✅ **Sessions isolées** par onglet/fenêtre
- ✅ **Conversations multiples** par type de demande
- ✅ **Interface utilisateur** et **interface administrateur**
- ✅ **Support client** avec catégories de demandes

## 📁 Structure du Projet

```
poc-tchat/
├── back/                 # Backend Spring Boot
│   ├── src/main/java/    # Code source Java
│   ├── src/main/resources/ # Configuration et ressources
│   └── .env              # Variables d'environnement
├── front/                # Frontend Angular
│   ├── src/app/          # Code source Angular
│   └── proxy.conf.json   # Configuration proxy
└── README.md
```

## 🔐 Comptes de connexion

User : sam@user.com / User!1234
User : max@user.com / User!1234
Admin : tom@admin.com / Admin!1234

