# Auth Module API Documentation

This module manages key-based authentication for volunteers and admins. Instead of traditional email and password combinations, users log in using a pre-shared access key. The backend verifies the key and returns a JSON Web Token (JWT).

## Base URL
* **Local development:** `http://localhost:6996/api/auth`
* **Production:** `https://iic.iitdh.ac.in/esummit/api/api/auth`

---

## Authentication Flow Details

The server delivers the JWT session token in two ways upon successful verification:
1. **HTTP-Only Cookie:** A cookie named `token` (automatically sent on subsequent requests if the frontend is configured with `credentials: 'include'`).
2. **Response Body:** In `data.token` within the returned JSON object.

For subsequent authenticated requests, the frontend must either:
* Include the JWT token in the HTTP `Authorization` header as:
  ```http
  Authorization: Bearer <token>
  ```
* Ensure credentials sharing is enabled (`credentials: 'include'`) to utilize the automatically managed HTTP-only cookie.

---

## Endpoints

### 1. Verify Access Key
Authenticates the user with an access key (admin key or volunteer key).

* **Method:** `POST`
* **Path:** `/verify-key`
* **Authentication Required:** No
* **Rate Limited:** Yes (brute-force prevention)

#### Request Body
```json
{
  "key": "ABCD1234"
}
```
* `key` (string, required): The pre-shared volunteer hex key or the main admin passphrase.

#### Success Response
* **Status Code:** `200 OK`
* **Body:**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role": "volunteer"
  },
  "message": "Key verified successfully"
}
```
* `data.role` will be either `"admin"` or `"volunteer"`.

#### Error Responses
* **Status Code:** `400 Bad Request` (Key missing)
  ```json
  {
    "status": "error",
    "message": "Access key is required"
  }
  ```
* **Status Code:** `401 Unauthorized` (Invalid key)
  ```json
  {
    "status": "error",
    "message": "Invalid access key"
  }
  ```
* **Status Code:** `429 Too Many Requests` (Rate limit exceeded)
  ```json
  {
    "status": "error",
    "message": "Too many requests, please try again later."
  }
  ```

---

### 2. Log Out
Clears the session cookie on the server.

* **Method:** `POST`
* **Path:** `/logout`
* **Authentication Required:** No

#### Request Body
* None required.

#### Success Response
* **Status Code:** `200 OK`
* **Body:**
```json
{
  "status": "success",
  "data": null,
  "message": "Logged out successfully"
}
```

---

### 3. Get Current User Info
Retrieves the logged-in user's identity details from the current session. Used to restore state on frontend app reload.

* **Method:** `GET`
* **Path:** `/me`
* **Authentication Required:** Yes (expects token via cookie or `Authorization` header)

#### Request Headers
```http
Authorization: Bearer <jwt_token>
```

#### Success Response
* **Status Code:** `200 OK`
* **Body:**
```json
{
  "status": "success",
  "data": {
    "ID": 3,
    "role": "volunteer"
  }
}
```

#### Error Responses
* **Status Code:** `401 Unauthorized` (Token missing)
  ```json
  {
    "status": "error",
    "message": "Not authorized to access this route. Token is missing."
  }
  ```
* **Status Code:** `401 Unauthorized` (Token invalid or expired)
  ```json
  {
    "status": "error",
    "message": "Not authorized to access this route. Token is invalid or expired."
  }
  ```
* **Status Code:** `401 Unauthorized` (Key no longer exists in DB)
  ```json
  {
    "status": "error",
    "message": "Not authorized. The key associated with this session no longer exists."
  }
  ```
