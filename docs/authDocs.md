# Auth Module Flow (authDocs)

This document outlines the high‑level flow of the **Authentication** and **Admin** modules in the E‑Summit ’26 backend.

## Core Components
- **auth.routes.js** – Registers two routers:
  - `/api/auth` (public) – key verification, logout, current‑user.
  - `/api/admin` (protected) – key generation, listing, deletion, DB state, order verification, pass config.
- **auth.controller.js** – Handles the HTTP logic:
  - `verifyKey` validates an access key (admin key or volunteer key), calls `auth.service.authenticateKey`, sets an HTTP‑only `token` cookie and returns `{ token, role }`.
  - `logoutHandler` clears the `token` cookie.
  - `getMeHandler` returns the logged‑in user information (`ID`, `role`).
  - Admin handlers (`createKeyHandler`, `listKeysHandler`, `deleteKeyHandler`) call the service functions for volunteer key management.
- **auth.service.js** – Business logic:
  - `authenticateKey` checks the pre‑shared `ADMIN_KEY` or looks up a volunteer key in the DB, then issues a JWT via `generateSessionToken` (30‑day expiry).
  - `generateVolunteerKey` creates a new 8‑character key, stores it as a `User` document, and returns the document.
  - `listKeys` / `deleteKey` provide CRUD for keys.
  - `generateSessionToken` signs a JWT (`id`, `role`).
- **auth.middleware.js** – Security layer:
  - `verifyAdminKey` validates the `X‑Admin-Key` header against `env.ADMIN_KEY` and logs the admin audit.
  - `protect` extracts a JWT from the `Authorization: Bearer <token>` header **or** the `token` cookie, verifies it, and attaches the user (or admin) to `req.user`.
  - `requireAdmin` / `requireVolunteer` enforce role‑based access.

## Request Flow
1. **Admin login (key verification)** – `POST /api/auth/verify-key` with `{ key: <admin‑key> }`.
   - Service returns a JWT and role `admin`.
   - Controller sets an **HTTP‑only cookie** named `token` (valid 1 day) and also returns the token in the JSON body.
2. **Volunteer login (generated key)** – Same endpoint with a volunteer key stored in the DB.
   - Returns a JWT with `role: volunteer` and cookie.
3. **Authenticated calls** – Subsequent requests include either:
   - `Authorization: Bearer <jwt>` header **or**
   - `Cookie: token=<jwt>`.
   - `protect` middleware validates the token, loads the corresponding `User` document, and populates `req.user`.
4. **Admin actions** – Routes under `/api/admin` require `verifyAdminKey` (header `X‑Admin‑Key`).
   - After admin verification, `protect` ensures the admin session is still valid.
   - Handlers perform key creation/list/deletion, DB state fetch, order verification, pass config updates.
5. **Logout** – `POST /api/auth/logout` clears the `token` cookie.

## Cookie & Header Details
- **Cookie**: `token` – HTTP‑only, `Secure` when `NODE_ENV=production`, `SameSite=strict`, expires in 1 day.
- **Headers**:
  - `X‑Admin‑Key` (required for any `/api/admin/*` route).
  - `Authorization: Bearer <jwt>` (optional when cookie is present).
- **Audit Logging** – Every admin request logs an audit entry via `logger.info` in `auth.middleware.verifyAdminKey`.

---

*All endpoints and their request/response payloads are documented in the companion file **authApiSpec.md**.*
