# Estructura del Backend AutoBox

## 📐 Arquitectura General

El backend de AutoBox sigue una arquitectura modular basada en el patrón MVC adaptado para NestJS, con separación clara de responsabilidades.

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENTE (APP)                       │
│                 React Native / Expo                     │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP/REST
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   API GATEWAY (NestJS)                  │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Global Middleware & Guards                       │ │
│  │  - CORS                                            │ │
│  │  - Validation Pipe                                 │ │
│  │  - Exception Filters                               │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Auth    │  │ Vehicles │  │Inspections│
│  Module  │  │  Module  │  │  Module   │
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │              │
┌────┴─────┐  ┌───┴──────┐  ┌───┴──────┐
│  Chat    │  │ Payments │  │  Search  │
│  Module  │  │  Module  │  │  Module  │
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │              │
     └─────────────┼──────────────┘
                   ▼
         ┌──────────────────┐
         │   TypeORM Layer  │
         └─────────┬────────┘
                   ▼
         ┌──────────────────┐
         │   MySQL Database │
         └──────────────────┘
```

## 🎯 Módulos de Funcionalidad

### 1. Auth Module (Autenticación)
```
auth/
├── dto/
│   └── login.dto.ts           # DTO para login
├── auth.controller.ts         # Endpoints: /auth/login, /auth/register
├── auth.service.ts            # Lógica de autenticación
└── auth.module.ts
```

**Responsabilidades:**
- Login de usuarios
- Registro de nuevos usuarios
- Validación de credenciales (bcrypt)
- TODO: Generación de JWT tokens

### 2. Users Module (Usuarios)
```
users/
├── dto/
│   ├── create-user.dto.ts    # Validación de creación
│   └── update-user.dto.ts    # Validación de actualización
├── entities/
│   └── user.entity.ts        # Entidad TypeORM
├── users.controller.ts       # CRUD endpoints
├── users.service.ts          # Lógica de negocio
└── users.module.ts
```

**Campos de Usuario:**
- id (UUID)
- firstName, lastName
- rut (único)
- email (único)
- phone
- password (hasheado)
- avatarUrl
- isActive
- timestamps

### 3. Vehicles Module (Vehículos)
```
vehicles/
├── dto/
│   ├── create-vehicle.dto.ts
│   └── update-vehicle.dto.ts
├── entities/
│   └── vehicle.entity.ts
├── vehicles.controller.ts
├── vehicles.service.ts
└── vehicles.module.ts
```

**Campos de Vehículo:**
- id (UUID)
- plate (patente única)
- brand, model, year
- price, kilometers
- fuelType, transmission
- description, observations
- location
- images (JSON array)
- videoUrl
- status (available/sold/inspection_pending)
- hasInspection
- ownerId (relación con User)

**Funcionalidades:**
- CRUD completo
- Búsqueda por texto
- Filtrado por propietario
- Cambio de estado

### 4. Inspections Module (Inspecciones)
```
inspections/
├── dto/
│   ├── create-inspection.dto.ts
│   └── update-inspection.dto.ts
├── entities/
│   └── inspection.entity.ts
├── inspections.controller.ts
├── inspections.service.ts
└── inspections.module.ts
```

**Campos de Inspección:**
- id (UUID)
- inspectionNumber (INS-YYYY-XXXXXX)
- vehicleId (relación)
- userId (relación)
- inspectionDate, inspectionTime
- autoboxLocation
- status (pending/completed/cancelled)
- price
- results (JSON)
- images (JSON array)
- notes

**Funcionalidades:**
- Agendamiento de inspecciones
- Generación automática de número
- Seguimiento por usuario/vehículo
- Actualización de resultados

### 5. Chat Module (Mensajería)
```
chat/
├── dto/
│   └── create-message.dto.ts
├── entities/
│   └── message.entity.ts
├── chat.controller.ts
├── chat.service.ts
└── chat.module.ts
```

**Campos de Mensaje:**
- id (UUID)
- senderId, receiverId (relaciones)
- message (texto)
- vehicleId (opcional)
- isRead
- createdAt

**Funcionalidades:**
- Envío de mensajes
- Obtener conversación entre dos usuarios
- Listar conversaciones de un usuario
- Marcar como leído

### 6. Payments Module (Pagos)
```
payments/
├── dto/
│   └── create-payment.dto.ts
├── entities/
│   └── payment.entity.ts
├── payments.controller.ts
├── payments.service.ts
└── payments.module.ts
```

**Campos de Pago:**
- id (UUID)
- inspectionId (relación)
- userId (relación)
- amount
- status (pending/completed/failed)
- paymentMethod
- transactionId
- createdAt

**Funcionalidades:**
- Crear transacción
- Actualizar estado
- Historial por usuario

### 7. Search Module (Búsqueda)
```
search/
├── search.controller.ts
└── search.module.ts
```

**Funcionalidades:**
- Búsqueda global de vehículos
- Integración con VehiclesService

## 🔧 Estructura de Soporte

### Common (Utilidades Compartidas)
```
common/
├── decorators/          # Decoradores personalizados
├── filters/             # Manejadores de excepciones
│   └── all-exceptions.filter.ts
├── guards/              # Guards de autenticación/autorización
├── interceptors/        # Transformación de respuestas
└── pipes/              # Validación de entrada
    └── validation.pipe.ts
