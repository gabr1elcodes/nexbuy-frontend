import AuthLayout from "@/components/layout/AuthLayout";
import { Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "@/services/auth/auth.service";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ADIÇÃO DA LÓGICA DE LOADING
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span className="animate-pulse text-gray-500">
          Carregando...
        </span>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await forgotPassword(email);
      toast.success(
        "Se o e-mail estiver cadastrado, você receberá as instruções."
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
        "Não foi possível enviar as instruções."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Esqueceu sua senha?
        </h1>
        <p className="text-gray-500 mt-1">
          Informe seu e-mail para receber as instruções de recuperação.
        </p>
      </div>

      <div className="min-h-[16px] mb-2">
        {error && (
          <p className="text-xs text-red-500">
            {error}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            required
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200
                       focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-gradient-to-r from-orange-400 to-orange-600
                     text-white py-3 rounded-lg font-semibold
                     hover:opacity-90 transition"
        >
          {loading ? "Enviando..." : "Enviar instruções"}
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-6">
        Lembrou a senha?{" "}
        <Link
          to="/login"
          className="text-orange-500 font-medium hover:underline"
        >
          Voltar para login →
        </Link>
      </p>
    </AuthLayout>
  );
}