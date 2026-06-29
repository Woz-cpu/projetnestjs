# Guide Docker — Projet NestJS + Vue.js

Ce document explique comment lancer, utiliser et dépanner l'environnement Docker du projet. Tout le projet (base de données, cache, mail, API et frontend) tourne dans des conteneurs : pas besoin d'installer PostgreSQL, Redis ou Node sur ta machine.

---

## Sommaire

- [Prérequis](#prérequis)
- [Architecture](#architecture)
- [Démarrage rapide](#démarrage-rapide)
- [Commandes utiles](#commandes-utiles)
- [Travailler avec la base de données](#travailler-avec-la-base-de-données)
- [Tester les services](#tester-les-services)
- [Structure des fichiers Docker](#structure-des-fichiers-docker)
- [Dépannage](#dépannage)
- [Variables d'environnement](#variables-denvironnement)
- [Référence des routes de l'API](#référence-des-routes-de-lapi)

---

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) installé sur ta machine
- [Docker Compose](https://docs.docker.com/compose/install/) (inclus avec Docker Desktop)

Pour vérifier que tout est en place :

```bash
docker --version
docker compose version
```

---

## Architecture

Le projet est composé de **5 conteneurs** orchestrés par Docker Compose :

| Service      | Rôle                                              | Port(s) exposés                    |
|--------------|---------------------------------------------------|------------------------------------|
| **postgres** | Base de données PostgreSQL 16                      | `5433`                             |
| **redis**    | Cache et système de queues (jobs asynchrones)     | `6380`                             |
| **mailpit**  | Serveur mail local qui capture les emails envoyés | `8026` (web) · `1026` (SMTP)       |
| **backend**  | API NestJS                                        | `3001`                             |
| **frontend** | Application Vue.js                                 | `5174`                             |

> **Pourquoi ces ports décalés ?**
> Les ports exposés (5433, 6380, 8026…) sont volontairement différents des ports par défaut (5432, 6379, 8025…) pour éviter les conflits si tu as déjà PostgreSQL, Redis, etc. installés localement. **À l'intérieur** du réseau Docker, les services communiquent entre eux par leur nom (`postgres`, `redis`, `mailpit`) sur leurs ports standards.

---

## Démarrage rapide

### 1. Créer le fichier d'environnement

Copie le modèle fourni. Le `.env` contient les identifiants et les ports utilisés par Docker Compose.

```bash
cp .env.example .env
```

### 2. Lancer tous les services

```bash
docker compose up
```

Attends que tous les services soient démarrés (le premier lancement peut prendre **1 à 2 minutes**, le temps de télécharger les images et de construire le backend/frontend).

### 3. Accéder aux services

Une fois tout démarré, ouvre dans ton navigateur :

| Service              | URL                       |
|----------------------|---------------------------|
| Frontend Vue.js      | http://localhost:5174     |
| Backend NestJS (API) | http://localhost:3001     |
| Mailpit (emails)     | http://localhost:8026     |

---

## Commandes utiles

### Démarrer en arrière-plan

Libère le terminal une fois les conteneurs lancés :

```bash
docker compose up -d
```

### Voir les logs

```bash
# Tous les services en continu
docker compose logs -f

# Un service spécifique
docker compose logs -f backend
docker compose logs -f frontend
```

### Vérifier l'état des conteneurs

```bash
docker compose ps
```

### Arrêter les services

```bash
docker compose down
```

### Reconstruire les images

À faire après avoir modifié un `Dockerfile` ou les dépendances (`package.json`) :

```bash
docker compose up --build
```

### Tout supprimer, y compris les données

⚠️ **Attention** : l'option `-v` supprime aussi les volumes, donc **les données de la base PostgreSQL sont perdues**.

```bash
docker compose down -v
```

---

## Travailler avec la base de données

### Accéder à PostgreSQL (psql)

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

> Prisma Studio est ensuite accessible sur http://localhost:5555

---

## Tester les services

Une fois Docker lancé, tu peux tester les services via la page de démo du frontend (http://localhost:5174/demo) ou directement avec `curl`.

### Envoi d'un mail

```bash
curl -X POST http://localhost:3001/demo/mail/send \
  -H "Content-Type: application/json" \
  -d '{"to": "test@example.com", "subject": "Test", "body": "Hello!"}'
```

➡️ Vérifie ensuite que l'email a bien été capturé sur http://localhost:8026

### Cache Redis

```bash
# Stocker une valeur
curl -X POST http://localhost:3001/demo/cache/set \
  -H "Content-Type: application/json" \
  -d '{"key": "ma-cle", "value": "ma-valeur"}'

# Récupérer la valeur
curl http://localhost:3001/demo/cache/get/ma-cle
```

### Queue (job asynchrone)

```bash
curl -X POST http://localhost:3001/demo/queue/add \
  -H "Content-Type: application/json" \
  -d '{"jobName": "mon-job", "data": {"message": "Hello!"}}'
```

➡️ Le résultat du job s'affiche dans les logs du backend (`docker compose logs -f backend`).

### Vérifier la santé de tous les services

```bash
curl http://localhost:3001/demo/health
```

---

## Structure des fichiers Docker

```
.
├── docker-compose.yml    # Orchestration de tous les services
├── Dockerfile            # Image du backend NestJS
├── .dockerignore         # Fichiers exclus du build
├── .env.example          # Modèle de variables d'environnement (à copier en .env)
└── frontend/
    └── Dockerfile        # Image du frontend Vue.js
```

---

## Dépannage

### « Port already in use »

Un autre programme occupe déjà l'un des ports. Deux solutions :

1. Arrête le service qui utilise le port concerné, **ou**
2. Modifie le port dans `.env` (ex. `BACKEND_PORT=3002`), puis relance `docker compose up`.

### « Cannot connect to database »

PostgreSQL n'est probablement pas encore prêt (le backend démarre avant la fin du healthcheck). Vérifie son état :

```bash
docker compose ps
```

Le service `postgres` doit apparaître comme **healthy**. Attends quelques secondes puis réessaie.

### Les modifications de code ne sont pas prises en compte

Les volumes sont montés pour permettre le hot-reload. Si ça ne suit pas, redémarre le service concerné :

```bash
docker compose restart backend
# ou
docker compose restart frontend
```

### Tout réinitialiser de zéro

⚠️ Supprime aussi les données de la base :

```bash
docker compose down -v
docker compose up --build
```

---

## Variables d'environnement

Définies dans le fichier `.env` (copié depuis `.env.example`) :

| Variable         | Description                  | Valeur par défaut |
|------------------|------------------------------|-------------------|
| `DB_USER`        | Utilisateur PostgreSQL       | `postgres`        |
| `DB_PASSWORD`    | Mot de passe PostgreSQL      | `postgres`        |
| `DB_NAME`        | Nom de la base               | `app_db`          |
| `DB_PORT`        | Port PostgreSQL              | `5433`            |
| `REDIS_PORT`     | Port Redis                   | `6380`            |
| `BACKEND_PORT`   | Port du backend              | `3001`            |
| `FRONTEND_PORT`  | Port du frontend             | `5174`            |
| `MAIL_WEB_PORT`  | Port de l'interface Mailpit  | `8026`            |
| `MAIL_SMTP_PORT` | Port SMTP de Mailpit         | `1026`            |

---

## Référence des routes de l'API

Toutes les routes sont préfixées par l'URL du backend : `http://localhost:3001`.

### Racine

| Méthode | Path |
|---------|------|
| GET     | `/`  |

### Users — `/users`

| Méthode | Path          |
|---------|---------------|
| GET     | `/users`      |
| GET     | `/users/:id`  |
| POST    | `/users`      |
| PUT     | `/users/:id`  |

### Roles — `/roles`

| Méthode | Path     |
|---------|----------|
| POST    | `/roles` |
| GET     | `/roles` |

### Games — `/games`

| Méthode | Path          |
|---------|---------------|
| GET     | `/games`      |
| GET     | `/games/:id`  |
| POST    | `/games`      |
| PUT     | `/games/:id`  |

### Platforms — `/platforms`

| Méthode | Path              |
|---------|-------------------|
| GET     | `/platforms`      |
| GET     | `/platforms/:id`  |
| POST    | `/platforms`      |
| PUT     | `/platforms/:id`  |

### Publishers — `/publishers`

| Méthode | Path               |
|---------|--------------------|
| GET     | `/publishers`      |
| GET     | `/publishers/:id`  |
| POST    | `/publishers`      |
| PUT     | `/publishers/:id`  |

### Game-Platforms — `/game-platforms`

| Méthode | Path                                      |
|---------|-------------------------------------------|
| GET     | `/game-platforms`                         |
| GET     | `/game-platforms/:gameId/:platformId`     |
| POST    | `/game-platforms`                         |
| DELETE  | `/game-platforms/:gameId/:platformId`     |

### User-Library — `/user-library`

| Méthode | Path                              |
|---------|-----------------------------------|
| GET     | `/user-library`                   |
| GET     | `/user-library/:userId/:gameId`   |
| POST    | `/user-library`                   |
| DELETE  | `/user-library/:userId/:gameId`   |

### Demo — `/demo`

| Méthode | Path                        |
|---------|-----------------------------|
| POST    | `/demo/mail/send`           |
| GET     | `/demo/mail/status`         |
| POST    | `/demo/cache/set`           |
| GET     | `/demo/cache/get/:key`      |
| POST    | `/demo/cache/delete/:key`   |
| POST    | `/demo/queue/add`           |
| POST    | `/demo/queue/add-delayed`   |
| GET     | `/demo/queue/stats`         |
| GET     | `/demo/health`              |
