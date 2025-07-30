# 📦 Notemaker Backend

This is the Express.js backend for the **Notemaker** application, handling user authentication (signup/signin with OTP), session management, and protected route access using JWT.

---

## 🔧 Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB + Mongoose**
* **JWT (via cookies)**
* **OTP-based auth (no password login)**
* **CORS + Cookie-session**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Muqaddas12/notemaker-backend.git
cd notemaker-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_ORIGIN=http://localhost:5000
```

> ✅ Make sure the `CLIENT_ORIGIN` matches your frontend origin for CORS and cookie access.

---

## 🧩 API Routes

### `POST /api/signup`

* Send user details + OTP for registration

### `POST /api/auth/send-otp`

* Send OTP to email (used in signup & signin)

### `POST /api/auth/signin`

* OTP verification + JWT cookie issued

### `GET /api/auth/check`

* Verifies JWT from cookie, returns logged-in user if valid

### `POST /api/auth/logout`

* Clears JWT cookie

### `POST /api/auth/check-user`

* Optional: check if user exists by email

---

## ⚙️ Scripts

```bash
npm start       # Run server
npm run dev     # Run with nodemon
```

---

## 🔐 Authentication Flow

1. **User enters email** → send OTP
2. **OTP verified** → JWT issued in cookie
3. **Frontend** uses `/auth/check` to verify login on refresh

---

## 🌐 CORS + Cookies Setup

Ensure CORS is enabled in Express:

```js
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true
}));
```

And cookies are sent from the frontend:

```js
axios.post(url, data, { withCredentials: true });
```

---

## 📂 Folder Structure

```
├── controllers/
│   └── authController.mjs
├── routes/
│   └── authRoutes.mjs
├── models/
│   └── User.mjs
├── utils/
│   └── sendOtp.mjs
├── server.mjs
└── .env
```

---

## 📬 Contact

If you face any issues or want to contribute, feel free to open an issue or pull request!
