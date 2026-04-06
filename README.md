# BNV — Mockup Ordering Dashboard

A full-stack MERN application where **Designers** upload product mockups and **Clients** browse and place orders.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6, Axios, Zod, React Hook Form, react-dropzone |
| Backend | Node.js, Express, MongoDB (Mongoose), JWT, Multer, Cloudinary, express-validator |
| Storage | Cloudinary (images), MongoDB Atlas (data) |
| Deploy | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
BNV/
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

| Route | Access | Description |
|---|---|---|
| `/login` | Public | Login with role tab (Designer / Client) |
| `/register` | Public | Register with role selection |
| `/dashboard` | All users | Stats overview + recent mockups |
| `/mockups` | All users | Browse/manage mockups |
| `/mockups/upload` | Designer only | Upload new mockup to Cloudinary |
| `/orders` | All users | View / manage orders with status |
| `/profile` | All users | User profile info |

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

## Postman Collection

Import this JSON into Postman:

```json
{
  "info": { "name": "BNV API", "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
  "variable": [
    { "key": "base_url", "value": "http://localhost:5000/api" },
    { "key": "token", "value": "" }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        { "name": "Register", "request": { "method": "POST", "url": "{{base_url}}/auth/register", "body": { "mode": "raw", "raw": "{\"name\":\"Test User\",\"email\":\"test@test.com\",\"password\":\"test123\",\"role\":\"designer\"}", "options": { "raw": { "language": "json" } } } } },
        { "name": "Login", "request": { "method": "POST", "url": "{{base_url}}/auth/login", "body": { "mode": "raw", "raw": "{\"email\":\"test@test.com\",\"password\":\"test123\"}", "options": { "raw": { "language": "json" } } } } },
        { "name": "Get Me", "request": { "method": "GET", "url": "{{base_url}}/auth/me", "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }] } }
      ]
    },
    {
      "name": "Mockups",
      "item": [
        { "name": "List All", "request": { "method": "GET", "url": "{{base_url}}/mockups", "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }] } },
        { "name": "My Mockups", "request": { "method": "GET", "url": "{{base_url}}/mockups/my", "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }] } },
        { "name": "Upload Mockup", "request": { "method": "POST", "url": "{{base_url}}/mockups", "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }], "body": { "mode": "formdata", "formdata": [{ "key": "image", "type": "file" }, { "key": "name", "value": "Test Mockup" }, { "key": "price", "value": "29.99" }, { "key": "category", "value": "Packaging" }] } } },
        { "name": "Delete Mockup", "request": { "method": "DELETE", "url": "{{base_url}}/mockups/:id", "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }] } }
      ]
    },
    {
      "name": "Orders",
      "item": [
        { "name": "List Orders", "request": { "method": "GET", "url": "{{base_url}}/orders", "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }] } },
        { "name": "Place Order", "request": { "method": "POST", "url": "{{base_url}}/orders", "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }], "body": { "mode": "raw", "raw": "{\"mockupId\":\"MOCKUP_ID\",\"quantity\":3}", "options": { "raw": { "language": "json" } } } } },
        { "name": "Update Status", "request": { "method": "PATCH", "url": "{{base_url}}/orders/:id/status", "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }], "body": { "mode": "raw", "raw": "{\"status\":\"active\"}", "options": { "raw": { "language": "json" } } } } }
      ]
    },
    {
      "name": "Dashboard",
      "item": [
        { "name": "Stats", "request": { "method": "GET", "url": "{{base_url}}/dashboard/stats", "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }] } }
      ]
    }
  ]
}
```

---

## Deployment

### Backend → Render

1. Push `backend/` to a GitHub repo
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add all env vars from `backend/.env` in the Render dashboard
6. Note your Render URL (e.g. `https://bnv-api.onrender.com`)

### Frontend → Vercel

1. Push `frontend/` to a GitHub repo
2. Import on [vercel.com](https://vercel.com)
3. Set env var: `VITE_API_URL=https://bnv-api.onrender.com/api`
4. Deploy

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
