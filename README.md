# BNV — Mockup Ordering Dashboard

A full-stack MERN application where **Designers** upload product mockups and **Clients** browse and place orders.

## Tech Stack

| Layer    | Tech                                                                                       |
| -------- | ------------------------------------------------------------------------------------------ |
| Frontend | React 18, Vite, Tailwind CSS, React Router v6, Axios, Zod, React Hook Form, react-dropzone |
| Backend  | Node.js, Express, MongoDB (Mongoose), JWT, Multer, Cloudinary, express-validator           |
| Storage  | Cloudinary (images), MongoDB Atlas (data)                                                  |
| Deploy   | Vercel (frontend) + Render (backend)                                                       |

---

## Project Structure

```
BNV/
├── postman/
│   └── BNV_API.postman_collection.json   # Import into Postman (v2.1)
├── backend/
│   ├── src/
│   │   ├── config/        # db.js, cloudinary.js
│   │   ├── controllers/   # authController, mockupController, orderController
│   │   ├── middleware/    # auth.js, roleCheck.js, upload.js
│   │   ├── models/        # User, Mockup, Order
│   │   ├── routes/        # authRoutes, mockupRoutes, orderRoutes, dashboardRoutes
│   │   ├── services/      # authService, mockupService, orderService
│   │   └── validators/    # express-validator schemas
│   ├── server.js
│   └── .env
└── frontend/
    ├── src/
    │   ├── api/           # axiosInstance, authApi, mockupApi, orderApi
    │   ├── components/    # Sidebar, Navbar, DashboardLayout, StatCard, MockupCard, OrderModal…
    │   ├── context/       # AuthContext
    │   ├── hooks/         # usePolling
    │   ├── pages/         # Login, Register, Dashboard, Mockups, Upload, Orders, Profile
    │   └── schemas/       # Zod validation schemas
    └── .env
```

---

## Local Setup

### Prerequisites

- Node.js >= 18
- npm >= 9

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Variables

**`backend/.env`**

```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/bnv_mockups
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**`frontend/.env`**

```
VITE_API_URL=http://localhost:5000/api
```

### 3. Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

App runs at: http://localhost:5173

---

## Navigation

| Route             | Access        | Description                             |
| ----------------- | ------------- | --------------------------------------- |
| `/login`          | Public        | Login with role tab (Designer / Client) |
| `/register`       | Public        | Register with role selection            |
| `/dashboard`      | All users     | Stats overview + recent mockups         |
| `/mockups`        | All users     | Browse/manage mockups                   |
| `/mockups/upload` | Designer only | Upload new mockup to Cloudinary         |
| `/orders`         | All users     | View / manage orders with status        |
| `/profile`        | All users     | User profile info                       |

---

## API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require: `Authorization: Bearer <token>`

### Auth

#### POST `/auth/register`

Create a new account.

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "designer"
}
```

**Response:** `201` `{ success, token, user }`

---

#### POST `/auth/login`

Login and receive JWT.

**Body:**

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response:** `200` `{ success, token, user }`

---

#### GET `/auth/me` 🔒

Get current user profile.

**Response:** `200` `{ success, user }`

---

### Mockups

#### GET `/mockups` 🔒

List all mockups.

**Query params:** `category`, `sort`, `search`, `page`, `limit`

**Response:** `200` `{ success, mockups, total, page, totalPages }`

---

#### GET `/mockups/my` 🔒 (Designer)

List authenticated designer's mockups.

**Query params:** `category`, `sort`

---

#### GET `/mockups/:id` 🔒

Get single mockup by ID.

---

#### POST `/mockups` 🔒 (Designer only)

Upload a new mockup.

**Content-Type:** `multipart/form-data`

**Fields:** `image` (file), `name`, `description`, `price`, `category`, `badge?`, `tags?`

**Response:** `201` `{ success, mockup }`

---

#### PUT `/mockups/:id` 🔒 (Designer, owner only)

Update mockup. Optionally replace image with `image` field.

**Content-Type:** `multipart/form-data`

---

#### DELETE `/mockups/:id` 🔒 (Designer, owner only)

Delete mockup and remove from Cloudinary.

**Response:** `200` `{ success, message }`

---

### Orders

#### GET `/orders` 🔒

List orders. Clients see own orders; Designers see orders for their mockups.

**Query params:** `status`, `page`, `limit`

---

#### POST `/orders` 🔒 (Client only)

Place a new order.

**Body:**

```json
{
  "mockupId": "64abc...",
  "quantity": 5,
  "notes": "Optional instructions"
}
```

**Response:** `201` `{ success, order }`

---

#### PATCH `/orders/:id/status` 🔒 (Designer only)

Update order status.

**Body:**

```json
{ "status": "active" }
```

Status flow: `pending → active → completed`

---

### Dashboard

#### GET `/dashboard/stats` 🔒

Returns aggregated stats for the current user (role-dependent).

**Designer response:**

```json
{
  "stats": {
    "totalMockups": 10,
    "ordersReceived": 45,
    "pendingOrders": 3,
    "completedOrders": 40,
    "successRate": 88
  }
}
```

**Client response:**

```json
{
  "stats": {
    "totalOrders": 12,
    "pendingOrders": 2,
    "completedOrders": 8
  }
}
```

---

## Postman collection (API testing for reviewers)

A ready-to-import **Collection v2.1** file lives in the repo. Reviewers can also open the **same collection in Postman on the web** (sign in to Postman may be required):

