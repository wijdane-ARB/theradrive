# TheraDrive — Backend API

> API REST pour la plateforme de bien-être mental mobile premium au Maroc.  
> Construit avec **Spring Boot 3** · **Spring Security (JWT)** · **PostgreSQL**

---

## À propos

TheraDrive est un salon de thérapie mobile qui se déplace chez le client. Ce dépôt contient le backend complet de la plateforme : authentification, gestion des réservations, paiements et notifications.

Frontend : [theradrive-frontend](https://github.com/wijdane-ARB/theradrive) — déployé sur [theradrivema.arbwij.workers.dev](https://theradrivema.arbwij.workers.dev)

---

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | Spring Boot 3 |
| Sécurité | Spring Security + JWT (jjwt) |
| Persistance | Spring Data JPA + Hibernate |
| Base de données | PostgreSQL |
| Notifications | Spring Mail (SMTP) |
| Documentation API | Springdoc OpenAPI (Swagger UI) |
| Build | Maven |
| Déploiement | Railway / Render |

---

## Fonctionnalités

### Authentification & Utilisateurs
- Inscription / connexion avec JWT (access token + refresh token)
- Rôles : `CLIENT`, `THERAPEUTE`, `ADMIN`
- Gestion de profil et changement de mot de passe

### Réservations
- Consultation des créneaux disponibles par thérapeute, ville et date
- Création, modification et annulation de réservation
- Gestion des conflits de créneaux (concurrence)
- Statuts : `PENDING` → `CONFIRMED` → `COMPLETED` / `CANCELLED`

### Paiements
- Intégration passerelle de paiement (CMI / Stripe)
- Suivi du statut de paiement par réservation
- Historique des transactions

### Notifications
- Email de confirmation de réservation (sous 2h)
- Rappel de séance (24h avant)
- Notification d'annulation

---

## Structure du projet

```
theradrive-backend/
│
├── src/main/java/ma/theradrive/
│   ├── auth/                  # Authentification, JWT, refresh tokens
│   ├── user/                  # Entités et services utilisateurs
│   ├── therapeute/            # Profils thérapeutes, spécialités, disponibilités
│   ├── reservation/           # Créneaux, bookings, statuts
│   ├── payment/               # Intégration paiement
│   ├── notification/          # Service email
│   └── config/                # Security config, CORS, Swagger
│
├── src/main/resources/
│   ├── application.yml
│   └── application-prod.yml
│
└── src/test/                  # Tests unitaires et d'intégration
```

---

## Lancement en local

### Prérequis

- Java 17+
- Maven 3.8+
- PostgreSQL 15+

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/wijdane-ARB/theradrive-backend.git
cd theradrive-backend

# 2. Créer la base de données
psql -U postgres -c "CREATE DATABASE theradrive;"

# 3. Configurer les variables d'environnement
cp src/main/resources/application.yml.example src/main/resources/application.yml
# → renseigner DB_URL, DB_USER, DB_PASSWORD, JWT_SECRET, MAIL_*

# 4. Lancer l'application
mvn spring-boot:run
```

L'API est disponible sur `http://localhost:8080`  
La documentation Swagger est accessible sur `http://localhost:8080/swagger-ui.html`

---

## Variables d'environnement

| Variable | Description |
|---|---|
| `DB_URL` | URL JDBC PostgreSQL |
| `DB_USER` | Utilisateur PostgreSQL |
| `DB_PASSWORD` | Mot de passe PostgreSQL |
| `JWT_SECRET` | Clé secrète pour la signature JWT |
| `JWT_EXPIRATION` | Durée de validité du token (ms) |
| `MAIL_HOST` | Serveur SMTP |
| `MAIL_PORT` | Port SMTP |
| `MAIL_USERNAME` | Adresse email expéditeur |
| `MAIL_PASSWORD` | Mot de passe SMTP |

---

## API — Principaux endpoints

### Auth
```
POST   /api/auth/register        Inscription
POST   /api/auth/login           Connexion → JWT
POST   /api/auth/refresh         Renouvellement du token
POST   /api/auth/logout          Déconnexion
```

### Réservations
```
GET    /api/slots                Créneaux disponibles (filtre : ville, date, thérapeute)
POST   /api/reservations         Créer une réservation
GET    /api/reservations/{id}    Détail d'une réservation
PATCH  /api/reservations/{id}    Modifier / annuler
GET    /api/reservations/me      Mes réservations (client)
```

### Thérapeutes
```
GET    /api/therapeutes          Liste des thérapeutes
GET    /api/therapeutes/{id}     Profil d'un thérapeute
GET    /api/therapeutes/{id}/availability   Disponibilités
```

### Paiements
```
POST   /api/payments/initiate    Initier un paiement
POST   /api/payments/callback    Webhook passerelle
GET    /api/payments/{id}        Statut d'un paiement
```

---

## Modèle de données (simplifié)

```
User ──< Reservation >── Therapeute
              │
              └── Payment
              └── Notification

Therapeute ──< Slot (créneaux disponibles)
```

---

## Roadmap

- [x] Structure du projet & configuration
- [ ] Module Auth (JWT + rôles)
- [ ] Module Thérapeutes & disponibilités
- [ ] Module Réservations
- [ ] Module Paiements
- [ ] Module Notifications (email)
- [ ] Tests unitaires & d'intégration
- [ ] Déploiement production (Railway)
- [ ] Documentation Swagger complète

---

## Auteure

**Wijdane AARROUB**  
Master SDIA — ENSET Mohammedia  
[github.com/wijdane-ARB](https://github.com/wijdane-ARB)

---

*TheraDrive · Mental Wellness · Maroc · 2025–2026*
