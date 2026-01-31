import AuthLayout from "@/components/layout/AuthLayout";
import { Mail, Lock, UserCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.post(`${API_URL}/auth/google`, {
          token: tokenResponse.access_token,
        });

        signInWithGoogle(response.data);
        toast.success("Login realizado com sucesso!");
        navigate("/dashboard");
      } catch {
        toast.error("Erro ao autenticar com Google");
      }
    },
    onError: () => toast.error("Falha no login com Google"),
  });

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span className="animate-pulse text-gray-500">
          Carregando...
        </span>
      </div>
    );
  }

  async function handleVisitorLogin() {
    setLoading(true);
    const toastId = toast.loading("Acessando como visitante...");
    try {
      await signIn("visitante@nexbuy.com", "visitante123");
      localStorage.setItem("@nexbuy:userEmail", "visitante@nexbuy.com");
      toast.success("Bem-vindo! Modo demonstração.", { id: toastId });
      navigate("/dashboard");
    } catch {
      toast.error("Erro ao acessar modo visitante", { id: toastId });
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const toastId = toast.loading("Entrando...");

    try {
      await signIn(email, password);
      localStorage.setItem("@nexbuy:userEmail", email);
      toast.success("Login realizado com sucesso!", { id: toastId });
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? "E-mail ou senha inválidos"
        : "Erro ao entrar";

      setError(message);
      toast.error(message, { id: toastId });
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-3 mb-2">
          <img 
            src={`${API_URL}/uploads/footerLogin.PNG`} 
            alt="NexBuy" 
            className="w-10 h-10 object-contain" 
          />
          <span className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Nex<span className="text-orange-500">Buy</span>
          </span>
        </div>

        <p className="text-base text-gray-500 mb-8 ml-1">
          Entre com sua conta para continuar.
        </p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-6 rounded-r-lg">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 pl-12 pr-4 rounded-2xl border border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-50 outline-none transition-all bg-gray-50/50 focus:bg-white"
            />
          </div>

          <div className="group relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 pl-12 pr-4 rounded-2xl border border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-50 outline-none transition-all bg-gray-50/50 focus:bg-white"
            />
          </div>

          <div className="flex justify-end px-1">
            <Link to="/forgot-password" className="text-sm font-medium text-gray-400 hover:text-orange-600 transition-colors">
              Esqueceu sua senha?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl font-bold text-lg text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Processando..." : "Entrar"}
          </button>
        </form>
        <div className="mt-6 space-y-4">
          <button
            onClick={() => googleLogin()}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl border border-gray-200 font-medium hover:bg-gray-50 transition-all"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Entrar com Google
          </button>

          <button
            onClick={handleVisitorLogin}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl border border-gray-200 font-medium hover:bg-gray-50 transition-all text-gray-600"
          >
            <UserCheck size={20} />
            Acessar como Visitante
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
