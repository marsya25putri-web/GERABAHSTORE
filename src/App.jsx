import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CategoriesPage from "./pages/CategoriesPage";
import ProtectedRoute from "./components/ProtectedRoute";
import TentangPage from "./pages/TentangPage";
import KontakPage from "./pages/KontakPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <CategoriesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/categories/:id"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tentang"
        element={
          <ProtectedRoute>
            <TentangPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/kontak"
        element={
          <ProtectedRoute>
            <KontakPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;