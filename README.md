# 🎵 BeatList API — Atelier révision Express

## Contexte

Ton collègue a commencé une API de gestion de playlists musicales.
Le projet compile... mais rien ne fonctionne vraiment.

Ton travail : **trouver et corriger tous les bugs**, puis **compléter l'API** avec les fonctionnalités manquantes.

---

## Structure du projet

```
beatlist-api/
├── src/
│   ├── config/
│   │   └── db.js              ← connexion MySQL
│   ├── controllers/
│   │   └── playlist.controller.js
│   ├── services/
│   │   └── playlist.service.js
│   ├── models/
│   │   └── playlist.model.js
│   ├── middlewares/
│   │   ├── AppError.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   └── playlist.routes.js
│   ├── validators/            ← vide pour l'instant (Phase 2)
│   └── app.js
├── server.js
├── beatlist.sql
└── package.json
```

### Rôle de chaque couche

| Couche | Responsabilité |
|---|---|
| **route** | Déclare les endpoints, branche les middlewares |
| **controller** | Reçoit la requête, appelle le service, envoie la réponse |
| **service** | Contient la logique métier, orchestre les appels au model |
| **model** | Parle à la base de données — uniquement des requêtes SQL |

> ⚠️ Un model ne contient jamais de logique métier.
> ⚠️ Un controller ne contient jamais de requête SQL.

---

## Mise en place

```bash
# 1. Importe la base de données
mysql -u root -p < beatlist.sql

# 2. Crée le fichier .env à la racine
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=beatlist
PORT=3000
JWT_SECRET=beatlist_super_secret

# 3. Installe les dépendances et démarre
npm install
npm run dev
```

---

## PHASE 1 — Débogage (1h30)

Le code contient **7 bugs**. Certains font planter le serveur au démarrage,
d'autres provoquent des erreurs silencieuses ou des réponses incorrectes.
Un bug est une **violation de l'architecture en couches** : la mauvaise logique est au mauvais endroit.

Pour chaque bug trouvé, note dans un commentaire :
- Ce qui était faux
- Pourquoi c'est un problème
- Ce que tu as corrigé

### Méthode recommandée

1. Lance le serveur et observe les erreurs dans le terminal
2. Teste chaque route avec ton client HTTP (Postman...)
3. Lis le code couche par couche, dans l'ordre du flux d'une requête :

```
routes → controller → service → model
              ↑
           app.js / config
```

### Routes à tester

| Méthode | URL | Comportement attendu |
|---|---|---|
| GET | `/api/playlists` | Liste des playlists publiques avec leur titre |
| GET | `/api/playlists/1` | Playlist n°1 avec ses tracks |
| GET | `/api/playlists/999` | `{ "error": "Playlist introuvable" }` avec status 404 |
| POST | `/api/playlists` | Création d'une playlist |
| PUT | `/api/playlists/1` | Modification |
| DELETE | `/api/playlists/1` | Suppression |

### Indices (si vraiment bloqué)

<details>
<summary>Indice — src/config/db.js</summary>
La connexion fonctionne-t-elle pour plusieurs requêtes simultanées ?
</details>

<details>
<summary>Indice — src/middlewares/errorHandler.js</summary>
Express reconnaît un middleware d'erreur à une signature bien précise. Combien de paramètres faut-il exactement ?
</details>

<details>
<summary>Indice — src/app.js</summary>
Dans quel ordre faut-il brancher les middlewares et les routes ?
</details>

<details>
<summary>Indice — src/models/playlist.model.js</summary>
Compare le nom des colonnes dans le fichier SQL avec les noms utilisés dans la requête SELECT de findAll.
</details>

<details>
<summary>Indice — src/services/playlist.service.js (bug async)</summary>
Est-ce que getAllPublic attend bien le résultat avant de le retourner ?
</details>

<details>
<summary>Indice — src/services/playlist.service.js (bug architecture)</summary>
Regarde createOne : est-ce que cette couche devrait contenir ce type de code ?
Rappelle-toi le rôle de chaque couche.
</details>

<details>
<summary>Indice — src/routes/playlist.routes.js</summary>
Toutes les fonctions utilisées dans les routes sont-elles bien importées ?
</details>

---

## PHASE 2 — Complétion (2h)

Le code est maintenant fonctionnel. À toi d'ajouter les fonctionnalités manquantes,
en respectant l'architecture en couches.

### Étape A — Validation avec express-validator

Crée `src/validators/playlist.validator.js` avec les règles suivantes pour `POST` et `PUT` :
- `title` : obligatoire, entre 2 et 150 caractères
- `description` : optionnelle, 500 caractères max
- `is_public` : booléen (optionnel)

Crée `src/middlewares/validate.js` — le middleware qui centralise la vérification des erreurs de validation.

Branche la chaîne dans les routes : `règles → validate → controller`

> 💡 Le validator ne contient que des règles. Le middleware validate ne fait que lire les erreurs.
> Le controller ne sait pas qu'il y a eu validation.

---

### Étape B — Authentification JWT

Crée `src/routes/auth.routes.js` avec :

**`POST /api/auth/register`**
- Controller → Service → Model
- Le service hash le mot de passe (bcrypt), vérifie que l'email n'existe pas déjà
- Le model insère l'utilisateur
- Retourne `{ message: "Compte créé" }`

**`POST /api/auth/login`**
- Le service vérifie l'email, compare le password (bcrypt), génère et retourne un JWT
- Le JWT contient `{ id, email, role }`

Crée `src/middlewares/authenticate.js` :
- Lit le header `Authorization: Bearer <token>`
- Vérifie le token avec `jwt.verify`
- Injecte `req.user` avec le payload
- Lance `AppError(401, "Token invalide")` si absent ou incorrect

---

### Étape C — Autorisations

Applique ces règles dans les routes :

| Route | Règle |
|---|---|
| `GET /api/playlists` | Public |
| `GET /api/playlists/:id` | Public |
| `POST /api/playlists` | Connecté uniquement |
| `PUT /api/playlists/:id` | Propriétaire ou admin |
| `DELETE /api/playlists/:id` | Propriétaire ou admin |

Crée `src/middlewares/isOwnerOrAdmin.js` :
- Appelle le service pour récupérer la playlist
- Vérifie que `req.user.id === playlist.user_id` ou `req.user.role === 'admin'`
- Sinon : `AppError(403, "Action non autorisée")`

> ⚠️ Dans le service createOne, remplace le `user_id = 1` codé en dur par `req.user.id` (passé depuis le controller)

---

### Bonus (si tu as de l'avance)

- `GET /api/playlists/:id/tracks` — liste des tracks (couche complète : route → controller → service → model)
- `POST /api/playlists/:id/tracks` — ajout d'un track (connecté + propriétaire)
- Filtre `?genre=Electronic` sur `GET /api/playlists`
- Validation du register : username min 3 chars, email valide, password min 8 chars

---
