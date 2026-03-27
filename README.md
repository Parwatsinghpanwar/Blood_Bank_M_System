# RaktAmrit🩸: Comprehensive Blood Bank & Emergency Response System

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)
![React](https://img.shields.io/badge/Frontend-React.js-61DAFB.svg)
![Node](https://img.shields.io/badge/Backend-Node.js-339933.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 📌 Project Overview

BloodLink is a full-stack, role-based web application designed to digitize and streamline the lifecycle of blood donation, inventory management, and emergency blood request routing. Built on the MERN stack (MongoDB, Express.js, React, Node.js), it provides an integrated ecosystem for donors, hospitals, field collectors, volunteers, and system administrators.

The system enforces strict biological safety protocols (e.g., automated 90-day donation eligibility locks), ensures inventory traceability via real-time transaction logging, and facilitates rapid emergency response through automated donor-to-patient matching.

## ✨ Core Features by Role

### 🛡️ System Administrator
* **Emergency Queue Manager:** Routes active blood requests to available inventory or eligible volunteers using real-time database verification to prevent unsafe donations.
* **Staff Management:** Creates and provisions accounts for Hospitals, Collectors, and Volunteers, managing affiliations and role-based access control (RBAC).
* **Campaign Orchestration:** Publishes and tracks engagement for localized blood donation drives.
* **Community Oversight:** Moderates the community Q&A module to ensure accurate medical information.

### 🏥 Hospital & Blood Bank Node
* **Inventory Tracking:** Real-time logging of blood units with dynamic expiry date calculation and status flagging (Available, Used, Discarded).
* **Usage Telemetry:** Automated tracking of partial or full batch utilization with detailed transaction histories.
* **Stock Fulfullment:** Direct integration with the Admin Emergency Queue for rapid stock allocation.

### 🩸 Field Collector
* **Eligibility Enforcement:** Point-of-collection verification system that calculates donor eligibility based on historical data and strict 90-day biological safety rules.
* **Documentation & Traceability:** Secure entry of donor vitals, blood group validation, and unit volume tracking. Supports both registered users and rapid guest entries.

### 🤝 Volunteer & Donor
* **Volunteer Portal:** Dedicated interface for answering community inquiries and assisting in administrative triage.
* **Donor Dashboard:** Personal telemetry including donation history, next-eligible-date countdowns, and active campaign tracking.

## 🛠️ System Architecture & Technologies

* **Frontend:** React.js (Vite), Context API for state management, pure CSS with custom variables for isolated, scalable component styling.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB with Mongoose ODM.
* **Security:** JWT (JSON Web Tokens) authentication, bcrypt password hashing, and custom input sanitization middleware to prevent NoSQL injection and XSS.
* **Architecture:** Monorepo structure separating client and server, utilizing RESTful API principles.

## 📂 Repository Structure

```text
blood-link/
├── client/                 # React Frontend Environment
│   ├── src/
│   │   ├── components/     # Reusable UI components (Managers, Modals)
│   │   ├── context/        # React Context (AuthContext)
│   │   ├── pages/          # Role-specific Dashboards (Admin, Hospital, Collector)
│   │   ├── styles/         # Scoped, scalable CSS architectures
│   │   └── utils/          # Frontend helpers and formatters
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js/Express Backend Environment
│   ├── config/             # Database connection setups
│   ├── controllers/        # Business logic (users, inventory, requests)
│   ├── middleware/         # Auth verification, Data Sanitization
│   ├── models/             # Mongoose Schemas (User, Request, Inventory, Log)
│   ├── routes/             # RESTful API route definitions
│   ├── utils/              # Backend services (e.g., Notification Service)
│   ├── server.js           # Application entry point
│   └── package.json
└── .gitignore

```

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

* [Node.js](https://nodejs.org/) (v16.x or higher recommended)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
* Git

### Installation & Setup

**1. Clone the repository**

```bash
git clone [https://github.com/Bipul-Das/blood-link.git](https://github.com/Bipul-Das/blood-link.git)
cd blood-link

```

**2. Setup the Backend Environment**

```bash
cd server
npm install

```

Create a `.env` file in the `server` directory and configure your variables:

```env
PORT=8080
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_highly_secure_random_secret_key

```

**3. Setup the Frontend Environment**

```bash
cd ../client
npm install

```

*(If using Vite with custom env variables, create a `.env` file in the `client` directory as needed, e.g., `VITE_API_URL=http://localhost:8080/api`)*

### Running the Application

You will need two terminal instances to run the application concurrently.

**Terminal 1 (Backend):**

```bash
cd server
npm run dev    # (Assuming nodemon is configured in package.json)
# OR
node server.js

```

**Terminal 2 (Frontend):**

```bash
cd client
npm run dev

```

The application will typically be accessible via `http://localhost:5173` (Vite default) and the backend API will run on `http://localhost:8080`.

## 🛡️ Security Implementation Notes

* **Data Integrity:** All incoming payloads to the `server.js` pass through a centralized `sanitizeInput` middleware to strip malicious executable scripts.
* **Real-time Validation:** To prevent race conditions in donor allocation, the Admin Queue manager bypasses localized state and performs a `just-in-time` fetch against the primary database immediately before confirming a volunteer assignment.

## 📄 License

This project is licensed under the MIT License.

---

*Architected and developed by Bipul Das.*
