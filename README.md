# 🎨 Portfolio – Project Showcase Platform

## 🔍 Présentation

Ce projet est un **portfolio dynamique** permettant d’héberger et afficher des projets web (HTML/CSS/JS) directement via des **iframes**.

Il dispose d’un **système d’administration sécurisé** permettant de gérer facilement les projets (ajout / suppression).

---

## ⚙️ Stack technique

- **Frontend :** React.js
- **Backend :** Node.js + Express.js
- **Base de données :** SQLite
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

### 🔑 Authentification

- Système de login sécurisé
- Protection des routes admin (`/panel`)
- Gestion des sessions

---

## 🧩 Structure du projet

```

/client        → Frontend React
/api           → Backend Express
/db.sqlite     → SQLite
/projects      → Fichiers des projets

```

---

## 📦 Installation

```bash
git clone https://github.com/FireDroX/dynamic-portfolio.git
cd portfolio
```

### Docker
```bash
docker build -t portfolio-image .

docker run -d \
  -p 3000:3000 \
  --name portfolio \
  -v portfolio_projects:/app/projects \
  portfolio-image
```

### Backend

```bash
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm start
```

---

## ⚙️ Configuration

Créer un fichier `.env` côté backend :

```env
PORT=3000

PANEL_PASSWORD=password
SESSION_SECRET=secret

SQL_USER=user
SQL_PASSWORD=password
SQL_SERVER=url
```

---

## 📊 Base de données (SQLite)

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

Projet développé avec ❤️
