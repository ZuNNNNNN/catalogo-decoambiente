# 🔥 Configuración de Firebase - Paso a Paso

## ❌ Si ves estos errores:

- "auth/unauthorized-domain" → Falta agregar tu dominio
- "auth/configuration-not-found" → Falta configurar .env.local
- El botón no hace nada → Revisa la consola del navegador (F12)

## ✅ Pasos para Configurar Firebase

### Paso 1: Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en **"Agregar proyecto"** o **"Add project"**
3. Nombre del proyecto: `decoambiente` (o el que prefieras)
4. Desactiva Google Analytics (opcional, puedes activarlo después)
5. Click en **"Crear proyecto"**

---

### Paso 2: Configurar Authentication (Google Sign-In)

1. En el menú lateral → **Authentication** (Autenticación)
2. Click en **"Get started"** o **"Comenzar"**
3. Ve a la pestaña **"Sign-in method"** (Método de inicio de sesión)
4. Click en **"Google"**
5. Activa el switch **"Enable"** (Habilitar)
6. Selecciona un email de soporte (tu email)
7. Click en **"Save"** (Guardar)

---

### Paso 3: Agregar Dominios Autorizados

**🚨 IMPORTANTE: Sin esto, el login NO funcionará**

1. En **Authentication** → Click en **"Settings"** (⚙️ arriba a la derecha)
2. Ve a la pestaña **"Authorized domains"** (Dominios autorizados)
3. Click en **"Add domain"** (Agregar dominio)
4. Agrega estos dominios:
   - `localhost` (para desarrollo)
   - `127.0.0.1` (alternativa local)
   - Tu dominio de producción (ej: `miapp.com`) cuando lo despliegues

---

### Paso 4: Configurar Firestore Database

1. En el menú lateral → **Firestore Database**
2. Click en **"Create database"** (Crear base de datos)
3. Selecciona la ubicación más cercana (ej: `southamerica-east1` para Argentina)
4. Elige el modo:
   - **Test mode** (para desarrollo - datos públicos por 30 días)
   - **Production mode** (recomendado - con reglas de seguridad)

#### Reglas de Seguridad Recomendadas

Si elegiste Production mode, ve a la pestaña **"Rules"** y pega esto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura a todos, escritura solo a usuarios autenticados
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Click en **"Publish"** (Publicar)

---

### Paso 5: Obtener Credenciales de Firebase

1. En el menú lateral → **⚙️ Project Settings** (Configuración del proyecto)
2. Scroll hacia abajo hasta **"Your apps"** (Tus aplicaciones)
3. Si no ves ninguna app, click en el ícono **`</>`** (Web)
4. Nombre de la app: `catalogo-web`
5. NO marques Firebase Hosting por ahora
6. Click en **"Register app"** (Registrar app)
7. Verás un código similar a esto:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123...",
};
```

---

### Paso 6: Configurar Variables de Entorno

1. Abre el archivo `.env.local` en la raíz de tu proyecto
2. Reemplaza con tus credenciales:

```env
VITE_FIREBASE_API_KEY=AIzaSyB...
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...

# Opcional: Emails autorizados (separa con comas, sin espacios)
# Déjalo vacío para modo desarrollo (cualquier usuario puede entrar)
VITE_ADMIN_EMAILS=
```

3. **Guarda el archivo**

---

### Paso 7: Reiniciar el Servidor

```bash
# Detén el servidor (Ctrl+C)
# Reinicia
npm run dev
```

**⚠️ IMPORTANTE**: Vite solo lee las variables de entorno al iniciar. Si cambias `.env.local`, debes reiniciar el servidor.

---

### Paso 8: Probar el Login

1. Abre `http://localhost:5173/admin`
2. Abre la consola del navegador (F12 → Console)
3. Click en **"Iniciar sesión con Google"**
4. Deberías ver en la consola:
   ```
   🚀 Iniciando login con Google...
   🌐 authDomain: tu-proyecto.firebaseapp.com
   ✓ Redirect iniciado - serás redirigido a Google...
   ```
5. Serás redirigido a Google
6. Selecciona tu cuenta
7. Google te redirige de vuelta
8. En la consola deberías ver:
   ```
   ✅ Login exitoso desde redirect: tu-email@gmail.com
   🔄 Auth state cambió: tu-email@gmail.com
   ```

---

## 🐛 Solución de Problemas

### El botón no hace nada

1. Abre la consola (F12)
2. Busca mensajes de error
3. Verifica que `.env.local` tenga todas las variables
4. Reinicia el servidor

### Error: "auth/unauthorized-domain"

**Solución:**

1. Firebase Console → Authentication → Settings
2. Authorized domains → Add domain
3. Agrega `localhost`

### Error: "auth/configuration-not-found"

**Solución:**

1. Verifica que `.env.local` exista en la raíz del proyecto
2. Verifica que las variables comiencen con `VITE_`
3. Reinicia el servidor

### Me redirige pero vuelve al login

**Posibles causas:**

1. No configuraste `VITE_ADMIN_EMAILS` y tu email no está en la lista
2. Verifica en la consola los logs de `ProtectedRoute`
3. Si dice "Usuario no es admin", agrega tu email a `VITE_ADMIN_EMAILS` o déjalo vacío

---

## 📋 Checklist de Configuración

- [ ] Proyecto creado en Firebase Console
- [ ] Authentication → Google Sign-In habilitado
- [ ] Dominios autorizados: `localhost` agregado
- [ ] Firestore Database creado con reglas
- [ ] Credenciales copiadas a `.env.local`
- [ ] Servidor reiniciado después de configurar `.env.local`
- [ ] Consola del navegador abierta para ver logs

---

## 🎯 Próximos Pasos

Una vez que el login funcione:

1. Agrega productos de prueba (ver [QUICK_START.md](QUICK_START.md))
2. Configura emails de administradores en `VITE_ADMIN_EMAILS`
3. Configura reglas de Firestore más restrictivas para producción

---

## 📞 ¿Necesitas Ayuda?

Si sigues teniendo problemas:

1. Revisa **todos** los logs en la consola (F12)
2. Verifica que Firebase Console muestre tu proyecto correctamente
3. Verifica que Authentication → Google esté habilitado ✅
4. Verifica que `localhost` esté en dominios autorizados

Los logs te dirán exactamente qué está fallando. Busca emojis:

- 🚀 = Proceso iniciado
- ✅ = Éxito
- ❌ = Error (lee el mensaje completo)
- 🚨 = Solución sugerida
