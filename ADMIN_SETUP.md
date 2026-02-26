# 🔧 Configuración del Panel de Administración

## 📋 Pasos para configurar Firebase

### 1. Crear proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita **Authentication** → **Sign-in method** → **Google**
4. Habilita **Firestore Database** (modo producción o test)
5. Habilita **Storage** (opcional, para imágenes)

### 2. Obtener credenciales

1. En **Project Settings** → **General** → **Your apps**
2. Crea una app web (ícono `</>`)
3. Copia las credenciales de configuración

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...

# Opcional: Lista de emails autorizados (separados por coma)
# Si lo dejas vacío, cualquier usuario autenticado será admin
VITE_ADMIN_EMAILS=
```

### 4. Configurar dominio autorizado en Firebase

1. Ve a **Authentication** → **Settings** → **Authorized domains**
2. Agrega tu dominio local: `localhost`
3. Agrega tu dominio de producción cuando despliegues

### 5. Reiniciar el servidor de desarrollo

```bash
npm run dev
```

## 🚀 Cómo usar el panel

1. Ve a `/admin` en tu navegador
2. Haz clic en "Iniciar sesión con Google"
3. Serás redirigido a Google para autenticarte
4. Después de autenticarte, Google te redirigirá de vuelta
5. El dashboard cargará automáticamente los productos de Firestore

## 🐛 Solución de problemas comunes

### "Firebase: Error (auth/unauthorized-domain)"

**Solución:** Agrega tu dominio en Firebase Console → Authentication → Settings → Authorized domains

### "Missing or insufficient permissions"

**Solución:** Revisa las reglas de Firestore. Para desarrollo puedes usar:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### No se cargan los productos

**Solución:**

1. Verifica que Firestore esté habilitado
2. Verifica que exista la colección `products` en Firestore
3. Abre las DevTools Console para ver logs detallados

### El login no funciona

**Solución:**

1. Verifica que las variables de entorno estén correctas
2. Verifica que Google Sign-In esté habilitado en Firebase Console
3. Asegúrate de que tu dominio esté en la lista de dominios autorizados

## 📦 Estructura de datos en Firestore

Colección: `products`

```typescript
{
  name: string;           // "Sofá Colonial"
  category: string;       // "living"
  price: number;          // 25000
  description: string;    // "Descripción..."
  emoji: string;          // "🛋️"
  featured: boolean;      // true/false
  tags: string[];         // ["madera", "artesanal"]
  stock: number;          // 5
  sku: string;            // "SOF-001"
}
```

## 📝 Logs útiles

El sistema incluye logs detallados en la consola:

- 🚀 Iniciando login
- ✅ Login exitoso
- 🔄 Auth state cambió
- 📦 Cargando productos
- ❌ Errores

Abre las DevTools (F12) para ver los logs.

## 🔒 Seguridad

Para producción, configura `VITE_ADMIN_EMAILS` con los emails autorizados:

```env
VITE_ADMIN_EMAILS=admin@example.com,usuario@example.com
```

Solo estos usuarios podrán acceder al panel de administración.
