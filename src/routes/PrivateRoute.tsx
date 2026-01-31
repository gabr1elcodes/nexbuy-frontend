import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";


interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
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

  if (!user) {
    return <Navigate to="/login" replace/>;
  }


  return <>{children}</>;
}
