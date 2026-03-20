
##  Come avviare il Progetto 

L'applicazione supporta un avvio rapido e sicuro grazie a **Docker**, ma può essere avviata anche in modalità _Standalone_ (manuale).

### Opzione 1: Docker Compose (Consigliata)
Non ti serve installare database o pacchetti locali. 
1. Assicurati di avere [Docker Desktop](https://www.docker.com/products/docker-desktop/) in esecuzione.
2. Apri il terminale nella root del progetto (dove giace il file `docker-compose.yml`)
3. Esegui il comando di Build & Run:
   ```bash
   docker compose up --build
   ```
   > Il compose accenderà in ordine: il DB Postgres ufficiale, il Backend Node.js (sulla porta `3000`) e il server Frontend Angular (sulla porta `4200`). Al termine potrai aprire il browser a `http://localhost:4200`

### Opzione 2: Avvio Manuale (Standalone)
Se preferisci gestire Node e il Server SQL manualmente (utile per debugging atomico).

#### 1. Database
- Installa [PostgreSQL](https://www.postgresql.org/).
- Crea un DB chiamato `MemeMuseum` usando l'utente e password definiti nei tuoi env (di default `postgres / caruso`).

#### 2. Backend
- Rinomina il file `Backend/.env.dummy` in `.env` (o crea un `.env` locale) accertandoti che l'URI sia corretto: es.
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
  ng serve
  ```
- Vai sul browser: `http://localhost:4200`

---