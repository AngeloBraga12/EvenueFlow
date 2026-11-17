import { Navigate, Route, Routes } from "react-router-dom";
import { AuthPage } from "./features/auth/AuthPage";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { WorkspacePage } from "./features/workspace/WorkspacePage";
import { VenuesPage } from "./features/venues/VenuesPage";
import { VenuePlanPage } from "./features/venues/VenuePlanPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="/entrar" element={<AuthPage mode="login" />} />
      <Route path="/criar-conta" element={<AuthPage mode="signup" />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<WorkspacePage />} />
        <Route path="/app/saloes" element={<VenuesPage />} />
        <Route path="/app/saloes/:venueId/planta" element={<VenuePlanPage />} />
        <Route path="/app/*" element={<WorkspacePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
