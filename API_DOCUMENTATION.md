# QuickBite API Documentation

**Version**: 1.0.0  
**Last Updated**: January 6, 2026  
**Status**: Production Ready ✅  

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URLs](#base-urls)
4. [API Endpoints](#api-endpoints)
5. [Request/Response Examples](#requestresponse-examples)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Status Codes](#status-codes)

---

## Overview

QuickBite API provides full-stack restaurant discovery and food ordering capabilities. The API is RESTful, uses JSON for all requests/responses, and requires JWT authentication for protected endpoints.

**Key Features:**
- ✅ 20+ API endpoints
- ✅ JWT authentication
- ✅ Rate limiting (100 req/15 min)
- ✅ CORS enabled
- ✅ Error handling
- ✅ Input validation

---

## Authentication

### JWT Bearer Token

All protected endpoints require JWT authentication via the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

### Getting a Token

**Endpoint**: `POST /api/auth/login`

```bash
curl -X POST https://quickbite-backend-zsdz.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Token Expiration

- **Expiration**: 7 days
- **Refresh**: Not implemented (use login again)

---

## Base URLs

| Environment | URL |
|-------------|-----|
| **Production** | https://quickbite-backend-zsdz.onrender.com |
| **Development** | http://localhost:5000 |

---

## API Endpoints

### Public Endpoints (No Auth Required)

#### 1. Health Check

```
GET /api/health
```

**Description**: Check if API is running

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-01-06T17:00:00.000Z",
  "uptime": 3600
}
```

---

#### 2. List Restaurants

```
GET /api/restaurants
```

**Description**: Get all available restaurants

**Query Parameters**:
- `limit` (optional): Results per page (default: 10)
- `offset` (optional): Pagination offset (default: 0)
- `category` (optional): Filter by cuisine category

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "rest_001",
      "name": "Bella Italia",
      "description": "Authentic Italian cuisine",
      "category": "Italian",
      "rating": 4.5,
      "deliveryTime": 30,
      "image": "https://..."
    }
  ],
  "total": 6
}
```

---

#### 3. Get Restaurant Details

```
GET /api/restaurants/:id
```

**Description**: Get detailed info for specific restaurant

**Parameters**:
- `id` (path): Restaurant ID

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "rest_001",
    "name": "Bella Italia",
    "description": "Authentic Italian pasta and pizza",
    "address": "123 Main St",
    "phone": "+1-555-0123",
    "rating": 4.5,
    "reviews": 128,
    "deliveryTime": 30,
    "minOrder": 15,
    "deliveryFee": 2.99
  }
}
```

---

#### 4. Get Restaurant Menu

```
GET /api/restaurants/:id/menu
```

**Description**: Get menu items for restaurant

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "item_001",
      "name": "Spaghetti Carbonara",
      "description": "Classic creamy pasta",
      "price": 14.99,
      "category": "Pasta",
      "image": "https://..."
    }
  ]
}
```

---

#### 5. AI-Powered Search

```
POST /api/search
```

**Description**: Find restaurants using natural language (Google Gemini)

**Body**:
```json
{
  "query": "I want spicy noodles"
}
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "rest_002",
      "name": "Spice Route",
      "match": 95,
      "reason": "Specializes in Indian cuisine with spicy options"
    }
  ]
}
```

---

### Protected Endpoints (JWT Required)

#### 6. Create Order

```
POST /api/orders
Authorization: Bearer <token>
```

**Body**:
```json
{
  "restaurantId": "rest_001",
  "items": [
    {
      "id": "item_001",
      "quantity": 2
    }
  ],
  "deliveryAddress": "456 Oak Ave",
  "specialNotes": "No onions"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "orderId": "order_123",
    "status": "confirmed",
    "total": 34.97,
    "estimatedDelivery": "2026-01-06T17:35:00Z"
  }
}
```

---

#### 7. Get User Orders

```
GET /api/orders
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "orderId": "order_123",
      "status": "delivered",
      "restaurant": "Bella Italia",
      "total": 34.97,
      "date": "2026-01-06T17:00:00Z"
    }
  ]
}
```

---

#### 8. Get Order Details

```
GET /api/orders/:id
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "orderId": "order_123",
    "status": "delivered",
    "items": [...],
    "total": 34.97,
    "timeline": [
      {
        "status": "confirmed",
        "timestamp": "2026-01-06T17:00:00Z"
      }
    ]
  }
}
```

---

#### 9. Update Order

```
PUT /api/orders/:id
Authorization: Bearer <token>
```

**Body**:
```json
{
  "deliveryAddress": "789 Elm St"
}
```

---

#### 10. Cancel Order

```
DELETE /api/orders/:id
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [
      {
        "field": "email",
        "message": "Must be valid email"
      }
    ]
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| INVALID_REQUEST | 400 | Bad request syntax |
| UNAUTHORIZED | 401 | Missing or invalid token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 422 | Input validation failed |
| RATE_LIMIT | 429 | Too many requests |
| SERVER_ERROR | 500 | Internal server error |

---

## Rate Limiting

**Limits**:
- 100 requests per 15 minutes
- Per IP address
- Resets every 15 minutes

**Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1672998000
```

---

## Status Codes

| Code | Meaning |
|------|----------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Auth required |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource missing |
| 422 | Unprocessable - Validation failed |
| 429 | Rate Limit - Too many requests |
| 500 | Server Error - Internal error |
| 503 | Service Unavailable - Maintenance |

---

## Request Examples

### Using cURL

```bash
# Get restaurants
curl https://quickbite-backend-zsdz.onrender.com/api/restaurants

# Login
curl -X POST https://quickbite-backend-zsdz.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password"}'

# Create order (with auth)
curl -X POST https://quickbite-backend-zsdz.onrender.com/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"restaurantId":"rest_001","items":[]}'
```

### Using JavaScript/Fetch

```javascript
// Get restaurants
fetch('https://quickbite-backend-zsdz.onrender.com/api/restaurants')
  .then(res => res.json())
  .then(data => console.log(data));

// Create order with auth
fetch('https://quickbite-backend-zsdz.onrender.com/api/orders', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    restaurantId: 'rest_001',
    items: [],
    deliveryAddress: '123 Main St'
  })
}).then(res => res.json());
```

---

## Support & Resources

- **Issues**: GitHub Issues
- **Email**: support@quickbite.com
- **Documentation**: See README.md
- **Deployment**: See DEPLOYMENT_GUIDE.md

---

## API Status

**Current Status**: ✅ Operational

- Frontend: ✅ https://quick-bite-mu.vercel.app
- Backend: ✅ https://quickbite-backend-zsdz.onrender.com
- Database: ✅ PostgreSQL (Neon)
- Health: ✅ All systems operational

---

**Last Updated**: January 6, 2026  
Production Ready ✅
