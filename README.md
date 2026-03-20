# 🖼️ Meme Museum (2024-2025)

Benvenuto al **Meme Museum**! Un'applicazione web full-stack sviluppata per visualizzare, caricare, votare e commentare i tuoi meme preferiti. Nata come progetto didattico/professionale, la piattaforma replica un social feed dinamico in cui l'utente può interagire con i contenuti o esplorare il "Meme of the Day".

---

## 🛠️ Stack Tecnologico

Il progetto è suddiviso in due ecosistemi principali, connessi tramite API RESTful.

**Backend:**
- **Node.js & Express.js** - Server e routing API.
- **Sequelize (ORM)** - Mappatura modelli e query di database.
- **PostgreSQL** - Database relazionale.
- **Multer** - Gestione upload delle immagini (Meme/Profile pictures).
- **JSON Web Tokens (JWT)** - Autenticazione utente e permessi.

**Frontend:**
- **Angular 17+** - Framework Single Page Application (SPA).
- **RxJS** - Gestione flussi asincroni e chiamate HTTP Reattive.
- **SCSS** - Styling avanzato con fogli di stile annidati.
- **TypeScript** - Tipizzazione rigorosa e sicura.

---

## ✨ Funzionalità (Features)

- 🔐 **Autenticazione**: Login e Registrazione con JWT, protezione Rotte Angular tramite state guard.
- 🖼️ **Timeline & Paginazione**: Scorrimento infinito o a pagine per sfogliare i Meme.
- 🏷️ **Tag e Ricerca**: Associazione multi-tag, filtri di ricerca globale per titolo, descrizioni e categorie.
- 👍 **Sistema di Voto**: Upvote/Downvote dei post unici per utente.
- 💬 **Sezione Commenti**: Supporto per scrivere e legare commenti ai Meme.
- 👤 **Profilo Utente**: Personalizzazione avatar utente e storico/gestione dei propri Meme (Cancellazione, Modifica).

---

## 🚀 Come avviare il Progetto (Getting Started)

L'applicazione supporta un avvio ultra-rapido e automatizzato grazie a **Docker**, ma può essere avviata anche in modalità _Standalone_ (manuale).

### Opzione 1: Docker Compose (Consigliata)
Non ti serve installare database o pacchetti locali. 
1. Assicurati di avere [Docker Desktop](https://www.docker.com/products/docker-desktop/) in esecuzione.
2. Apri il terminale nella root del progetto (dove giace il file `docker-compose.yml`)
3. Esegui il comando di Build & Run:
   ```bash
   docker compose up --build
   ```
   > Il compose accenderà in ordine: il DB Postgres ufficiale, il Backend Node.js (sulla porta `3000`) e il server Frontend Angular (sulla porta `4200`). Al termine potrai aprire il browser a `http://localhost:4200` godendo contemporaneamente da IDE dell'Hot-Reloading!

### Opzione 2: Avvio Manuale (Standalone)
Se preferisci gestire Node e il Server SQL manualmente (utile per debugging atomico).

#### 1. Database
- Installa [PostgreSQL](https://www.postgresql.org/).
- Crea un DB chiamato `MemeMuseum` usando l'utente e password definiti nei tuoi env (di default `postgres / caruso`).

#### 2. Backend
- Rinomina il file `Backend/.env.dummy` in `.env` (o crea un `.env` locale) accertandoti che l'URI sia corretto:
  `DB_CONNECTION_URI="postgres://postgres:caruso@localhost:5432/MemeMuseum"`
- Esegui i seguenti comandi:
  ```bash
  cd Backend
  npm install
  npm start
  ```

#### 3. Frontend
- Apri un secondo terminale:
  ```bash
  cd Frontend/MemeMuseum-Frontend
  npm install
  npm start
  ```
- Vai sul browser: `http://localhost:4200`

---

## 📂 Struttura Cartelle Rapida

```text
MemeMuseum24-25/
├── Backend/                 # Logica Server Node.js
│   ├── controllers/         # Logica core (REST handler e Db sync)
│   ├── middleware/          # Guardie (JWT auth, Photo Upload)
│   ├── models/              # Modelli Sequelize (User, Meme, Tag, Vote...)
│   ├── routes/              # Mappature URL HTTP
│   └── images/              # Media statici salvati su volume
│
├── Frontend/                # Logica Client Angular
│   └── MemeMuseum-Frontend/
│       ├── src/app/
│       │   ├── _services/   # File intermediari di comunicazione HTTP
│       │   ├── _guards/     # Route Resolver RxJS basati su AuthService
│       │   ├── pages/       # Pagine SPA centrali (Homepage, Login, etc.)
│       │   └── shared/      # Componenti riutilizzabili (Es: MemeCard, Loader)
│       └── ...
│
└── docker-compose.yml       # Orchestratore del workflow Docker
```

---

*Progetto sviluppato da Francesco Simone.*