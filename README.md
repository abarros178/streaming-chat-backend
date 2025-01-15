# Streaming Chat Backend

Backend para un sistema de streaming con chat en tiempo real, desarrollado con Node.js, Express, Socket.IO y Prisma.

## ✨ Tecnologías Utilizadas

- **Node.js**
- **Express**
- **Socket.IO**
- **Prisma (ORM)**
- **MySQL**
- **JWT (Json Web Token)**
- **Bcrypt**
- **dotenv**
- **CORS**
- **Jest y Supertest (Pruebas Unitarias)**

## 📁 Estructura del Proyecto

```
streaming-chat-backend/
├── src/
│   ├── controllers/       # Lógica de controladores (auth, chat)
│   ├── middleware/        # Middleware de autenticación (JWT)
│   ├── models/            # Modelos de base de datos (Prisma)
│   ├── routes/            # Definición de rutas
│   ├── services/          # Lógica de negocio
│   ├── sockets/           # Configuración de Socket.IO
│   └── index.js           # Punto de entrada de la aplicación
├── prisma/
│   └── schema.prisma   # Esquema de la base de datos
├── tests/                # Pruebas unitarias
├── package.json          # Dependencias y scripts
├── .env                  # Variables de entorno
├── babel.config.cjs      # Configuración de Babel
└── jest.config.cjs      # Configuración de Jest
```

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/abarros178/streaming-chat-backend
cd streaming-chat-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` con el siguiente contenido:

(para la base de datos se debe crear primero el schema chat_db en la instancia de mysql)

```
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/chat_db"
JWT_SECRET="clave_secreta"
PORT=4000
```

### 4. Configurar la base de datos con Prisma

**Generar el cliente de Prisma:**
```bash
npx prisma generate
```

**Ejecutar migraciones:**
```bash
npx prisma migrate dev --name init
```

**Abrir Prisma Studio (opcional):**
```bash
npx prisma studio
```

### 5. Iniciar el servidor

**Modo desarrollo:**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

## 📊 Scripts Disponibles

- `npm run dev` → Inicia el servidor con **Nodemon**.
- `npm start` → Inicia el servidor en modo producción.
- `npm run prisma:migrate` → Ejecuta migraciones de Prisma.
- `npm run prisma:generate` → Genera el cliente de Prisma.
- `npm run prisma:studio` → Abre Prisma Studio.
- `npm test` → Ejecuta pruebas unitarias con Jest.

## 👀 Funcionalidades

- **Autenticación de usuarios** (registro e inicio de sesión con JWT y Bcrypt).
- **Roles de usuario:** STUDENT, MODERATOR, GUEST.
- **Chat en tiempo real** mediante **Socket.IO**.
- **Persistencia de mensajes** en base de datos.
- **Pruebas unitarias** con **Jest** y **Supertest**.

## 👀 Rutas API

- **Auth:**  
  - `POST /api/auth/register` → Registro de usuario.  
  - `POST /api/auth/login` → Inicio de sesión.

- **Chat:**  
  - `GET /api/chat` → Obtener todos los mensajes.  
  - `POST /api/chat` → Enviar un nuevo mensaje.

## 🛡️ Seguridad

- **JWT:** Autenticación de usuarios.
- **Bcrypt:** Hash de contraseñas.
- **Middleware:** Validación de tokens.
- **Roles:** Control de acceso por rol.

## 🔧 Pruebas Unitarias

Ejecutar pruebas con:
```bash
npm test
```

- **Autenticación:** Registro e inicio de sesión.
- **Middleware:** Validación de tokens JWT.
- **Chat:** Creación y obtención de mensajes.