| Item | Detail |
| --- | --- |
| **View in Postman (web)** | [Open shared BNV collection](https://solar-crescent-447362.postman.co/workspace/My-Workspace~b1658449-7dff-40e2-89ca-e8b1da47cad2/collection/24720323-5b118bb3-5445-4578-b12a-0fc1a213f1b9?action=share&source=copy-link&creator=24720323) |
| **File in repo** | [`postman/BNV_API.postman_collection.json`](postman/BNV_API.postman_collection.json) |
| **Schema** | [Postman Collection v2.1](https://schema.getpostman.com/json/collection/v2.1.0/collection.json) |

Use the link to browse requests and documentation in the browser; use the JSON file to **Import** into your own Postman app if you prefer a local copy.

### How to import (Postman)

1. Start the backend (`cd backend` → `npm run dev`, default `http://localhost:5000`).
2. In Postman: **Import** → **Upload Files** and select `postman/BNV_API.postman_collection.json`, **or** drag the file onto the Import window.
3. Open the collection **BNV — Mockup Ordering API**.
4. Optional: select the collection → **Variables** tab — set `host_url` / `base_url` if your API runs elsewhere (e.g. production).
5. Run **Auth → POST Login** (or **POST Register**). A **Test** script saves the JWT into the collection variable `token` automatically.
6. Call protected routes; for **GET Mockup by ID**, **PUT/DELETE Mockup**, set `mockup_id`. For **PATCH Order status**, set `order_id`.

### Collection variables (best practice)

| Variable | Default | Purpose |
| --- | --- | --- |
| `host_url` | `http://localhost:5000` | Health check (`GET /health` — not under `/api`) |
| `base_url` | `http://localhost:5000/api` | All API routes |
| `token` | *(empty)* | Filled after Login/Register |
| `mockup_id` | *(empty)* | MongoDB `_id` for mockup routes |
| `order_id` | *(empty)* | MongoDB `_id` for order status |

### Folders in the collection

- **Health** — `GET /health` (no auth)
- **Auth** — Register, Login (auto-save token), Me
- **Mockups** — list, my list, by id, create (multipart), update, delete
- **Orders** — list, place order (client), patch status (designer)
- **Dashboard** — stats

You can also copy the entire contents of `postman/BNV_API.postman_collection.json` and use **Import → Raw text** → paste → **Import** (same result as uploading the file).

---

## Deployment

### Backend → Render

1. Connect the **BNV** GitHub repo (monorepo with `backend/` and `frontend/`).
2. Create a **Web Service** on [render.com](https://render.com).
3. **Root Directory:** `backend` (so `npm install` and `node server.js` run from the folder that contains `package.json` and `server.js`).
4. **Build command:** `npm install`
5. **Start command:** `node server.js`
6. **Environment:** Render does **not** ship your local `.env`; copy every variable from `backend/.env` into **Environment** on the service. Required at minimum:

   | Variable | Notes |
   | --- | --- |
   | `MONGO_URI` | Atlas connection string (must allow network access — see below) |
   | `JWT_SECRET` | Any long random string |
   | `JWT_EXPIRES_IN` | e.g. `7d` |
   | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | For image uploads |
   | `NODE_ENV` | `production` |
   | `CLIENT_URL` | Your deployed frontend origin, e.g. `https://your-app.vercel.app` |
   | `PORT` | Usually **omit** — Render sets `PORT` automatically |

7. **MongoDB Atlas → Network Access:** allow **`0.0.0.0/0`** (all IPs) or Render’s IPs so the cloud DB accepts connections from Render’s servers.

**Deploy exits with status 1 (crash on startup):** Almost always **missing `MONGO_URI` / `JWT_SECRET` on Render**, or **Atlas blocking the connection**. Check the Render **Logs** tab for `[ENV] Missing required variable(s)` or `MongoDB connection error`. The app logs a clear message if required env vars are absent.

### Frontend → Vercel

1. Connect the same **BNV** GitHub repo.
2. **Root Directory:** `frontend` (the folder that contains `package.json` and `vite.config.js`).
3. **Environment variable:** `VITE_API_URL` = your Render API origin **with or without** `/api` (the app appends `/api` if missing). Examples:
   - `https://bnv-tfdx.onrender.com`  
   - `https://bnv-tfdx.onrender.com/api`  
   Both resolve to `https://<host>/api/...` for Axios.
4. **SPA routing:** The repo includes [`frontend/vercel.json`](frontend/vercel.json) so refreshing on routes like `/login` or `/dashboard` serves `index.html` instead of `404 NOT_FOUND`.
5. **Build:** Install `npm install`, build `npm run build`, output `dist` (defaults work if Root Directory is `frontend`).
6. After deploy, set **`CLIENT_URL`** on Render to your Vercel URL (e.g. `https://your-app.vercel.app`) so CORS allows the browser to call the API.

**404 on `/auth/login` when calling Render:** The backend only exposes routes under **`/api`** (e.g. `POST /api/auth/login`). If the browser requests `https://<render-host>/auth/login`, that URL does not exist — use `VITE_API_URL` pointing at the Render host (see step 3). The frontend code normalizes the base URL to always use `/api`.

---

## Features

- JWT authentication with role-based access (Designer / Client)
- Cloudinary image upload with drag-and-drop preview
- Designer: upload, edit, delete mockups; view/update incoming orders
- Client: browse mockups, place orders with quantity/pricing, track status
- Real-time order status polling every 10 seconds
- Responsive dashboard matching provided UI designs
- Express-validator on all mutation endpoints
- Zod validation on all frontend forms
