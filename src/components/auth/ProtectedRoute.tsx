/**
 * Componente para proteger rutas de administración
 * React 19: UI declarativa con estados claros
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isAdmin, isInitialized } = useAuth();

  // Mostrar loader mientras se inicializa la autenticación
  if (!isInitialized) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          color: "#C9956B",
        }}
      >
        <Loader2
          size={36}
          style={{ animation: "spin 0.75s linear infinite" }}
        />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Redirección simple y directa si no está autenticado o no es admin
  if (!user || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};
