import AuthLayout from "@/components/layout/AuthLayout";
import { Mail, Lock, UserCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";

import {
  toastSuccess,
  toastError,
  toastLoading,
  toastUpdateSuccess,
  toastUpdateError,
} from "@/utils/toast";

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

        if (response.data.token) {
          signInWithGoogle(response.data);
          toastSuccess("Login realizado com sucesso!");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Erro 401:", error);
        toastError("Erro de autenticação no servidor");
      }
    },
    onError: () => toastError("Falha no login com Google"),
  });

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span className="animate-pulse text-gray-500">Carregando...</span>
      </div>
    );
  }

  async function handleVisitorLogin() {
    setLoading(true);
    const toastId = toastLoading("Acessando como visitante...");

    try {
      await signIn("visitante@nexbuy.com", "visitante123");
      localStorage.setItem("@nexbuy:userEmail", "visitante@nexbuy.com");

      toastUpdateSuccess(toastId, "Bem-vindo! Modo demonstração.");
      navigate("/dashboard");
    } catch {
      toastUpdateError(toastId, "Erro ao acessar modo visitante");
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const toastId = toastLoading("Entrando...");

    try {
      await signIn(email, password);
      localStorage.setItem("@nexbuy:userEmail", email);

      toastUpdateSuccess(toastId, "Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? "E-mail ou senha inválidos"
        : "Erro ao entrar";

      setError(message);
      toastUpdateError(toastId, message);
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-3 mb-2">
          <img
            src="/logo-nexbuy.png"
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
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
            />
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
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
            />
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
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-gray-400 hover:text-orange-600 transition-colors"
            >
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

        <div className="mt-6 flex flex-row gap-4">
          <div className="w-1/2">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const response = await axios.post(`${API_URL}/auth/google`, {
                    token: credentialResponse.credential,
                  });

                  if (response.data.token) {
                    signInWithGoogle(response.data);
                    toastSuccess("Login realizado com sucesso!");
                    navigate("/dashboard");
                  }
                } catch (error) {
                  console.error("Erro detalhado:", error);
                  toastError(
                    "Erro ao autenticar no servidor. Verifique o Secret no Render."
                  );
                }
              }}
              onError={() => toastError("Falha no login com Google")}
              theme="outline"
              size="large"
              shape="pill"
              width="100%"
            />
          </div>

          <button
            type="button"
            onClick={handleVisitorLogin}
            className="w-1/2 flex items-center justify-center gap-2 h-[40px] rounded-full border border-[#dadce0] bg-white font-medium text-[#3c4043] hover:bg-[#f8f9fa] hover:border-[#d2e3fc] transition-all text-sm"
          >
            <UserCheck size={18} className="text-orange-500" />
            Acessar como Visitante
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Não tem uma conta?{" "}
          <Link
            to="/register"
            className="font-bold text-orange-500 hover:text-orange-600 transition-colors"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
