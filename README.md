# AdminTax - Panel de Administración de Flota de Taxis

Panel de administración completo para gestión de flota de taxis multi-ciudad con React, TypeScript, Vercel Serverless y MongoDB.

## 🚀 Stack Tecnológico

- **Frontend**: React 18 + Vite + TypeScript
- **UI**: shadcn/ui + Tailwind CSS + Lucide Icons
- **Backend**: Vercel Serverless Functions
- **Base de Datos**: MongoDB Atlas
- **Autenticación**: JWT + bcrypt
- **Despliegue**: Vercel

## 📦 Características

- ✅ Autenticación con JWT
- ✅ Sistema multi-ciudad con selector
- ✅ Dashboard con KPIs de la flota
- ✅ CRUD completo para:
  - Usuarios (Admin/Operador)
  - Vehículos
  - Choferes
  - Rutas
  - Ciudades
- ✅ Filtrado por ciudad en todas las vistas
- ✅ Diseño responsivo y moderno
- ✅ API serverless escalable

## 🛠️ Instalación Local

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd admintax
```

2. **Instalar dependencias del frontend**
```bash
npm install
```

3. **Instalar dependencias del backend**
```bash
cd api
npm install
cd ..
```

4. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` y configurar:
```
VITE_API_URL=/api
```

Para desarrollo local con MongoDB, crear `.env.local`:
```
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key
```

5. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

## 🚀 Despliegue en Vercel

### 1. Preparar MongoDB Atlas

1. Crear una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear un cluster gratuito
3. Crear una base de datos llamada `admintax`
4. Obtener la cadena de conexión (MONGODB_URI)

### 2. Desplegar en Vercel

1. Crear cuenta en [Vercel](https://vercel.com)
2. Conectar tu repositorio de GitHub
3. Importar el proyecto en Vercel
4. Configurar las variables de entorno en Vercel Dashboard:

**Environment Variables:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/admintax
JWT_SECRET=your-super-secret-key-here
```

5. Hacer clic en "Deploy"

### 3. Crear Usuario Inicial

Después del despliegue, puedes crear un usuario inicial usando la API:

```bash
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@admintax.com",
    "password": "admin123",
    "name": "Administrador",
    "role": "admin",
    "cityId": "CITY_ID_AQUI"
  }'
```

Primero necesitas crear una ciudad:

```bash
curl -X POST https://your-app.vercel.app/api/cities \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ciudad de México",
    "country": "México",
    "timezone": "America/Mexico_City",
    "active": true
  }'
```

## 📁 Estructura del Proyecto

```
/workspace/
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes UI (shadcn/ui)
│   │   └── layout/          # Layout (Sidebar, Header)
│   ├── pages/               # Páginas principales
│   ├── lib/                 # Utilidades y API client
│   ├── hooks/               # Custom hooks (useAuth)
│   └── types/               # TypeScript types
├── api/
│   ├── _lib/                # Utilidades compartidas
│   ├── auth/                # Autenticación
│   ├── users/               # CRUD usuarios
│   ├── vehicles/            # CRUD vehículos
│   ├── drivers/             # CRUD choferes
│   ├── routes/              # CRUD rutas
│   ├── cities/              # CRUD ciudades
│   └── dashboard/           # Estadísticas
├── public/
├── vercel.json              # Configuración Vercel
└── package.json
```

## 🔑 Credenciales de Prueba

Después de crear el usuario inicial, puedes acceder con:
- Email: `admin@admintax.com`
- Password: `admin123`

## 📊 Módulos

### Dashboard
- Total de vehículos
- Choferes activos
- Rutas operativas
- Vehículos en mantenimiento
- Usuarios activos
- Distribución por ciudad

### Usuarios
- Crear, editar, eliminar usuarios
- Roles: Admin / Operador
- Asignación por ciudad

### Vehículos
- Gestión completa de la flota
- Estados: Activo, Mantenimiento, Inactivo
- Filtrado por ciudad

### Choferes
- Gestión de conductores
- Asignación de vehículos
- Información de licencia

### Rutas
- Rutas operativas
- Origen, destino, distancia
- Tiempo estimado

### Configuración
- Gestión de ciudades
- Zonas horarias
- Activación/desactivación

## 🔒 Seguridad

- Autenticación JWT en todas las rutas API
- Contraseñas hasheadas con bcrypt
- Variables de entorno para secretos
- CORS configurado

## 🌐 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### CRUD
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users?id=X` - Actualizar usuario
- `DELETE /api/users?id=X` - Eliminar usuario

(Similar para vehicles, drivers, routes, cities)

### Dashboard
- `GET /api/dashboard/stats?cityId=X` - Estadísticas

## 📝 Notas

- Todas las rutas API requieren autenticación (excepto login/register)
- El filtrado por ciudad se aplica automáticamente
- Los usuarios solo pueden ver datos de su ciudad (o todas si es admin)

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama (`git checkout -b feature/amazing`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing`)
5. Abrir Pull Request

## 📄 Licencia

MIT
