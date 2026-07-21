# Health API Documentation

This endpoint is used to verify that the Express server is up and running. It is useful for load balancers, deployment status checks, container health probes, and monitoring scripts.

## Base URL
* **Local development:** `http://localhost:6996/health`
* **Production:** `https://iic.iitdh.ac.in/esummit/api/health`

---

## Endpoints

### 1. Health Check
Retrieves the current status of the server and the system timestamp.

* **Method:** `GET`
* **Path:** `/health`
* **Authentication Required:** No

#### Success Response
* **Status Code:** `200 OK`
* **Body:**
```json
{
  "message": "Server is running",
  "timestamp": 1736928000000
}
```
* `timestamp` (number): Current Unix timestamp in milliseconds.
