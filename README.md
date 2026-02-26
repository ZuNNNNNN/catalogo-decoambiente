# 🏺 Catálogo Deco Ambiente & Hogar

Catálogo digital moderno con panel de administración integrado para gestionar productos.

## ✨ Características

- 🎨 **Diseño Moderno**: Interfaz elegante con animaciones suaves
- 🔥 **Panel Admin**: Sistema completo con autenticación Google
- 📦 **Gestión de Productos**: CRUD completo con Firestore
- 📊 **Importación Excel**: Carga masiva de productos
- 🎯 **React 19**: Últimas características y mejores prácticas
- ⚡ **Vite**: Build rápido y HMR
- 🎭 **Framer Motion**: Animaciones fluidas
- 🔐 **Firebase Auth**: Autenticación segura con Google

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Configurar Firebase (ver instrucciones abajo)
cp .env.local.example .env.local
# Editar .env.local con tus credenciales

# Iniciar servidor de desarrollo
npm run dev
```

## 🔧 Configuración del Panel Admin

**Ver guía completa →** [QUICK_START.md](QUICK_START.md)

**Configuración detallada →** [ADMIN_SETUP.md](ADMIN_SETUP.md)

### Resumen rápido:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita **Authentication** (Google) y **Firestore**
3. Copia tus credenciales a `.env.local`
4. Accede a `/admin` y inicia sesión

## 📁 Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── auth/        # AuthContext, ProtectedRoute
│   ├── layout/      # Layout, Navbar, Footer
│   └── sections/    # Secciones de la página
├── contexts/        # Contextos de React (Auth)
├── hooks/           # Custom hooks
├── pages/           # Páginas principales
│   ├── admin/       # Panel de administración
│   ├── HomePage.tsx
│   └── CatalogoPage.tsx
├── lib/             # Utilidades y configuración
│   └── firebase.ts  # Config de Firebase
├── services/        # Servicios de API (Firestore)
├── styles/          # Estilos globales
└── types/           # Tipos TypeScript
```

## 🛠️ Tecnologías

- **React 19** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Firebase** - Backend (Auth + Firestore)
- **Framer Motion** - Animaciones
- **React Router** - Routing
- **Lucide React** - Iconos
- **XLSX** - Importación de Excel

## 📦 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Linter
```

## 🔐 Panel de Administración

### Rutas:

- `/admin` - Login con Google
- `/admin/dashboard` - Dashboard (requiere autenticación)
  import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
