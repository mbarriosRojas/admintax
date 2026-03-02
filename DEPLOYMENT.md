# 🚀 Guía de Despliegue - AdminTax

## Pasos para Desplegar en Vercel

### 1️⃣ Preparar MongoDB Atlas

1. **Crear cuenta en MongoDB Atlas**
   - Ir a [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Crear cuenta gratuita

2. **Crear un Cluster**
   - Seleccionar "Build a Database"
   - Elegir el plan FREE (M0)
   - Seleccionar región más cercana
   - Nombre del cluster: `admintax-cluster`

3. **Configurar acceso**
   - En "Security > Database Access": Crear usuario con contraseña
   - En "Security > Network Access": Agregar `0.0.0.0/0` (permitir acceso desde cualquier IP)

4. **Obtener cadena de conexión**
   - Click en "Connect" en tu cluster
   - Seleccionar "Connect your application"
   - Copiar la cadena de conexión:
   ```
   mongodb+srv://<username>:<password>@admintax-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Reemplazar `<username>` y `<password>` con tus credenciales

### 2️⃣ Desplegar en Vercel

1. **Crear cuenta en Vercel**
   - Ir a [https://vercel.com](https://vercel.com)
   - Registrarse con GitHub

2. **Importar proyecto**
   - Click en "Add New..." > "Project"
   - Seleccionar el repositorio `admintax`
   - Click en "Import"

3. **Configurar el proyecto**
   - Framework Preset: `Vite`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Agregar Variables de Entorno**
   En "Environment Variables" agregar:
   
   ```
   MONGODB_URI=mongodb+srv://usuario:password@admintax-cluster.xxxxx.mongodb.net/admintax?retryWrites=true&w=majority
   JWT_SECRET=tu-super-secreto-jwt-cambia-esto-en-produccion-12345
   ```
   
   **IMPORTANTE**: 
   - Reemplazar la cadena de MongoDB con la tuya
   - Generar un JWT_SECRET único y seguro (mínimo 32 caracteres)

5. **Deploy**
   - Click en "Deploy"
   - Esperar ~2 minutos

### 3️⃣ Inicializar la Base de Datos

Una vez desplegado, necesitas crear al menos una ciudad y un usuario:

#### Crear la primera ciudad

```bash
curl -X POST https://tu-app.vercel.app/api/cities \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ciudad de México",
    "country": "México",
    "timezone": "America/Mexico_City",
    "active": true
  }'
```

**Respuesta:**
```json
{
  "_id": "65abc123...",
  "name": "Ciudad de México",
  ...
}
```

**Copia el `_id` de la respuesta** para el siguiente paso.

#### Crear el primer usuario

```bash
curl -X POST https://tu-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@admintax.com",
    "password": "Admin123!",
    "name": "Administrador Principal",
    "role": "admin",
    "cityId": "65abc123..."
  }'
```

Reemplaza `cityId` con el ID que copiaste en el paso anterior.

### 4️⃣ Acceder a la Aplicación

1. Ir a `https://tu-app.vercel.app`
2. Iniciar sesión con:
   - Email: `admin@admintax.com`
   - Password: `Admin123!`

## ✅ Verificación Post-Despliegue

Verifica que todo funcione correctamente:

- [ ] La página de login carga correctamente
- [ ] Puedes iniciar sesión con las credenciales
- [ ] El dashboard muestra las estadísticas
- [ ] Puedes crear nuevos usuarios
- [ ] Puedes crear vehículos
- [ ] El selector de ciudad funciona
- [ ] Puedes cerrar sesión

## 🔧 Configuración Adicional (Opcional)

### Dominio Personalizado

1. En Vercel Dashboard > Settings > Domains
2. Agregar tu dominio personalizado
3. Configurar DNS según las instrucciones

### Monitoreo

- Vercel automáticamente provee:
  - Analytics
  - Logs de funciones serverless
  - Métricas de rendimiento

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"
- Verificar que MONGODB_URI esté correctamente configurado
- Verificar que la IP `0.0.0.0/0` esté en Network Access de MongoDB

### Error: "Invalid token"
- Verificar que JWT_SECRET esté configurado
- Cerrar sesión y volver a iniciar

### La página no carga
- Verificar que el build se completó exitosamente
- Revisar los logs en Vercel Dashboard

### No puedo crear usuarios
- Verificar que existe al menos una ciudad en la base de datos
- Verificar que estés autenticado correctamente

## 📊 Crear Datos de Prueba

Una vez que tengas acceso al panel, puedes:

1. **Crear más ciudades** (Settings)
2. **Crear usuarios operadores** (Users)
3. **Registrar vehículos** (Vehicles)
4. **Agregar choferes** (Drivers)
5. **Definir rutas** (Routes)

## 🔐 Seguridad en Producción

**IMPORTANTE**: Antes de usar en producción:

1. ✅ Cambiar el JWT_SECRET por uno seguro único
2. ✅ Usar contraseñas fuertes para usuarios admin
3. ✅ Configurar Network Access en MongoDB solo para IPs de Vercel
4. ✅ Habilitar SSL/TLS en MongoDB
5. ✅ Revisar y actualizar dependencias regularmente
6. ✅ Configurar backups automáticos en MongoDB Atlas

## 📞 Soporte

Si encuentras problemas:

1. Revisar los logs en Vercel Dashboard
2. Verificar la consola del navegador (F12)
3. Revisar que todas las variables de entorno estén configuradas
4. Verificar conectividad con MongoDB Atlas

## 🎉 ¡Listo!

Tu panel AdminTax está ahora desplegado y listo para gestionar tu flota de taxis.

URL de tu aplicación: `https://tu-app.vercel.app`
