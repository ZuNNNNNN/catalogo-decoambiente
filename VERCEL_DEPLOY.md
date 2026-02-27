# 🚀 Deploy a Vercel - Guía Rápida

## ✅ Preparación Completada

- ✅ `vercel.json` configurado
- ✅ `vite.config.ts` actualizado (base: "/")
- ✅ `index.html` limpio
- ✅ Build exitoso (`dist/` listo)
- ✅ Vercel CLI instalado

## 📝 Pasos para Deployar

### 1. Login en Vercel

Ejecuta en la terminal:

```bash
vercel login
```

Opciones:

- **Email:** Ingresa tu email y confirma en el correo
- **GitHub:** Se abrirá el navegador para autorizar
- **GitLab/Bitbucket:** Similar a GitHub

### 2. Deploy a Producción

Una vez logueado, ejecuta:

```bash
vercel --prod
```

Vercel te preguntará:

```
? Set up and deploy "catalogo-decoambiente"? (Y/n)
```

Responde: **Y**

```
? Which scope do you want to deploy to?
```

Selecciona tu cuenta personal

```
? Link to existing project? (y/N)
```

Responde: **N** (es la primera vez)

```
? What's your project's name?
```

Presiona Enter para usar: `catalogo-decoambiente`

```
? In which directory is your code located?
```

Presiona Enter (usará `./`)

### 3. Configurar Variables de Entorno (IMPORTANTE)

Después del primer deploy, necesitas agregar las variables de Firebase:

**Opción A: Dashboard de Vercel (Recomendado)**

1. Ve a: https://vercel.com/dashboard
2. Click en tu proyecto `catalogo-decoambiente`
3. Settings → Environment Variables
4. Agrega cada variable:

| Variable Name                       | Value                                       |
| ----------------------------------- | ------------------------------------------- |
| `VITE_FIREBASE_API_KEY`             | `AIzaSyATu2ttWWPiWBfEj_nmbgaPEu3s7Y4v4gI`   |
| `VITE_FIREBASE_AUTH_DOMAIN`         | `decoambiente-5a31d.firebaseapp.com`        |
| `VITE_FIREBASE_PROJECT_ID`          | `decoambiente-5a31d`                        |
| `VITE_FIREBASE_STORAGE_BUCKET`      | `decoambiente-5a31d.firebasestorage.app`    |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `266687365174`                              |
| `VITE_FIREBASE_APP_ID`              | `1:266687365174:web:51f2a2335e13a5ca2f5897` |
| `VITE_FIREBASE_MEASUREMENT_ID`      | `G-LL4V5SHQRB`                              |
| `VITE_ADMIN_EMAILS`                 | `cristian.bulla02@gmail.com`                |

5. Click en "Save"

**Opción B: CLI (Más rápido)**

```bash
vercel env add VITE_FIREBASE_API_KEY
# Pega el valor cuando te lo pida
# Repite para cada variable
```

### 4. Redeploy con Variables

Después de agregar las variables, redeploy:

```bash
vercel --prod
```

## 🌐 URL de tu Sitio

Vercel te dará una URL como:

```
https://catalogo-decoambiente.vercel.app
```

O puedes usar un dominio personalizado gratis:

```
https://tu-proyecto-nombre.vercel.app
```

## 🔄 Actualizaciones Futuras

Para actualizar el sitio:

```bash
npm run build
vercel --prod
```

O conecta el repo de GitHub para auto-deploy en cada push.

## ⚡ Configuración Automática (Opcional)

Para que Vercel haga auto-deploy cuando hagas push a GitHub:

1. Dashboard → Settings → Git
2. Connect GitHub Repository
3. Selecciona: `ZuNNNNNN/catalogo-decoambiente`
4. Vercel buildeará automáticamente en cada push a `main`

## 🎯 Ventajas de Vercel

✅ Deploy en 30 segundos  
✅ HTTPS gratis automático  
✅ CDN global  
✅ No requiere configuración especial  
✅ Preview deployments en cada PR  
✅ Analytics gratis  
✅ Rollback con un click

## 🐛 Troubleshooting

### Error: "Missing Environment Variables"

- Agrega las variables en Dashboard → Settings → Environment Variables
- Redeploy con `vercel --prod`

### El sitio no carga Firebase

- Verifica que todas las variables empiecen con `VITE_`
- Revisa la consola del navegador (F12)

### 404 en rutas

- Ya está configurado en `vercel.json` con rewrites
- Si persiste, verifica que el archivo esté commiteado

---

**Next:** Ejecuta `vercel login` y luego `vercel --prod`
