# Traveloop Backend API Documentation

## Overview
RESTful API for the Traveloop travel planning application built with Express.js and MongoDB.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Signup
```
POST /auth/signup
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```
**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login
```
POST /auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:** Same as signup

---

### Trips

#### Create Trip
```
POST /trips (Protected)
```
**Body:**
```json
{
  "name": "Summer Europe Tour",
  "description": "Visit Paris, Rome, and Barcelona",
  "startDate": "2024-06-01",
  "endDate": "2024-06-30",
  "budget": 5000,
  "coverPhoto": "https://..."
}
```

#### Get All User Trips
```
GET /trips (Protected)
```
**Response:**
```json
[
  {
    "_id": "trip_id",
    "name": "Summer Europe Tour",
    "description": "...",
    "startDate": "2024-06-01",
    "endDate": "2024-06-30",
    "budget": 5000,
    "stops": []
  }
]
```

#### Get Trip Details
```
GET /trips/:id (Protected)
```
**Response:**
```json
{
  "_id": "trip_id",
  "name": "Summer Europe Tour",
  "stops": [
    {
      "_id": "stop_id",
      "city": "Paris",
      "country": "France",
      "startDate": "2024-06-01",
      "endDate": "2024-06-05",
      "activities": [
        {
          "_id": "activity_id",
          "name": "Eiffel Tower",
          "category": "sightseeing",
          "cost": 25
        }
      ]
    }
  ]
}
```

#### Update Trip
```
PUT /trips/:id (Protected)
```
**Body:** Any fields to update
```json
{
  "name": "Updated Trip Name",
  "budget": 6000
}
```

#### Delete Trip
```
DELETE /trips/:id (Protected)
```
**Response:**
```json
{
  "message": "Trip deleted"
}
```

#### Get Public Trip
```
GET /trips/public/:id (Public)
```
**Note:** Only works if trip has `isPublic: true`

---

## Error Responses

### 400 Bad Request
```json
{
  "error": {
    "status": 400,
    "message": "All fields are required"
  }
}
```

### 401 Unauthorized
```json
{
  "error": {
    "status": 401,
    "message": "Invalid or expired token"
  }
}
```

### 403 Forbidden
```json
{
  "error": {
    "status": 403,
    "message": "Unauthorized"
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "status": 404,
    "message": "Trip not found"
  }
}
```

### 500 Server Error
```json
{
  "error": {
    "status": 500,
    "message": "Internal Server Error"
  }
}
```

---

## Models

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  profilePicture: String,
  language: String,
  savedDestinations: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Trip Schema
```javascript
{
  name: String (required),
  description: String,
  userId: ObjectId (required),
  startDate: Date (required),
  endDate: Date (required),
  coverPhoto: String,
  budget: Number,
  stops: [ObjectId],
  isPublic: Boolean,
  sharedWith: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Stop Schema
```javascript
{
  tripId: ObjectId (required),
  city: String (required),
  country: String,
  startDate: Date (required),
  endDate: Date (required),
  activities: [ObjectId],
  accommodation: {
    name: String,
    cost: Number,
    checkInDate: Date,
    checkOutDate: Date
  },
  notes: String,
  estimatedCost: Number,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Activity Schema
```javascript
{
  stopId: ObjectId (required),
  name: String (required),
  category: String (enum: sightseeing, food, adventure, culture, relaxation, shopping, nightlife, other),
  description: String,
  cost: Number,
  duration: Number, // hours
  date: Date,
  time: String,
  images: [String],
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Testing Endpoints

Use Postman, Insomnia, or cURL to test endpoints.

### Example with cURL

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Create Trip (with token):**
```bash
curl -X POST http://localhost:5000/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Europe Trip",
    "startDate": "2024-06-01",
    "endDate": "2024-06-30",
    "budget": 5000
  }'
```

---

## Middleware

### CORS
- Configured for frontend origin (http://localhost:3000)

### Error Handler
- Catches all errors and returns formatted JSON responses
- Includes stack trace in development mode

### JWT Protection
- `protect` middleware validates JWT tokens
- Attached to all protected endpoints

---

## Future Endpoints (To Implement)

- `POST /trips/:tripId/stops` - Add stop to trip
- `PUT /trips/:tripId/stops/:stopId` - Update stop
- `DELETE /trips/:tripId/stops/:stopId` - Delete stop
- `POST /trips/:tripId/activities` - Add activity to stop
- `PUT /trips/:tripId/activities/:activityId` - Update activity
- `DELETE /trips/:tripId/activities/:activityId` - Delete activity
- `POST /trips/:tripId/notes` - Add note
- `PUT /trips/:tripId/notes/:noteId` - Update note
- `DELETE /trips/:tripId/notes/:noteId` - Delete note
- `POST /cities/search` - Search cities
- `GET /cities/:id/activities` - Get activities for a city

---

## Rate Limiting

Currently not implemented. Consider adding in production.

## Versioning

Current API version: v1 (base URL structure can support versioning: `/api/v1/...`)

