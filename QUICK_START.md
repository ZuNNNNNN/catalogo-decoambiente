# 🚀 Inicio Rápido - Panel de Administración

## ⚡ Configuración en 3 pasos

### Paso 1: Configurar Firebase

1. Abre `.env.local` en la raíz del proyecto
2. Completa con tus credenciales de Firebase (ver [ADMIN_SETUP.md](ADMIN_SETUP.md) para detalles)

```env
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
VITE_FIREBASE_APP_ID=tu-app-id
VITE_ADMIN_EMAILS=
```

### Paso 2: Iniciar servidor

```bash
npm run dev
```

### Paso 3: Acceder al panel

1. Ve a: `http://localhost:5173/admin`
2. Haz clic en "Iniciar sesión con Google"
3. Serás redirigido a Google para autenticarte
4. Después de autenticarte, volverás automáticamente al dashboard

---

## 📦 Agregar productos de prueba

Una vez dentro del dashboard:

1. Abre las **DevTools** (F12)
2. Ve a la pestaña **Console**
3. Ejecuta este comando:

```javascript
// Importar las funciones de ayuda
const { agregarProductosPrueba } =
  await import("/src/utils/firestore-helpers.ts");

// Agregar 5 productos de ejemplo
await agregarProductosPrueba();
```

4. Recarga la página (`Ctrl+R` o `F5`)
5. ¡Deberías ver los productos! 🎉

---

## 🐛 ¿Problemas?

### El botón de login no hace nada

**Solución:** Abre la consola (F12) y busca logs con emojis:

- 🚀 = Intento de login iniciado
- ❌ = Error (lee el mensaje)
- ✅ = Login exitoso

### "Firebase: Error (auth/unauthorized-domain)"

**Solución:** En Firebase Console:

1. Ve a **Authentication** → **Settings**
2. En **Authorized domains** agrega: `localhost`

### No se cargan los productos

**Verificar:**

1. ¿Existen productos en Firestore? (usa el comando de arriba para agregar ejemplos)
2. ¿Está habilitado Firestore en Firebase Console?
3. ¿Las reglas de Firestore permiten lectura?

**Reglas de Firestore recomendadas para desarrollo:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;  // Cualquiera puede leer
      allow write: if request.auth != null;  // Solo usuarios autenticados pueden escribir
    }
  }
}
```

---

## 📋 Logs útiles

El sistema muestra logs detallados en la consola:

| Emoji | Significado                      |
| ----- | -------------------------------- |
| 🚀    | Iniciando proceso (login, carga) |
| ✅    | Operación exitosa                |
| ❌    | Error                            |
| 🔄    | Estado cambió                    |
| 📦    | Cargando datos                   |
| 👋    | Logout                           |

---

## 🎯 Próximos pasos

Una vez que funcione el login y veas los productos:

1. Puedes usar el dashboard completo en `AdminDashboardPage.tsx`
2. Agrega más funciones (crear, editar, eliminar productos)
3. Importa productos desde Excel
4. Configura emails de administradores en `VITE_ADMIN_EMAILS`

---

## 💡 Tips

- **Modo desarrollo**: Deja `VITE_ADMIN_EMAILS` vacío para permitir cualquier usuario
- **Modo producción**: Agrega emails específicos separados por coma
- **Ver datos en Firestore**: Firebase Console → Firestore Database
- **Limpiar productos**: Usa la función `limpiarProductos()` en la consola

---

¿Necesitas ayuda? Revisa [ADMIN_SETUP.md](ADMIN_SETUP.md) para más detalles.
