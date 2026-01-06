# QuickBite API Documentation

## Overview
QuickBite is a full-stack restaurant discovery and food ordering platform with AI-powered search using Google Gemini. This document provides comprehensive API endpoint documentation for the backend service.

## Base URL
**Production**: `https://quickbite-backend-zsdz.onrender.com`
**Development**: `http://localhost:5000`

## Authentication
All protected endpoints require JWT authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### 1. Health Check
**GET** `/api/health`
- **Description**: Check backend server health status
- **Authentication**: Not required
- **Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-01-06T17:00:00Z",
  "uptime": 3600
}
```

### 2. Restaurants

#### Get All Restaurants
**GET** `/api/restaurants`
- **Description**: Retrieve all restaurants with their basic information
- **Authentication**: Not required
- **Query Parameters**: None
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Pizza Palace",
      "cuisine": "Italian",
      "rating": 4.5,
      "deliveryTime": "30 mins",
      "description": "Authentic Italian pizza"
    }
  ],
  "total": 1
}
```

#### Get Restaurant by ID
**GET** `/api/restaurants/:id`
- **Description**: Get detailed information about a specific restaurant including menus
- **Authentication**: Not required
- **Parameters**: `id` (restaurant ID)
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Pizza Palace",
    "cuisine": "Italian",
    "rating": 4.5,
    "deliveryTime": "30 mins",
    "menus": [
      {
        "id": 1,
        "name": "Margherita",
        "price": 12.99,
        "description": "Classic tomato and cheese pizza"
      }
    ]
  }
}
```

### 3. Menu Items

#### Get Menu Items for Restaurant
**GET** `/api/restaurants/:restaurantId/menus`
- **Description**: Get all menu items for a specific restaurant
- **Authentication**: Not required
- **Parameters**: `restaurantId`
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Margherita",
      "price": 12.99,
      "description": "Classic tomato and cheese pizza",
      "category": "Pizza"
    }
  ]
}
```

### 4. Orders

#### Create Order
**POST** `/api/orders`
- **Description**: Create a new food order
- **Authentication**: Required (JWT Bearer token)
- **Request Body**:
```json
{
  "restaurantId": 1,
  "items": [
    {
      "menuId": 1,
      "quantity": 2,
      "price": 12.99
    }
  ],
  "totalAmount": 25.98,
  "deliveryAddress": "123 Main St"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "orderId": "ORD-123456",
    "status": "pending",
    "totalAmount": 25.98,
    "estimatedDelivery": "2025-01-06T17:30:00Z"
  }
}
```

#### Get User Orders
**GET** `/api/orders`
- **Description**: Get all orders for the authenticated user
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "orderId": "ORD-123456",
      "restaurantName": "Pizza Palace",
      "totalAmount": 25.98,
      "status": "delivered",
      "createdAt": "2025-01-05T17:00:00Z"
    }
  ]
}
```

#### Get Order Details
**GET** `/api/orders/:orderId`
- **Description**: Get detailed information about a specific order
- **Authentication**: Required
- **Parameters**: `orderId`
- **Response**:
```json
{
  "success": true,
  "data": {
    "orderId": "ORD-123456",
    "restaurantName": "Pizza Palace",
    "items": [
      {
        "name": "Margherita",
        "quantity": 2,
        "price": 12.99
      }
    ],
    "totalAmount": 25.98,
    "status": "delivered",
    "deliveryAddress": "123 Main St",
    "createdAt": "2025-01-05T17:00:00Z",
    "deliveredAt": "2025-01-05T17:30:00Z"
  }
}
```

### 5. Search

#### AI-Powered Search
**POST** `/api/search`
- **Description**: Search for restaurants and food using Google Gemini AI
- **Authentication**: Not required
- **Request Body**:
```json
{
  "query": "best pizza near me"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "query": "best pizza near me",
    "results": [
      {
        "id": 1,
        "name": "Pizza Palace",
        "cuisine": "Italian",
        "relevance": "high"
      }
    ],
    "aiSummary": "Found top-rated Italian pizzerias..."
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

### Common Error Codes
| Code | Status | Description |
|------|--------|-------------|
| INVALID_REQUEST | 400 | Request validation failed |
| UNAUTHORIZED | 401 | Missing or invalid JWT token |
| FORBIDDEN | 403 | User doesn't have permission |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists |
| SERVER_ERROR | 500 | Internal server error |

## Rate Limiting
- **Limit**: 100 requests per 15 minutes per IP
- **Header**: `X-RateLimit-Remaining`
- **Reset Time**: `X-RateLimit-Reset`

## CORS Policy
- **Allowed Origins**: `https://quick-bite-mu.vercel.app`, `http://localhost:3000`
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: Content-Type, Authorization

## Database Schema

### Restaurants Table
```sql
CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cuisine VARCHAR(100),
  rating DECIMAL(3,2),
  delivery_time VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Menus Table
```sql
CREATE TABLE menus (
  id SERIAL PRIMARY KEY,
  restaurant_id INT REFERENCES restaurants(id),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2),
  description TEXT,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT,
  restaurant_id INT REFERENCES restaurants(id),
  total_amount DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending',
  delivery_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivered_at TIMESTAMP
);
```

## Testing the API

### Using cURL
```bash
# Health check
curl https://quickbite-backend-zsdz.onrender.com/api/health

# Get all restaurants
curl https://quickbite-backend-zsdz.onrender.com/api/restaurants

# Create order (with authentication)
curl -X POST https://quickbite-backend-zsdz.onrender.com/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": 1,
    "items": [{"menuId": 1, "quantity": 1, "price": 12.99}],
    "totalAmount": 12.99
  }'
```

### Using Postman
1. Import the API endpoints
2. Set the Authorization header to Bearer token type
3. Test each endpoint with sample data

## Best Practices

1. **Always include JWT token** for protected endpoints
2. **Handle rate limiting** with exponential backoff
3. **Validate input data** on the client side before sending
4. **Cache responses** when possible to reduce API calls
5. **Monitor error responses** and handle gracefully
6. **Use query parameters** for filtering and pagination
7. **Test error scenarios** (invalid tokens, missing data, etc.)

## Support & Troubleshooting

For issues or questions:
- Check the GitHub repository: https://github.com/unnita1235/QuickBite
- Open an issue on GitHub
- Contact: unnita1235@gmail.com

## Version History

| Version | Date | Changes |
|---------|------|----------|
| 1.0 | 2025-01-06 | Initial API documentation |

## License
MIT License - See LICENSE file for details
