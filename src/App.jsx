import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import TentangPage from "./pages/TentangPage";
import KontakPage from "./pages/KontakPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />\
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
