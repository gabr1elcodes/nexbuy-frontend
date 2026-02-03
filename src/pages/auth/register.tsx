import AuthLayout from "@/components/layout/AuthLayout";
import { Mail, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { register as registerService } from "@/services/auth/auth.service";
import axios from "axios";

import {
  toastLoading,
  toastUpdateSuccess,
  toastUpdateError,
} from "@/utils/toast";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span className="animate-pulse text-gray-500">
          Carregando...
        </span>
      </div>
    );
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const toastId = toastLoading("Criando sua conta...");

    try {
      await registerService({ name, email, password });

      toastUpdateSuccess(toastId, "Conta criada com sucesso!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err)
          ? err.response?.data?.message ?? "Não foi possível criar a conta"
          : err instanceof Error
            ? err.message
            : "Não foi possível criar a conta";

      setError(message);
      toastUpdateError(toastId, message);
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-4 mt-4">
        <h1 className="text-3xl font-bold text-gray-800">Crie sua conta</h1>
        <p className="text-gray-500 mt-1">Preencha os dados para começar.</p>
      </div>

      <div className="min-h-[16px] mb-2">
        {error && (
          <p className="text-xs text-red-500">
            {error}
          </p>
        )}
      </div>

      <form className="flex flex-col gap-4 max-w-md" onSubmit={handleRegister}>
        <div className="relative">
          <User
            className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200
                       focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
        </div>

        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500"
            size={18}
          />
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200
                       focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
        </div>

        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500"
            size={18}
          />
          <input
            type="password"
            placeholder="Crie uma senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200
                       focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-gradient-to-r from-orange-400 to-orange-600
                     text-white py-3 rounded-lg font-semibold
                     hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-8">
        Já tem uma conta?{" "}
        <Link
          to="/login"
          className="text-orange-500 font-medium hover:underline"
        >
          Faça login
        </Link>
      </p>
    </AuthLayout>
  );
}
