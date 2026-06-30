# Authentication API Specification

## Overview
This document describes the **request** and **response** structures for all authentication‑related HTTP endpoints. It includes required headers, cookies, request bodies, and example success/error payloads.

---

## 1. `POST /api/auth/verify-key`
### Purpose
Validate an access key (admin key or volunteer key) and issue a JWT session token.

### Request
- **Headers**: `Content-Type: application/json`
- **Body** (JSON):
```json
{
  "key": "<ACCESS_KEY>"
}
```
  - `key` – Admin key (matches `env.ADMIN_KEY`) or a volunteer key stored in the `User` collection.

### Response (Success – 200 OK)
- **Headers**: Sets an HTTP‑Only cookie named `token`.
- **Body** (JSON):
```json
{
  "status": "success",
  "data": {
    "token": "<JWT_TOKEN>",
    "role": "admin" | "volunteer",
  }
}
```
### Errors
- **401 Unauthorized** – Invalid or missing key.
- **400 Bad Request** – `key` field missing.

---

## 2. `POST /api/auth/logout`
### Purpose
Terminate the current session and clear the token cookie.

### Request
- **Headers**: Cookie `token=<JWT_TOKEN>` (optional – if present, it will be cleared).
- **Body**: *None*.

### Response (200 OK)
```json
{
  "status": "success",
  "data": null,
  "message": "Logged out successfully"
}
```

---

## 3. `GET /api/auth/me`
### Purpose
Return the authenticated user's profile.

### Request
- **Headers**: Provide JWT either via:
  - `Authorization: Bearer <JWT_TOKEN>` **or**
  - Cookie `token=<JWT_TOKEN>`
- **Body**: *None*.

### Response (Success – 200 OK)
```json
{
  "status": "success",
  "data": {
    "ID": <numeric_id>,
    "role": "admin" | "volunteer"
  }
}
```
### Errors
- **401 Unauthorized** – Missing, malformed, or expired token.

---

## 4. `POST /api/admin/keys`
### Purpose
Admin creates a new volunteer access key.

### Request
- **Headers**:
  - `X-Admin-Key: <ADMIN_KEY>` (must match `env.ADMIN_KEY`)
  - `Content-Type: application/json`
- **Body** (JSON):
```json
{

}
```

### Response (Success – 201 Created)
```json
{
  "status": "success",
  "data": {
    "_id": "<MONGODB_ID>",
    "key": "<8_CHAR_HEX_KEY>",
    "role": "volunteer",
  }
}
```
### Errors
- **401 Unauthorized** – Missing `X-Admin-Key`.
- **403 Forbidden** – Invalid admin key.

---

## 5. `GET /api/admin/keys`
### Purpose
List all volunteer keys.

### Request
- **Headers**: `X-Admin-Key: <ADMIN_KEY>`
- **Body**: *None*.

### Response (200 OK)
```json
{
  "status": "success",
  "data": [
    {
      "_id": "<MONGODB_ID>",
      "key": "<8_CHAR_HEX_KEY>",
      "role": "volunteer",
    }
    // ... more entries
  ]
}
```

---

## 6. `DELETE /api/admin/keys/:id`
### Purpose
Revoke (delete) a volunteer key.

### Request
- **Headers**: `X-Admin-Key: <ADMIN_KEY>`
- **Params**: `:id` – MongoDB document `_id` of the key to delete.

### Response (200 OK)
```json
{
  "status": "success",
  "data": null,
  "message": "Key revoked successfully"
}
```
### Errors
- **404 Not Found** – Key with provided ID does not exist.
- **401/403** – Admin authentication failures.

---

## Common Headers & Cookies
- **`Content-Type`** – `application/json` for request bodies.
- **`X-Admin-Key`** – Required on all `/api/admin/*` routes; value must match the secret `ADMIN_KEY` defined in `.env`.
- **`Authorization: Bearer <token>`** – Preferred JWT delivery method.
- **`Cookie: token=<JWT_TOKEN>`** – Alternative JWT delivery; set as HTTP‑Only cookie on successful `/api/auth/verify-key`.

---

*All timestamps are in ISO‑8601 format. Errors follow the standard error schema:* 
```json
{
  "status": "error",
  "message": "<human readable error>",
  "code": <http_status_code>
}
```
