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
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_EMAILS = import.meta.env.VITE_ADMIN_EMAILS?.split(",") || [];
const USER_STORAGE_KEY = "decoambiente_admin_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userToStore = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userToStore));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error.code === "auth/popup-blocked") {
        alert(
          "El popup fue bloqueado. Por favor, permite popups para este sitio.",
        );
      } else if (
        error.code === "auth/cancelled-popup-request" ||
        error.code === "auth/popup-closed-by-user"
      ) {
        // Usuario cerró el popup, no hacer nada
      } else {
        console.error("Error al iniciar sesión:", error);
        alert(`Error al iniciar sesión: ${error.message}`);
      }
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const isAdmin =
    user !== null &&
    (ADMIN_EMAILS.length === 0 || ADMIN_EMAILS.includes(user.email || ""));

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
