/**
 * Contexto de autenticación Firebase con Google - React 19 best practices
 * Usa useSyncExternalStore para sincronización con store externo
 * Maneja signInWithRedirect para evitar problemas de COOP
 */

/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isInitialized: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// Lista de emails autorizados como admin
const ADMIN_EMAILS = import.meta.env.VITE_ADMIN_EMAILS?.split(",") || [];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Verificar redirect result al montar
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("✅ Login exitoso:", result.user.email);
        }
      })
      .catch((error) => {
        console.error("❌ Error al procesar redirect:", error);
      });

    // Escuchar cambios de autenticación
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("🔄 Auth state cambió:", currentUser?.email || "sin usuario");
      setUser(currentUser);
      setIsInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      console.log("🚀 Iniciando login con Google...");
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      console.log("👋 Logout exitoso");
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
      throw error;
    }
  }, []);

  const isAdmin =
    user !== null &&
    (ADMIN_EMAILS.length === 0 || ADMIN_EMAILS.includes(user.email || ""));

  const value: AuthContextType = {
    user,
    signInWithGoogle,
    logout,
    isAdmin,
    isInitialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
