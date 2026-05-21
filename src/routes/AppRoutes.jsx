import { Navigate, Route, Routes } from "react-router-dom";
import { useCallback, useState } from "react";
import AppLayout from "../components/AppLayout";
import ClassesPage from "../pages/ClassesPage";
import DashBoard from "../pages/DashBoard";
import LoginPage from "../pages/LoginPage";
import StudentsPage from "../pages/StudentsPage";
import TeachersPage from "../pages/TeachersPage";
import {
  clearAuthSession,
  isAuthSessionActive,
} from "../services/authService";

function ProtectedLayout({ isAuthenticated, onLogout }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout onLogout={onLogout} />;
}

function LoginRoute({ isAuthenticated, onLoginSuccess }) {
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <LoginPage onLoginSuccess={onLoginSuccess} />;
}

function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    isAuthSessionActive(),
  );

  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    clearAuthSession();
    setIsAuthenticated(false);
  }, []);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LoginRoute
            isAuthenticated={isAuthenticated}
            onLoginSuccess={handleLoginSuccess}
          />
        }
      />
      <Route
        element={
          <ProtectedLayout
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
          />
        }
      >
        <Route path="/" element={<DashBoard />} />
        <Route path="/ogrenciler" element={<StudentsPage />} />
        <Route path="/ogretmenler" element={<TeachersPage />} />
        <Route path="/siniflar" element={<ClassesPage />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}

export default AppRoutes;
