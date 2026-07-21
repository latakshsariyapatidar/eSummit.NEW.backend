# Admin Module (Key Management) API Documentation

This module manages the generation, retrieval, and revocation of volunteer access keys. All requests in this module are administrative and require authentication via the `X-Admin-Key` HTTP header.

## Base URL
* **Local development:** `http://localhost:6996/api/admin`
* **Production:** `https://iic.iitdh.ac.in/esummit/api/api/admin`

---

## Authentication Headers

Every request in this module must include the pre-shared administrator key:
```http
X-Admin-Key: <admin_key>
```

---

## Endpoints

### 1. Generate Volunteer Key
Generates a new, random 8-character volunteer access key and stores it in the database.

* **Method:** `POST`
* **Path:** `/keys`
* **Authentication Required:** Yes (`X-Admin-Key` header)

#### Request Body
* None required.

#### Success Response
* **Status Code:** `201 Created`
* **Body:**
```json
{
  "status": "success",
  "data": {
    "_id": "65ab9b08f87c5304b4c8a2b1",
    "key": "A3F9C12E",
    "role": "volunteer",
    "createdAt": "2026-01-10T08:00:00.000Z",
    "ID": 5
  },
  "message": "Volunteer key generated successfully"
}
```

#### Error Responses
* **Status Code:** `401 Unauthorized` (Admin key missing)
  ```json
  {
    "status": "error",
    "message": "Admin key is missing from X-Admin-Key header"
  }
  ```
* **Status Code:** `403 Forbidden` (Invalid admin key)
  ```json
  {
    "status": "error",
    "message": "Invalid Admin Key"
  }
  ```

---

### 2. List Volunteer Keys
Retrieves all access keys stored in the database, ordered by creation date (newest first).

* **Method:** `GET`
* **Path:** `/keys`
* **Authentication Required:** Yes (`X-Admin-Key` header)

#### Request Body
* None required.

#### Success Response
* **Status Code:** `200 OK`
* **Body:**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "65ab9b08f87c5304b4c8a2b1",
      "key": "A3F9C12E",
      "role": "volunteer",
      "createdAt": "2026-01-10T08:00:00.000Z",
      "ID": 5
    },
    {
      "_id": "65a88e99e4b0c2e3661122a0",
      "key": "D7E1F2A3",
      "role": "volunteer",
      "createdAt": "2026-01-08T12:00:00.000Z",
      "ID": 4
    }
  ],
  "message": "Volunteer keys retrieved successfully"
}
```

#### Error Responses
* **Status Code:** `401 Unauthorized` (Admin key missing)
  ```json
  {
    "status": "error",
    "message": "Admin key is missing from X-Admin-Key header"
  }
  ```
* **Status Code:** `403 Forbidden` (Invalid admin key)
  ```json
  {
    "status": "error",
    "message": "Invalid Admin Key"
  }
  ```

---

### 3. Revoke/Delete Access Key
Deletes a volunteer key from the database by its unique MongoDB `_id`, immediately revoking access for any session associated with it.

* **Method:** `DELETE`
* **Path:** `/keys/:id`
* **Authentication Required:** Yes (`X-Admin-Key` header)

#### Route Parameters
* `id` (string, required): The MongoDB `_id` of the key to delete.

#### Request Body
* None required.

#### Success Response
* **Status Code:** `200 OK`
* **Body:**
```json
{
  "status": "success",
  "data": null,
  "message": "Key revoked successfully"
}
```

#### Error Responses
* **Status Code:** `401 Unauthorized` (Admin key missing)
  ```json
  {
    "status": "error",
    "message": "Admin key is missing from X-Admin-Key header"
  }
  ```
* **Status Code:** `403 Forbidden` (Invalid admin key)
  ```json
  {
    "status": "error",
    "message": "Invalid Admin Key"
  }
  ```
* **Status Code:** `404 Not Found` (Key ID not found or invalid format)
  ```json
  {
    "status": "error",
    "message": "Key not found"
  }
  ```
* **Status Code:** `400 Bad Request` (Invalid ObjectId format syntax)
  ```json
  {
    "status": "error",
    "message": "Resource not found with id of <invalid_id_value>"
  }
  ```
