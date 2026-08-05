# 🎨 Portfolio – Project Showcase Platform

## 🔍 Présentation

Ce projet est un **portfolio dynamique** permettant d’héberger et afficher des projets web (HTML/CSS/JS) directement via des **iframes**.

Il dispose d’un **système d’administration sécurisé** permettant de gérer facilement les projets (ajout / suppression).

---

## ⚙️ Stack technique

- **Frontend :** React.js
- **Backend :** Node.js + Express.js
- **Base de données :** MySQL 2
- **Auth :** Session
- **Rendering projets :** iframe

---

## 🚀 Fonctionnalités

### 🏠 Page `/`

- Affiche les **3 meilleurs projets**
- Mise en avant visuelle (cards)
- Accès rapide aux projets

---

### 📁 Page `/projects`

- Liste complète de tous les projets
- Affichage sous forme de grille
- Triéé par data de création

---

### 🔎 Page `/projects/:project`

- Affichage du projet dans une **iframe**
- Informations :
  - Nom
  - Description
  - Technologies
- Bouton retour

---

### 🔐 Page `/panel`

> Accès restreint (admin uniquement)

#### ✨ Fonctionnalités :

- ➕ Ajouter un projet :
  - Nom
  - Description
  - Fichiers (.ZIP)
  - Thumbnail (optionnel)

- 🗑️ Supprimer un projet
- 📊 Voir la liste des projets existants

---

### 📚 Page `/about`

- Presentation
- Snake Git Contributions

---

### 🥚 Page `/achievements`

- Easter eggs custom

---

### 🔑 Authentification

- Système de login sécurisé
- Protection des routes admin (`/panel`)
- Gestion des sessions

---

## 🧩 Structure du projet

```
/client           → Frontend React
  /src
    /assets       → Images / Videos
    /components   → Composents reutilisables
    /pages        → Pages du site
    /utils        → Fichiers utiles
/api              → Backend Express
/middleware       → Auth
/projects         → Fichiers des projets
/utils            → Fichiers utiles
```

Voir [TREE.md](./TREE.md)

---

## 📦 Installation

```bash
git clone https://github.com/FireDroX/dynamic-portfolio.git
cd dynamic-portfolio
```

### Docker

```bash
./build.sh
# Ce fichier est fait pour MON utilisation (a modifier)
```

### Backend

```bash
npm install
npm run start
```

### Frontend

```bash
cd client
npm install
npm run start
```

---

## ⚙️ Configuration

Copier le fichier `.env.example` vers `.env`, puis remplacer les valeurs
d'exemple :

```env
NODE_ENV=development
PORT=3000
SITE_URL=http://localhost:3000
SITE_HOSTNAMES=localhost,127.0.0.1

PANEL_PASSWORD=change_me
SESSION_SECRET=change_me_with_a_long_random_value

SQL_SERVER=localhost
SQL_PORT=3306
SQL_USER=user
SQL_PASSWORD=password
SQL_DBNAME=portfolio
```

`SITE_URL` sert de repli pour les requêtes dont le domaine n’est pas reconnu.
Pour les domaines listés dans `SITE_HOSTNAMES`, les canonicales, images Open
Graph, fichiers `robots.txt` et sitemaps utilisent automatiquement le domaine
depuis lequel le site est consulté.

---

## 📊 Base de données (MySQL 2)

### Table `projects`

| Champ       | Type    | Description   |
| ----------- | ------- | ------------- |
| id          | INTEGER | ID unique     |
| name        | TEXT    | Nom du projet |
| description | TEXT    | Description   |
| fileName    | TEXT    | Nom du ZIP    |
| image       | TEXT    | Image Base64  |
| createdAt   | DATE    | Date          |

---

## 🔌 API (Express)

### 📁 Projects

- `GET /api/projects`
- `GET /api/projects/:project`
- `POST /api/panel/add` (auth)
- `POST /api/panel/modify` (auth)
- `DELETE /api/panel/delete` (auth)

---

### 🔐 Auth

- `POST /api/panel/login`
- `POST /api/panel/login/logout`
- `POST /api/panel/login/me`

---

## 🎯 Objectif

Créer une plateforme simple pour :

- exposer ses projets
- tester des interfaces directement
- gérer facilement un portfolio évolutif

---

## 🤝 Contribuer

- Fork
- Feature branch
- Pull request

---

## 👑 Auteur

Projet développé par [FireDroX](https://github.com/FireDroX).

---

## 📄 Licence

Ce projet est distribué sous licence MIT. Voir le fichier
[LICENSE](./LICENSE) pour les conditions complètes et la mention de copyright.
