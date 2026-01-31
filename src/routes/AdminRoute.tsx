import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span className="animate-pulse text-gray-500">
          Carregando...
        </span>
      </div>
    );
  }

  // 1. Não está logado? Login.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Modificado: Permite se for ADMIN ou se for o e-mail do VISITANTE
  const isAuthorized = user.role === 'admin' || user.email === 'visitante@nexbuy.com';

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  // 3. Autorizado? Libera o acesso.
  return <>{children}</>;
}