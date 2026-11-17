import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
export function ProtectedRoute(){const {user,loading}=useAuth();const location=useLocation();if(loading)return <div className="screen-loader" role="status">Verificando sessão…</div>;if(!user)return <Navigate to="/entrar" replace state={{from:location}}/>;return <Outlet/>;}