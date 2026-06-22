# Guide Docker - Projet de base NestJS + Vue.js

Ce document explique comment lancer et utiliser l'environnement Docker du projet.

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) installé sur ta machine
- [Docker Compose](https://docs.docker.com/compose/install/) (inclus avec Docker Desktop)

## Architecture

Le projet utilise 5 conteneurs Docker :

| Service | Description | Port |
|---------|-------------|------|
| **postgres** | Base de données PostgreSQL 16 | 5432 |
| **redis** | Cache et système de queues | 6379 |
| **mailpit** | Serveur mail local (capture les emails) | 8025 (web), 1025 (SMTP) |
| **backend** | API NestJS | 3000 |
| **frontend** | Application Vue.js | 5173 |

## Démarrage rapide

### 1. Copier le fichier d'environnement

```bash
cp .env.example .env
```

### 2. Lancer tous les services

```bash
docker compose up
```

C'est tout ! Attends que tous les services soient démarrés (ça peut prendre 1-2 minutes la première fois).

### 3. Accéder aux services

- **Frontend Vue.js** : http://localhost:5173
- **Backend NestJS** : http://localhost:3000
- **Mailpit (emails)** : http://localhost:8025

## Commandes utiles

### Démarrer en arrière-plan

```bash
docker compose up -d
```

### Voir les logs

```bash
# Tous les services
docker compose logs -f

# Un service spécifique
docker compose logs -f backend
docker compose logs -f frontend
```

### Arrêter les services

```bash
docker compose down
```

### Reconstruire les images (après modification des Dockerfile)

```bash
docker compose up --build
```

### Supprimer tout (y compris les volumes de données)

```bash
docker compose down -v
```

## Travailler avec la base de données

### Accéder à PostgreSQL

```bash
docker compose exec postgres psql -U postgres -d app_db
```

### Exécuter les migrations Prisma

```bash
docker compose exec backend npx prisma migrate dev
```

### Ouvrir Prisma Studio (interface graphique)

```bash
docker compose exec backend npx prisma studio
```
Note : Prisma Studio sera accessible sur http://localhost:5555

## Tester les services

Une fois Docker lancé, tu peux tester les services depuis le frontend (http://localhost:5173/demo) ou avec curl :

### Test du mail

```bash
curl -X POST http://localhost:3000/demo/mail/send \
  -H "Content-Type: application/json" \
  -d '{"to": "test@example.com", "subject": "Test", "body": "Hello!"}'
```
Puis vérifie l'email sur http://localhost:8025

### Test du cache Redis

```bash
# Stocker une valeur
curl -X POST http://localhost:3000/demo/cache/set \
  -H "Content-Type: application/json" \
  -d '{"key": "ma-cle", "value": "ma-valeur"}'

# Récupérer la valeur
curl http://localhost:3000/demo/cache/get/ma-cle
```

### Test de la queue

```bash
curl -X POST http://localhost:3000/demo/queue/add \
  -H "Content-Type: application/json" \
  -d '{"jobName": "mon-job", "data": {"message": "Hello!"}}'
```
Le résultat du job s'affiche dans les logs du backend.

### Vérifier l'état de tous les services

```bash
curl http://localhost:3000/demo/health
```

## Structure des fichiers Docker

```
.
├── docker-compose.yml    # Configuration de tous les services
├── Dockerfile            # Image du backend NestJS
├── .dockerignore         # Fichiers exclus du build
├── .env.example          # Variables d'environnement (à copier en .env)
└── frontend/
    └── Dockerfile        # Image du frontend Vue.js
```

## Dépannage

### "Port already in use"

Un autre service utilise déjà le port. Solutions :
1. Arrête le service qui utilise le port
2. Ou modifie le port dans `.env` (ex: `BACKEND_PORT=3001`)

### "Cannot connect to database"

Attends que PostgreSQL soit prêt (healthcheck). Tu peux vérifier avec :
```bash
docker compose ps
```
Le service `postgres` doit être "healthy".

### Les modifications ne sont pas prises en compte

Les volumes sont montés pour le hot-reload, mais si ça ne fonctionne pas :
```bash
docker compose restart backend
# ou
docker compose restart frontend
```

### Réinitialiser complètement

```bash
docker compose down -v
docker compose up --build
```

## Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `DB_USER` | Utilisateur PostgreSQL | postgres |
| `DB_PASSWORD` | Mot de passe PostgreSQL | postgres |
| `DB_NAME` | Nom de la base | app_db |
| `DB_PORT` | Port PostgreSQL | 5432 |
| `REDIS_PORT` | Port Redis | 6379 |
| `BACKEND_PORT` | Port du backend | 3000 |
| `FRONTEND_PORT` | Port du frontend | 5173 |
| `MAIL_WEB_PORT` | Port interface Mailpit | 8025 |
| `MAIL_SMTP_PORT` | Port SMTP Mailpit | 1025 |
