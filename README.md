  Overview

Crunch Corner is a single-restaurant food delivery platform that lets customers browse a menu, place orders, and track their order history, while giving admins full control over food items, categories, and order fulfillment. It's built on the **MERN stack** with **Firebase Authentication** for secure, Gmail-verified sign-ups.

---
  Live Demo
<div align="center">
(https://crunch-corner.vercel.app/)
</div>

  

  Features

 Customer Experience
- Gmail-only registration with mandatory Firebase email verification
- Browse menu items by category
- Detailed food item views with rich descriptions
- Persistent cart with add/remove functionality
- Checkout with delivery address
- Order history tracking
- Profile management with MongoDB-backed delivery addresses
- Fully responsive design for mobile and desktop

 Admin Dashboard
- At-a-glance order statistics
- Full CRUD for food items and categories
- Order lifecycle management (accept, prepare, deliver)
- One-click "Deals" toggle for promotional items
- User account management

---

 Tech Stack

| Layer            | Technologies |
|-------------------|--------------|
| **Frontend**       | React 19, Vite, Tailwind CSS, Redux Toolkit, React Router DOM, Framer Motion, React Hot Toast, React Icons |
| **Authentication** | Firebase Auth (email verification, Gmail-only sign-up) |
| **Backend**        | Node.js, Express.js |
| **Database**       | MongoDB with Mongoose |
| **Security**       | JWT Authentication, bcrypt password hashing, CORS |

---

 Project Structure

```
Food-Delivery-App/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/       # Mobile/Admin layouts and navigation
│   │   │   └── ui/           # Reusable UI components
│   │   ├── context/          # Auth and Theme contexts
│   │   ├── firebase/         # Firebase configuration and auth utilities
│   │   ├── pages/            # All page components
│   │   ├── redux/            # Redux store and slices
│   │   ├── routes/           # App routing
│   │   └── utils/            # API utilities
│   ├── backend/
│   │   ├── config/           # Database configuration
│   │   ├── controllers/      # Request handlers
│   │   ├── middleware/       # Auth and other middleware
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API routes
│   │   └── server.js         # Express server entry point
│   ├── public/
│   └── package.json
└── README.md
```

---

 Getting Started

### Prerequisites

Make sure you have the following installed/set up before you begin:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (local instance or Atlas cluster)
- A [Firebase](https://firebase.google.com/) project with Authentication enabled

### 1. Clone the repository

```bash
git clone https://github.com/eshmalarshad/Crunch-Corner.git
cd crunch-corner
```

### 2. Backend Setup

```bash
cd frontend/backend
npm install
```

Create a `.env` file in the `backend` directory (see [Environment Variables](#-environment-variables)), then start the server:

```bash
npm start
```

The API will be available at `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (Vite's default port).

### 4. Create an Admin User

Use the included helper script to promote an existing user to admin status:

```bash
node make-admin.js
```

---

##  Environment Variables

### Backend (`frontend/backend/.env`)

```env
MONGO_URI=your_locahost_connectionstring
JWT_SECRET=your-jwt-secret-here
PORT=5000
```

### Frontend

Create a Firebase config file at `frontend/src/firebase/firebase.config.js` with your Firebase project credentials.

---

##  Business Rules

- **Account creation** — Only Gmail addresses are accepted, and Firebase email verification is mandatory before login.
- **Role-based redirection** — Admins are routed to `/admin`; regular users are routed to `/menu`.
- **Pricing** — First-time orders receive a 20% discount; delivery is a flat Rs. 250 charge.
- **Data storage** — User profile data, including delivery addresses, is persisted in MongoDB rather than local storage.
- **Deals** — Items flagged with `isDeal: true` automatically surface in the featured deals carousel.

---

