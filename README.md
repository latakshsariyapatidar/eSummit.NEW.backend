# E-Summit '26 Backend Server 🚀

Welcome to the backend repository for **E-Summit '26**, the premier entrepreneurship festival of IIT Roorkee. This repository houses the modular Express.js server, handling user bookings, UPI dynamic QR payments, gateway entry controls, and general CMS management.

---

## 🛠️ Tech Stack
- **Runtime Environment**: [Node.js](https://nodejs.org/) (v18+)
- **Web Framework**: [Express.js](https://expressjs.com/) (v5.x)
- **Database Engine**: [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)
- **Data Validation**: [Zod](https://zod.dev/)
- **Notifications**: [Nodemailer](https://nodemailer.com/) (Email) & Custom SMS integrations
- **QR Generation**: [qrcode](https://www.npmjs.com/package/qrcode)
- **Testing Suite**: [Jest](https://jestjs.io/) & [Supertest](https://www.npmjs.com/package/supertest)
- **Code Linter**: [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/)

---

## 📂 Modular Architecture
This repository implements a modular directory layout. Each feature/domain is self-contained within its own folder containing routes, controller parsing, business logic services, models, and docs.

```
backend/
├── docs/                             # Global docs directory
│   └── CONTRIBUTING.md               # Open-source contributions guide
│
├── src/
│   ├── modules/                      # Functional Domain Modules
│   │   ├── auth/                     # Admin & volunteer roles, logins, JWT, and permissions
│   │   ├── checkin/                  # Venue check-in scan validations and audit records
│   │   ├── content/                  # Landing page CMS data (Sponsors, speakers, schedule)
│   │   ├── notifications/            # Nodemailer & SMS providers with compiled HTML templates
│   │   ├── orders/                   # Ticketing checkout sessions & attendee data
│   │   ├── passes/                   # Ticket inventory tracking & unique pass generator
│   │   └── payments/                 # Dynamic UPI QR generation and transaction validations
│   │
│   ├── common/                       # Shared Utilities (Global)
│   │   ├── config/                   # Mongoose and Environment validations (Zod schemas)
│   │   ├── lib/                      # Common Logger utilities
│   │   ├── middleware/               # Global handlers (Error, Rate limiting, Request logger)
│   │   └── utils/                    # Common formatting templates (asyncHandler, apiResponse)
│   │
│   ├── app.js                        # App initialization & router mounting
│   └── server.js                     # Entry point & DB connection initialization
│
├── tests/                            # Global Integration/Unit Tests
│   ├── auth.test.js
│   ├── checkin.test.js
│   └── orders.test.js
│
├── .env.example                      # Environment templates
├── eslint.config.js                  # Flat ESLint rules configuration
├── package.json
└── README.md
```

---

## 🚀 Setup & Execution

### 1. Prerequisite Installations
Ensure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally.

### 2. Configuration Settings
Duplicate the `.env.example` file to `.env` in the root:
```bash
cp .env.example .env
```
Fill in the database path, server port, JWT keys, and payment credentials.

### 3. Installation of Packages
Restore workspace dependencies:
```bash
npm install
```

### 4. Running the Server
* Run local hot-reload development server:
  ```bash
  npm run dev
  ```
* Run production server:
  ```bash
  npm start
  ```

---

## 🧪 Testing and Linting
To maintain code quality in our open-source codebase, all PR updates must pass ESLint styling and integration tests.

* **Execute test suite**:
  ```bash
  npm run test
  ```
* **Execute linter check**:
  ```bash
  npx eslint .
  ```

---

## 🤝 Contribution Guidelines
We welcome contributions from everyone! To get started:
1. Review our design pattern and coding rules in [CONTRIBUTING.md](file:///d:/Projects/ESummit26.NEW.Backend/docs/CONTRIBUTING.md).
2. Look through active issue tickets or open a discussion thread.
3. Keep feature updates modular and well-documented.
