import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import ForgotPassword from "../pages/auth/forgotpassword";
import DashboardHome from "../pages/dashboard/DashboardHome";
import { PrivateRoute } from "./PrivateRoute";
import { AdminRoute } from "./AdminRoute"; // 1. Importe o novo guarda
import Products from '../services/products/Products';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Se a página 'Products' for o seu CRUD/Marketplace que só Admin mexe, 
           ela PRECISA estar dentro do AdminRoute.
        */}
        <Route 
          path="/products" 
          element={
            <AdminRoute>
              <Products />
            </AdminRoute>
          } 
        />

        {/* Dashboard para qualquer logado */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardHome />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}