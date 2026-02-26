# 🚀 Deploy Manual a GitHub Pages (Sin GitHub Actions)

## ⚠️ Alternativa cuando GitHub Actions no está disponible

Esta guía es para deployar manualmente desde tu máquina local usando la rama `gh-pages`.

## 📋 Requisitos

- Node.js instalado
- Git configurado
- Acceso al repositorio GitHub

## 🔧 Configuración Inicial (Solo una vez)

### 1. Verificar que gh-pages está instalado

```bash
npm list gh-pages
```

Si no aparece, instalar:

```bash
npm install --save-dev gh-pages
```

### 2. Verificar variables de entorno

Tu archivo `.env.production` ya tiene las credenciales correctas. Vite las usará automáticamente al hacer `npm run build`.

## 🚀 Deploy (Cada vez que quieras actualizar)

### Opción A: Comando Único (Recomendado)

```bash
npm run deploy
```

Esto hará:

1. Build del proyecto (con variables de `.env.production`)
2. Push de la carpeta `dist/` a la rama `gh-pages`
3. En 1-2 minutos, el sitio se actualizará

### Opción B: Paso a Paso

```bash
# 1. Hacer build
npm run build

# 2. Deployar
npx gh-pages -d dist
```

## 🌐 Configurar GitHub Pages (Solo la primera vez)

1. Ve a tu repositorio: https://github.com/ZuNNNNNN/catalogo-decoambiente
2. Settings → Pages
3. Source: **Deploy from a branch**
4. Branch: **gh-pages** → **/ (root)** → Save

## 🎯 URL del Sitio

Después del primer deploy:

```
https://zunnnnnn.github.io/catalogo-decoambiente/
```

## ⏱️ Tiempo de Espera

- **Build local:** 30-60 segundos
- **Upload a GitHub:** 10-30 segundos
- **Propagación CDN:** 1-2 minutos

**Total:** ~2-3 minutos desde `npm run deploy` hasta ver cambios

## 🔍 Verificar el Deploy

1. Ve a tu repo → **Branches** → Deberías ver la rama `gh-pages`
2. Ve a **Environments** → Verás `github-pages` activo
3. Click en el deployment para ver la URL

## 🐛 Troubleshooting

### Error: "Failed to get remote.origin.url"

```bash
git remote -v
# Deberías ver: origin https://github.com/ZuNNNNNN/catalogo-decoambiente.git

# Si no, agregar:
git remote add origin https://github.com/ZuNNNNNN/catalogo-decoambiente.git
```

### Error: "Permission denied"

```bash
# Verificar autenticación
git config --global credential.helper manager
```

### El sitio muestra errores 404

- Verifica que el `base` en `vite.config.ts` sea: `/catalogo-decoambiente/`
- Limpia caché del navegador (Ctrl + Shift + R)

### Variables de entorno no cargan

- Verifica que `.env.production` existe en la raíz
- Los nombres deben empezar con `VITE_`
- Hacer build limpio: `rm -rf dist && npm run build`

## 📝 Workflow Recomendado

```bash
# 1. Desarrollar localmente
npm run dev

# 2. Probar el build
npm run build
npm run preview

# 3. Commitear cambios a main
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main

# 4. Deployar a GitHub Pages
npm run deploy

# 5. Esperar 2 minutos y visitar el sitio
```

## 🔒 Seguridad

Las credenciales de Firebase en `.env.production` son **públicas por diseño**:

- La seguridad está en las **Firebase Rules** (Firestore/Storage)
- Las API Keys de Firebase se usan en el frontend
- Solo los emails en `VITE_ADMIN_EMAILS` tienen acceso al panel admin

## 🆕 Actualizar el Sitio

```bash
# Hacer cambios en el código...
git add .
git commit -m "update: mensaje"
git push origin main

# Deploy
npm run deploy
```

## 📊 Ventajas de este Método

✅ No depende de GitHub Actions  
✅ Build con tus variables locales  
✅ Control total del proceso  
✅ Más rápido que CI/CD  
✅ Funciona sin permisos de Actions

## 🎨 Personalización

Para cambiar la rama de deploy, editar `package.json`:

```json
"deploy": "gh-pages -d dist -b tu-rama"
```

---

**¿Listo para deployar?** Solo ejecuta: `npm run deploy`
