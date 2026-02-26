import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout/Layout";
import { HomePage } from "@/pages/HomePage";
import { CatalogoPage } from "@/pages/CatalogoPage";
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";
import { AdminDashboardSimple } from "@/pages/admin/AdminDashboardSimple";
import { NosotrosPage } from "@/pages/NosotrosPage";
import { ContactoPage } from "@/pages/ContactoPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ScrollToTop } from "@/components/utils/ScrollToTop";
import { useLenis } from "@/hooks/useLenis";
import "@/styles/global.css";

const AppInner = () => {
  useLenis();
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="catalogo" element={<CatalogoPage />} />
          <Route path="nosotros" element={<NosotrosPage />} />
          <Route path="contacto" element={<ContactoPage />} />
        </Route>
        {/* Rutas admin - React 19 best practice */}
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboardSimple />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
