# BloodLink: Online Blood Donation and Emergency Donor Management System

BloodLink is a web-based platform designed to connect blood donors with individuals and hospitals in urgent need of blood during medical emergencies.

---

## 📌 Demo Credentials

### 🛡️ Admin Account
- **Email:** `admin@bloodlink.org`
- **Password:** `Admin@123`
- **Access Level:** Full Administrative Rights (User management, Donor verification, Emergency request overrides, Donation logs, Reports)

### 🩸 Demo Donor Account
- **Email:** `john@example.com` / `sarah@example.com`
- **Password:** `User@123`
- **Access Level:** Donor & Requester (Respond to requests, Post emergency requirements, Track donation history)

---

## 🚀 Key System Features

1. **Dual Role Access (User / Admin):**
   - **User Role:** Register as a voluntary donor, manage availability status, post emergency blood requests, respond to compatible requests, track personal donation history.
   - **Admin Role:** Protected administrative dashboard with system metrics, donor profile verification badges, user activation/deactivation toggles, request status overrides, and printable operational summaries.

2. **Emergency Blood Request Lifecycle:**
   - Rapid emergency blood request posting with patient details, hospital location, required date, units, and urgency level (**Critical**, **Urgent**, **Normal**).
   - Auto-generated unique Request ID (e.g., `REQ-918234`).
   - Request statuses: `Pending`, `Searching`, `Donor Found`, `Fulfilled`, `Cancelled`.

3. **In-App Notification System:**
   - Real-time in-app alerts dispatch to matching available donors when an emergency request is created in their city.
   - Requesters receive instant notifications when donors accept or decline requests.

4. **Donor Directory & Smart Search:**
   - Filter voluntary blood donors by **Blood Group** (A+, A-, B+, B-, AB+, AB-, O+, O-), **City**, **Area**, and **Availability Status**.

5. **Donation Management & History:**
   - Donors can record blood donation events with date, location, units donated, and status.

---

## 🛠️ Technology Stack

- **Frontend:** React.js (Vite), HTML5, CSS3, Tailwind CSS, Lucide React Icons, Axios, React Router v6.
- **Backend:** Node.js, Express.js REST API.
- **Database:** MongoDB (Mongoose ODM) with automatic fallback to MongoDB In-Memory Server for zero-setup execution.
- **Authentication & Security:** JSON Web Tokens (JWT), Password Hashing with `bcryptjs`.

---

## 📂 Project Structure

```
BloodLink/
├── client/                     # React Frontend App
│   ├── src/
│   │   ├── api/                # Axios instance configuration
│   │   ├── components/         # Navbar, Footer, DonorCard, RequestCard, StatCard, Notifications
│   │   ├── context/            # AuthContext (JWT State management)
│   │   ├── pages/              # LandingPage, LoginPage, RegisterPage, UserDashboard, FindDonors...
│   │   └── pages/admin/        # AdminDashboard, ManageUsers, AdminRequests, AdminDonations...
│   ├── package.json
│   └── vite.config.js
├── server/                     # Express Backend Server
│   ├── config/                 # Mongoose Database Connection & Memory Fallback
│   ├── controllers/            # Auth, User, Request, Donation, Notification, Admin controllers
│   ├── middleware/             # Auth JWT verification & Admin Role Check
│   ├── models/                 # User, BloodRequest, Donation, Notification schemas
│   ├── routes/                 # REST API Express endpoints
│   ├── utils/                  # Automated Seeder script
│   ├── server.js
│   └── package.json
└── README.md
```

---

## 📡 REST API Documentation

### Authentication Routes
- `POST /api/auth/register` — Register a new donor/user
- `POST /api/auth/login` — Login user or admin

### User & Donor Directory Routes
- `GET /api/users/profile` — Get logged-in user profile (`Protected`)
- `PUT /api/users/profile` — Update user details & availability (`Protected`)
- `GET /api/donors` — Search and filter voluntary donors

### Blood Request Routes
- `POST /api/requests` — Create emergency blood request (`Protected`)
- `GET /api/requests` — Fetch blood requests (filtered by bloodGroup, city, status)
- `GET /api/requests/:id` — Get request details by ID
- `PUT /api/requests/:id` — Update blood request (`Protected`)
- `DELETE /api/requests/:id` — Delete request (`Protected`)
- `POST /api/requests/:id/respond` — Donor respond (Accept/Reject) (`Protected`)

### Donation Routes
- `POST /api/donations` — Log a new donation event (`Protected`)
- `GET /api/donations` — Fetch user/system donation history (`Protected`)

### Notification Routes
- `GET /api/notifications` — Fetch user in-app notifications (`Protected`)
- `PUT /api/notifications/:id/read` — Mark notification as read (`Protected`)
- `PUT /api/notifications/read-all` — Mark all notifications read (`Protected`)

### Admin Protected Routes
- `GET /api/admin/statistics` — Get admin dashboard summary metrics
- `GET /api/admin/users` — Fetch all user records
- `GET /api/admin/donors` — Fetch donor directory records
- `PUT /api/admin/users/:id/toggle-status` — Activate / Deactivate user account
- `PUT /api/admin/users/:id/verify` — Toggle donor verification badge
- `GET /api/admin/requests` — Fetch all blood requests
- `PUT /api/admin/requests/:id` — Override request status or emergency level
- `DELETE /api/admin/users/:id` — Delete invalid user record

---

## ⚙️ Installation & Running the Application

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)
- MongoDB running locally OR MongoDB Atlas URI (optional; in-memory fallback will automatically kick in if MongoDB is not running locally).

### 2. Run Backend Server
```bash
cd server
npm install
npm start
```
The server will boot up on `http://localhost:5000` and automatically seed initial demo accounts (Admin & Donors).

### 3. Run Frontend App
In a separate terminal window:
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 🔮 Future Enhancements

1. Map & Geo-location integration for distance-based donor matching.
2. Email & SMS notification gateways (Twilio / SendGrid integration).
3. Direct hospital API integration for blood bank inventory tracking.
4. AI-based emergency priority scoring & automated donor phone dispatch.
5. Multilingual interface support.
