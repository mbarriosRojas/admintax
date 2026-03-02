# ⚡ Quick Start Guide - AdminTax

## 🚀 Despliegue Rápido (5 minutos)

### Paso 1: MongoDB Atlas (2 min)
1. Ir a [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Crear cuenta → Crear cluster FREE → Copiar connection string
3. En "Network Access" agregar `0.0.0.0/0`
4. Guardar la cadena: `mongodb+srv://user:pass@cluster.mongodb.net/admintax`

### Paso 2: Desplegar en Vercel (2 min)
1. Ir a [vercel.com](https://vercel.com)
2. "New Project" → Importar repo `admintax`
3. En "Environment Variables" agregar:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/admintax
   JWT_SECRET=mi-secreto-super-seguro-123456789
   ```
4. Click "Deploy" → Esperar ~2 min

### Paso 3: Crear Usuario (1 min)

**Primero crear una ciudad:**
```bash
curl -X POST https://TU-APP.vercel.app/api/cities \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ciudad de México",
    "country": "México",
    "timezone": "America/Mexico_City"
  }'
```

Copiar el `_id` de la respuesta.

**Luego crear usuario admin:**
```bash
curl -X POST https://TU-APP.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@admintax.com",
    "password": "Admin123!",
    "name": "Administrador",
    "role": "admin",
    "cityId": "ID_DE_LA_CIUDAD_AQUI"
  }'
```

### Paso 4: ¡A usar! 🎉

1. Ir a `https://TU-APP.vercel.app`
2. Login:
   - Email: `admin@admintax.com`
   - Password: `Admin123!`

---

## 📱 Uso del Panel

### Dashboard
- Ver KPIs de la flota
- Estadísticas por ciudad

### Crear Vehículos
1. Sidebar → "Vehículos"
2. Click "Nuevo Vehículo"
3. Llenar formulario → "Crear"

### Crear Choferes
1. Sidebar → "Choferes"
2. Click "Nuevo Chofer"
3. Asignar vehículo (opcional)
4. "Crear"

### Crear Rutas
1. Sidebar → "Rutas"
2. Click "Nueva Ruta"
3. Definir origen, destino, distancia

### Gestionar Ciudades
1. Sidebar → "Configuración"
2. Agregar/editar ciudades

### Selector de Ciudad
- En el header puedes cambiar entre ciudades
- Todas las vistas se filtran automáticamente

---

## 🔧 Comandos Útiles

### Desarrollo Local
```bash
npm install        # Instalar dependencias
npm run dev        # Servidor desarrollo (localhost:5173)
npm run build      # Build producción
npm run preview    # Preview del build
```

### Ver Logs en Vercel
1. Dashboard → Proyecto → Functions
2. Ver logs de cada endpoint

---

## 📋 Checklist Post-Despliegue

- [ ] Login funciona
- [ ] Dashboard muestra estadísticas
- [ ] Puedo crear vehículos
- [ ] Puedo crear choferes
- [ ] Puedo crear rutas
- [ ] Selector de ciudad funciona
- [ ] Puedo crear nuevos usuarios

---

## 🆘 Problemas Comunes

**Error: "Cannot connect to database"**
→ Verificar MONGODB_URI en Vercel Environment Variables

**Error: "Invalid token"**
→ Verificar JWT_SECRET configurado, cerrar sesión y reiniciar

**No puedo crear usuarios**
→ Asegúrate de tener al menos una ciudad creada primero

**404 en rutas**
→ Verificar que vercel.json tenga los rewrites correctos

---

## 📚 Más Info

- **README.md** - Documentación completa
- **DEPLOYMENT.md** - Guía detallada de despliegue
- **PROJECT_SUMMARY.md** - Resumen del proyecto

---

## 🎯 Próximos Pasos Recomendados

1. Cambiar contraseña del admin
2. Crear más ciudades según tu operación
3. Agregar usuarios operadores
4. Registrar toda tu flota de vehículos
5. Agregar todos los choferes
6. Definir las rutas operativas
7. Configurar dominio personalizado (opcional)

---

**¡Listo para gestionar tu flota de taxis!** 🚕
