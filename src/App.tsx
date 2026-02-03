import AppRoutes from "@/routes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Toast from "@/components/layout/Toast";

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Toast />
      <AppRoutes />
    </GoogleOAuthProvider>
  );
}