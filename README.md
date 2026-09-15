# The Blush Makeover — Mini Full-Stack Project

A simple full-stack project for a fresher portfolio:
- **Frontend:** plain HTML, CSS, JavaScript
- **Backend:** Node.js + Express, with a JSON file as the "database"

## Features
- Create account (signup) and delete account
- Password must be 8–16 characters (checked on both frontend and backend)
- Show/hide password toggle (eye button) on signup and login
- Wrong password on login → error shown on the page AND logged on the backend
- Package selection + order placement
- Returning customers automatically get **5% off** from their 2nd order onwards
- Admin page that displays everything happening on the backend (like a mini backend dashboard)

---

## 1. Project structure

```
bridal-salon/
├── backend/
│   ├── server.js       ← the Express API
│   ├── package.json
│   ├── db.json         ← stores user accounts
│   └── logs.json        ← stores every backend event
└── frontend/
    ├── index.html, signup.html, login.html, dashboard.html, packages.html, admin.html
    ├── css/style.css
    └── js/ (api.js, signup.js, login.js, dashboard.js, packages.js, admin.js)
```

## 2. Run it on your computer first

You need [Node.js](https://nodejs.org) installed.

```bash
cd bridal-salon/backend
npm install
npm start
```

You should see: `Bridal Salon backend running on port 5000`
Keep this terminal open — **this terminal is your "backend view."** Every signup,
login attempt, deleted account, and order will print here in real time.

Now open `frontend/index.html` directly in your browser (double-click it, or
use the VS Code "Live Server" extension). Try signing up, logging in with a
wrong password on purpose, and placing an order — then watch the terminal.

## 3. How frontend vs backend shows things

| Action | What the user sees (Frontend) | What the backend shows |
|---|---|---|
| Sign up | Green message "Account created successfully" | Same message printed in the server terminal + saved in `logs.json` |
| Wrong password | Red error "Incorrect password" on the login page | `[LOGIN FAILED] Wrong password for ...` printed in the terminal |
| Password too short/long | Red error before it even reaches the backend | If somehow bypassed, backend double-checks and rejects it too |
| Delete account | Green "Account deleted successfully" message | Logged and removed from `db.json` |
| Select a package / place order | Confirmation with final price (discount applied) | Two log lines: "Package selected" and "Order placed" |
| Admin page (`admin.html`) | Live table of all registered users + a live activity log | Pulls straight from `/api/users` and `/api/logs` — this page is basically a window into the backend |

The **Admin page is the key piece** for your "must show in backend too"
requirement — it polls the backend every 5 seconds and displays every event
the server has logged, so you can demo it live without opening a terminal.

## 4. The 5% old-customer discount, explained

- Every user has an `orderCount` field, starting at 0.
- First order → full price, `orderCount` becomes 1.
- Any order after that → the backend sees `orderCount > 0`, applies 5% off,
  and tells the frontend `isOldCustomer: true` so it can show the discount.

## 5. Deploying it (Netlify only hosts the frontend!)



### Step A — Deploy the backend first (Render, free)
1. Create a GitHub repo (e.g. `blush-makeover`) and push the **whole project**
   to it (both `backend/` and `frontend/`).
2. Go to [render.com](https://render.com) → sign in with GitHub → **New → Web Service**
   → pick your repo.
3. Set **Root Directory** to `backend`.
4. Build command: `npm install` — Start command: `npm start`
5. Deploy. Render gives you a URL like `https://blush-makeover-backend.onrender.com`
   — wait until the log shows `The Blush Makeover backend running on port ...`

### Step B — Point the frontend at that backend
Open `frontend/js/api.js` and change:
```js
const API_BASE_URL = "http://localhost:5000";
```
to your real Render URL, e.g.:
```js
const API_BASE_URL = "https://blush-makeover-backend.onrender.com";
```
Commit and push this change.

### Step C — Get your public link (pick ONE)

**Option 1 — Netlify (fastest, no GitHub needed for this part)**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag your local `frontend` folder straight onto the page.
3. Netlify instantly gives you a live link like `https://blush-makeover.netlify.app`
   — this is what you submit/share.
   *(For auto-redeploys on every git push instead, use Netlify → Add new site →
   Import from GitHub → set **Base directory** to `frontend` instead.)*

**Option 2 — GitHub Pages**
1. In your GitHub repo → Settings → Pages.
2. Source: Deploy from a branch → Branch: `main` → Folder: `/frontend`
   *(if GitHub Pages won't let you pick a subfolder, move everything inside
   `frontend/` into the repo root, or use a separate repo just for the frontend).*
3. Save — GitHub gives you a link like `https://yourusername.github.io/blush-makeover`

Either way, the site will only fully work (signup/login/orders/admin log)
once Step A + B are done, since those calls go to your live Render backend.

*(Free Render services "sleep" after inactivity — the first request after a
while can take 20–30 seconds to wake up. That's normal, mention it in your demo.)*

## 6. Explaining it in an interview (short version)

- "It's a two-tier app: a static frontend calling a REST API backend."
- "Passwords are hashed with bcrypt before being stored — never saved in plain text."
- "The backend validates everything again even though the frontend already
  checks it, because you should never trust the client."
- "The Admin page shows I understand that 'backend' data (logs, user records)
  needs its own view — it's not just console.log, it's an actual API endpoint."
