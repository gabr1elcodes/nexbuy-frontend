import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import AppRoutes from "@/routes";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
export default function App() {
    return (_jsxs(GoogleOAuthProvider, { clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID, children: [_jsx(Toaster, { position: "top-right" }), _jsx(AppRoutes, {})] }));
}