```

### Config (Configuración)
```
config/
└── database.config.ts   # Configuración de TypeORM
```

**Variables cargadas:**
- DB_HOST, DB_PORT
- DB_USERNAME, DB_PASSWORD
- DB_DATABASE
- NODE_ENV
- Opciones de sincronización y logging

### Database
```
database/
└── database.module.ts   # Módulo de conexión TypeORM
```

## 🔄 Flujo de Datos

### Ejemplo: Crear Vehículo

```
1. Cliente → POST /api/vehicles
   Body: { brand: "Toyota", model: "Corolla", ... }

2. main.ts → ValidationPipe
   ✓ Valida CreateVehicleDto

3. VehiclesController.create()
   → Recibe DTO validado

4. VehiclesService.create()
   → Crea entidad Vehicle
   → Guarda en DB con TypeORM

5. TypeORM → INSERT INTO vehicles
   
6. Response ← 201 Created
   { id: "uuid", brand: "Toyota", ... }
```

## 🗄️ Modelo de Base de Datos

```sql
-- Relaciones principales

users (1) ──< vehicles (N)
  └─ ownerId

users (1) ──< inspections (N)
  └─ userId

vehicles (1) ──< inspections (N)
  └─ vehicleId

users (1) ──< messages (N)
  ├─ senderId
  └─ receiverId

inspections (1) ──< payments (N)
  └─ inspectionId
```

## 🔐 Seguridad

### Actual
- ✅ Bcrypt para contraseñas (10 rounds)
- ✅ Validación de DTOs con class-validator
- ✅ CORS configurado
- ✅ Exception filters globales

### Pendiente
- ⏳ JWT Authentication
- ⏳ Guards de autorización
- ⏳ Rate limiting
- ⏳ Helmet para headers de seguridad

## 📊 Convenciones de Código

### Naming
- **Entities**: PascalCase, singular (User, Vehicle)
- **Controllers**: PascalCase + "Controller" (UsersController)
- **Services**: PascalCase + "Service" (UsersService)
- **DTOs**: PascalCase + "Dto" (CreateUserDto)
- **Rutas**: kebab-case, plural (/users, /vehicles)

### Respuestas HTTP
- `200 OK` - GET exitoso
- `201 Created` - POST exitoso
- `204 No Content` - DELETE exitoso
- `400 Bad Request` - Validación fallida
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto (ej: email duplicado)
- `500 Internal Server Error` - Error del servidor

### Estructura de Respuesta
```typescript
// Éxito
{
  id: "uuid",
  ...campos
}

// Error
{
  statusCode: 400,
  timestamp: "2025-11-07T...",
  message: "Validation failed" | {...}
}
```

## 🧪 Testing (Pendiente)

```
test/
├── unit/
│   ├── users.service.spec.ts
│   ├── vehicles.service.spec.ts
│   └── ...
└── e2e/
    ├── auth.e2e-spec.ts
    └── ...
```

## 🚀 Deployment

### Development
```bash
npm run start:dev
```

### Production
```bash
# Build
npm run build

# Run
NODE_ENV=production npm run start:prod
```

### Docker (Futuro)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
CMD ["node", "dist/main"]
```

## 📈 Próximas Mejoras

1. **Autenticación JWT completa**
2. **WebSockets para chat en tiempo real**
3. **Upload de archivos (S3/CloudStorage)**
4. **Notificaciones push**
5. **Swagger/OpenAPI docs**
6. **Logging estructurado (Winston)**
7. **Metrics & Health checks**
8. **Migraciones de BD**
9. **Tests automatizados**
10. **CI/CD Pipeline**

---

**Última actualización:** 7 de noviembre de 2025
