# API Quick Reference

Base URL: `http://localhost:3000/api`

## 🔐 Authentication

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "Pérez",
  "rut": "12345678-9",
  "email": "juan@example.com",
  "phone": "+56912345678",
  "password": "password123"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

## 👤 Users

### List All Users
```http
GET /api/users
```

### Get User by ID
```http
GET /api/users/{id}
```

### Update User
```http
PATCH /api/users/{id}
Content-Type: application/json

{
  "firstName": "Juan Carlos",
  "phone": "+56987654321"
}
```

### Delete User
```http
DELETE /api/users/{id}
```

## 🚗 Vehicles

### List All Vehicles
```http
GET /api/vehicles
```

### Search Vehicles
```http
GET /api/vehicles/search?q=toyota
```

### Get Vehicle by ID
```http
GET /api/vehicles/{id}
```

### Get Vehicles by Owner
```http
GET /api/vehicles/owner/{ownerId}
```

### Create Vehicle
```http
POST /api/vehicles
Content-Type: application/json

{
  "plate": "ABC-1234",
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2020,
  "price": 12000000,
  "kilometers": 45000,
  "fuelType": "Gasolina",
  "transmission": "Automática",
  "description": "Vehículo en excelente estado",
  "location": "Santiago, RM",
  "ownerId": "user-uuid-here",
  "images": ["url1", "url2"],
  "hasInspection": false
}
```

### Update Vehicle
```http
PATCH /api/vehicles/{id}
Content-Type: application/json

{
  "price": 11500000,
  "status": "sold"
}
```

### Delete Vehicle
```http
DELETE /api/vehicles/{id}
```

## 🔍 Inspections

### List All Inspections
```http
GET /api/inspections
```

### Get Inspection by ID
```http
GET /api/inspections/{id}
```

### Get Inspections by User
```http
GET /api/inspections/user/{userId}
```

### Get Inspections by Vehicle
```http
GET /api/inspections/vehicle/{vehicleId}
```

### Create Inspection
```http
POST /api/inspections
Content-Type: application/json

{
  "vehicleId": "vehicle-uuid",
  "userId": "user-uuid",
  "inspectionDate": "2025-11-15",
  "inspectionTime": "14:30",
  "autoboxLocation": "AutoBox Providencia",
  "price": 90000
}
```

### Update Inspection
```http
PATCH /api/inspections/{id}
Content-Type: application/json

{
  "status": "completed",
  "results": {
    "motor": "OK",
    "frenos": "OK",
    "suspension": "Requiere atención"
  },
  "notes": "Inspección completada sin problemas mayores"
}
```

### Delete Inspection
```http
DELETE /api/inspections/{id}
```

## 💬 Chat

### Get User Conversations
```http
GET /api/chat/conversations/{userId}
```

### Get Conversation Between Two Users
```http
GET /api/chat/conversation/{userId1}/{userId2}
```

### Send Message
```http
POST /api/chat/messages
Content-Type: application/json

{
  "senderId": "user-uuid-1",
  "receiverId": "user-uuid-2",
  "message": "Hola, me interesa tu vehículo",
  "vehicleId": "vehicle-uuid"
}
```

### Mark Message as Read
```http
PATCH /api/chat/messages/{messageId}/read
```

## 💳 Payments

### List All Payments
```http
GET /api/payments
```

### Get Payment by ID
```http
GET /api/payments/{id}
```

### Get Payments by User
```http
GET /api/payments/user/{userId}
```

### Create Payment
```http
POST /api/payments
Content-Type: application/json

{
  "inspectionId": "inspection-uuid",
  "userId": "user-uuid",
  "amount": 90000,
  "paymentMethod": "credit_card"
}
```

### Update Payment Status
```http
PATCH /api/payments/{id}/status
Content-Type: application/json

{
  "status": "completed",
  "transactionId": "TXN-123456789"
}
```

## 🔎 Search

### Global Search
```http
GET /api/search?q=toyota corolla 2020
```

## 📊 Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Successful deletion
- `400 Bad Request` - Invalid input
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate entry (email, RUT, plate)
- `500 Internal Server Error` - Server error

## 🔧 Testing with cURL

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "rut": "11111111-1",
    "email": "test@test.com",
    "password": "test123"
  }'
```

### Create Vehicle
```bash
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "plate": "TEST-123",
    "brand": "Toyota",
    "model": "Corolla",
    "year": 2020,
    "price": 10000000,
    "kilometers": 50000,
    "fuelType": "Gasolina",
    "transmission": "Manual",
    "ownerId": "your-user-uuid"
  }'
```

### Search Vehicles
```bash
curl http://localhost:3000/api/vehicles/search?q=toyota
```

## 📱 Response Examples

### Successful User Creation
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "firstName": "Juan",
  "lastName": "Pérez",
  "rut": "12345678-9",
  "email": "juan@example.com",
  "phone": "+56912345678",
  "avatarUrl": null,
  "isActive": true,
  "createdAt": "2025-11-07T15:30:00.000Z",
  "updatedAt": "2025-11-07T15:30:00.000Z"
}
```

### Error Response
```json
{
  "statusCode": 409,
  "timestamp": "2025-11-07T15:30:00.000Z",
  "message": "El email o RUT ya está registrado"
}
```

### Vehicle List Response
```json
[
  {
    "id": "uuid-1",
    "plate": "ABC-1234",
    "brand": "Toyota",
    "model": "Corolla",
    "year": 2020,
    "price": "12000000.00",
    "kilometers": 45000,
    "status": "available",
    "owner": {
      "id": "user-uuid",
      "firstName": "Juan",
      "lastName": "Pérez"
    },
    "createdAt": "2025-11-07T15:30:00.000Z"
  }
]
```

---

**Tip:** Use [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) for easier API testing!
