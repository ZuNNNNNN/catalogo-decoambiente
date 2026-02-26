import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#f7f4f0",
        }}
      >
        <div
          style={{
            animation: "spin 1s linear infinite",
            width: "32px",
            height: "32px",
            border: "3px solid #e5e5e5",
            borderTopColor: "#5c3d2e",
            borderRadius: "50%",
          }}
        />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  console.log("[PROTECTED] ✅ Acceso permitido al dashboard");
  return <>{children}</>;
};
