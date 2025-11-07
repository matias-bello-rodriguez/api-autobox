# AutoBox Backend API

Backend API para la plataforma AutoBox, construido con NestJS, TypeORM y MySQL.

## 📁 Estructura del Proyecto

```
api/
├── src/
│   ├── modules/              # Módulos de funcionalidad
│   │   ├── auth/            # Autenticación y autorización
│   │   ├── users/           # Gestión de usuarios
│   │   ├── vehicles/        # Gestión de vehículos
│   │   ├── inspections/     # Inspecciones técnicas
│   │   ├── chat/            # Sistema de mensajería
│   │   ├── payments/        # Procesamiento de pagos
│   │   └── search/          # Búsqueda de vehículos
│   ├── common/              # Utilidades compartidas
│   │   ├── decorators/      # Decoradores personalizados
│   │   ├── filters/         # Filtros de excepciones
│   │   ├── guards/          # Guards de autenticación
│   │   ├── interceptors/    # Interceptores
│   │   └── pipes/           # Pipes de validación
│   ├── config/              # Configuración
│   │   └── database.config.ts
│   ├── database/            # Módulo de base de datos
│   │   └── database.module.ts
│   ├── app.module.ts        # Módulo principal
│   └── main.ts              # Punto de entrada
├── test/                    # Tests e2e
├── .env.example             # Ejemplo de variables de entorno
├── package.json
└── README.md
```

## 🚀 Características

- ✅ **Autenticación**: Login y registro de usuarios con bcrypt
- ✅ **Gestión de Usuarios**: CRUD completo con validaciones
- ✅ **Vehículos**: Publicación y búsqueda de vehículos
- ✅ **Inspecciones**: Sistema de agendamiento y seguimiento
- ✅ **Chat**: Mensajería entre usuarios
- ✅ **Pagos**: Gestión de transacciones
- ✅ **TypeORM**: ORM con soporte MySQL
- ✅ **Validación**: Class-validator para DTOs
- ✅ **CORS**: Configurado para desarrollo

## 📋 Módulos

### Auth
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Users
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `POST /api/users` - Crear usuario
- `PATCH /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Vehicles
- `GET /api/vehicles` - Listar vehículos
- `GET /api/vehicles/:id` - Obtener vehículo
- `GET /api/vehicles/owner/:ownerId` - Vehículos por propietario
- `GET /api/vehicles/search?q=query` - Buscar vehículos
- `POST /api/vehicles` - Crear vehículo
- `PATCH /api/vehicles/:id` - Actualizar vehículo
- `DELETE /api/vehicles/:id` - Eliminar vehículo

### Inspections
- `GET /api/inspections` - Listar inspecciones
- `GET /api/inspections/:id` - Obtener inspección
- `GET /api/inspections/user/:userId` - Inspecciones por usuario
- `GET /api/inspections/vehicle/:vehicleId` - Inspecciones por vehículo
- `POST /api/inspections` - Crear inspección
- `PATCH /api/inspections/:id` - Actualizar inspección
- `DELETE /api/inspections/:id` - Eliminar inspección

### Chat
- `GET /api/chat/conversations/:userId` - Conversaciones de usuario
- `GET /api/chat/conversation/:userId1/:userId2` - Obtener conversación
- `POST /api/chat/messages` - Enviar mensaje
- `PATCH /api/chat/messages/:id/read` - Marcar como leído

### Payments
- `GET /api/payments` - Listar pagos
- `GET /api/payments/:id` - Obtener pago
- `GET /api/payments/user/:userId` - Pagos por usuario
- `POST /api/payments` - Crear pago
- `PATCH /api/payments/:id/status` - Actualizar estado

### Search
- `GET /api/search?q=query` - Buscar en toda la plataforma

## 🛠️ Instalación

### Requisitos Previos
- Node.js >= 16.x
- npm o yarn
- MySQL >= 5.7

### 1. Instalar dependencias

```bash
cd /home/matias/appAutobox/backend-autobox/api
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura tus credenciales:

```bash
cp .env.example .env
```

Edita `.env` con tus configuraciones:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_contraseña
DB_DATABASE=autobox

# Application
NODE_ENV=development
PORT=3000

# CORS
CORS_ORIGIN=http://localhost:8081

# JWT (Para implementación futura)
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRATION=7d
```

### 3. Crear la base de datos

Conecta a MySQL y crea la base de datos:

```sql
CREATE DATABASE autobox CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

O usando el CLI:

```bash
mysql -u root -p -e "CREATE DATABASE autobox CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 4. Iniciar el servidor

**Modo desarrollo (con hot-reload):**

```bash
npm run start:dev
```

**Modo producción:**

```bash
npm run build
npm run start:prod
```

La API estará disponible en: `http://localhost:3000/api`

## 🗄️ Base de Datos

### Tablas

El sistema utiliza TypeORM con `synchronize: true` en desarrollo, lo que crea automáticamente las siguientes tablas:

- **users** - Usuarios de la plataforma
- **vehicles** - Vehículos publicados
- **inspections** - Inspecciones técnicas
- **messages** - Mensajes del chat
- **payments** - Transacciones de pago

### Migraciones (Producción)

En producción, deberías usar migraciones en lugar de `synchronize`:

```bash
npm run migration:generate -- -n InitialMigration
npm run migration:run
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Validaciones

Todos los DTOs incluyen validaciones con `class-validator`:

- Email válido
- RUT chileno (formato: 12345678-9)
- Contraseñas de mínimo 6 caracteres
- UUIDs válidos para relaciones
- Números positivos para precios y kilómetros

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ Validación de entrada en todos los endpoints
- ✅ CORS configurado
- ⏳ JWT pendiente de implementación

## 🔄 Próximas Implementaciones

- [ ] JWT Authentication & Guards
- [ ] Upload de imágenes/videos
- [ ] WebSockets para chat en tiempo real
- [ ] Rate limiting
- [ ] Logs estructurados
- [ ] Swagger/OpenAPI documentation
- [ ] Health checks
- [ ] Docker support

## 📚 Tecnologías

- **Framework**: NestJS 10.x
- **ORM**: TypeORM 0.3.x
- **Database**: MySQL 5.7+
- **Validation**: class-validator & class-transformer
- **Security**: bcrypt
- **Config**: @nestjs/config

## 🐛 Debugging

Para depurar en VSCode, crea `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug NestJS",
      "runtimeArgs": ["--nolazy", "-r", "ts-node/register", "-r", "tsconfig-paths/register"],
      "args": ["${workspaceFolder}/src/main.ts"],
      "cwd": "${workspaceFolder}",
      "protocol": "inspector"
    }
  ]
}
```

## 📞 Soporte

Para issues o preguntas sobre el backend, contacta al equipo de desarrollo.

## 📄 Licencia

Privado - AutoBox © 2025

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
