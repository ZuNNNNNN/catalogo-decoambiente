# 🚀 Despliegue a GitHub Pages

Esta guía explica cómo desplegar el catálogo de Deco Ambiente a GitHub Pages usando GitHub Actions.

## 📋 Requisitos Previos

1. Repositorio GitHub configurado
2. Credenciales de Firebase
3. Acceso de administrador al repositorio

## 🔐 Paso 1: Configurar Secrets en GitHub

Ve a tu repositorio en GitHub: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

Crea los siguientes secrets con los valores de tu archivo `.env`:

| Secret Name | Valor |
|-------------|-------|
| `VITE_FIREBASE_API_KEY` | Tu API Key de Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | `tu-proyecto.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | ID de tu proyecto Firebase |
| `VITE_FIREBASE_STORAGE_BUCKET` | `tu-proyecto.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID de Firebase |
| `VITE_FIREBASE_APP_ID` | App ID de Firebase |
| `VITE_FIREBASE_MEASUREMENT_ID` | (Opcional) Measurement ID |
| `VITE_ADMIN_EMAILS` | Emails separados por coma |

### 📸 Ejemplo Visual:

```
Repository → Settings → Secrets and variables → Actions

Name: VITE_FIREBASE_API_KEY
Value: AIzaSyATu2ttWWPiWBfEj_nmbgaPEu3s7Y4v4gI
[Add secret]
```

## ⚙️ Paso 2: Habilitar GitHub Pages

1. Ve a `Settings` → `Pages`
2. En **Source**, selecciona: `GitHub Actions`
3. Guarda los cambios

## 🏗️ Paso 3: Ejecutar el Deployment

El workflow se ejecutará automáticamente cuando:
- Hagas push a la rama `main`
- Ejecutes manualmente desde `Actions` → `Deploy to GitHub Pages` → `Run workflow`

### Verificar el despliegue:

1. Ve a la pestaña `Actions` en GitHub
2. Verás el workflow `Deploy to GitHub Pages` ejecutándose
3. Una vez completado (✅ verde), tu sitio estará disponible en:
   ```
   https://ZuNNNNNN.github.io/catalogo-decoambiente/
   ```

## 🔍 Monitoreo y Logs

- **Ver logs del build:** `Actions` → Click en el workflow → Click en el job
- **Tiempo estimado:** 2-3 minutos por deployment
- **Error común:** Secrets mal configurados → Revisa los valores en Settings

## 🛠️ Comandos Útiles

### Build local para probar:
```bash
npm run build
npm run preview
```

### Desplegar manualmente:
1. Ve a `Actions`
2. Selecciona `Deploy to GitHub Pages` 
3. Click en `Run workflow`
4. Selecciona `main` branch
5. Click en `Run workflow` verde

## 📦 Estructura del Workflow

El workflow (`deploy.yml`) realiza:

1. **Checkout** del código
2. **Setup** de Node.js 20
3. **Install** dependencias (npm ci)
4. **Build** con variables de entorno desde secrets
5. **Configure** GitHub Pages
6. **Upload** del artifact (carpeta dist/)
7. **Deploy** a GitHub Pages

## 🔧 Troubleshooting

### Error: "Module not found"
- Verifica que todas las dependencias estén en `package.json`
- Ejecuta `npm ci` localmente

### Error: "Environment variable undefined"
- Revisa que todos los secrets estén configurados en GitHub
- Los nombres deben coincidir exactamente (case-sensitive)

### Error: 404 al navegar en el sitio
- GitHub Pages necesita configurar rutas correctamente
- Asegúrate de que `base` en `vite.config.ts` esté correcto
- Para React Router, considera agregar un `404.html` que redirija a `index.html`

### El sitio no se actualiza
- Limpia caché del navegador (Ctrl + Shift + R)
- Espera 1-2 minutos para propagación de CDN

## 🌐 URL del Sitio

Una vez desplegado, tu catálogo estará disponible en:
```
https://zunnnnnn.github.io/catalogo-decoambiente/
```

## 🔄 Actualizaciones Futuras

Cada push a `main` disparará automáticamente un nuevo deployment:
```bash
git add .
git commit -m "feat: actualizar catálogo"
git push origin main
```

## 🎯 Próximos Pasos

1. [ ] Configurar dominio personalizado (opcional)
2. [ ] Agregar analytics con Firebase Analytics
3. [ ] Implementar Service Worker para PWA
4. [ ] Optimizar imágenes con CDN

---

**¿Problemas?** Revisa los logs en la pestaña Actions de GitHub.
