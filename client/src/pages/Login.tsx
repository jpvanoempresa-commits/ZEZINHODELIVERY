import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Chrome } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Login() {
  const [, setLocation] = useLocation();
  const [loginMethod, setLoginMethod] = useState<"email" | "phone" | "google">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha email e senha");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implementar login com email/senha via tRPC
      toast.success("Login realizado com sucesso!");
      setLocation("/");
    } catch (error) {
      toast.error("Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast.error("Digite seu telefone");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implementar login com telefone via tRPC
      toast.success("Código enviado para seu telefone!");
    } catch (error) {
      toast.error("Erro ao enviar código");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implementar login com Google OAuth
    window.location.href = "/api/oauth/google";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/manus-storage/WhatsAppImage2026-05-20at18.45.46_e16157f8.jpeg" alt="Zezinho" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-amber-600">Zezinho Delivery</h1>
          <p className="text-gray-600 mt-2">Entrar na sua conta</p>
        </div>

        {/* Login Method Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setLoginMethod("email")}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              loginMethod === "email"
                ? "text-amber-600 border-b-2 border-amber-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </button>
          <button
            onClick={() => setLoginMethod("phone")}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              loginMethod === "phone"
                ? "text-amber-600 border-b-2 border-amber-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Phone className="w-4 h-4 inline mr-2" />
            Telefone
          </button>
        </div>

        {/* Email Login Form */}
        {loginMethod === "email" && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        )}

        {/* Phone Login Form */}
        {loginMethod === "phone" && (
          <form onSubmit={handlePhoneLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
              <Input
                type="tel"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar Código"}
            </Button>
          </form>
        )}

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">ou</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google Login Button */}
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          className="w-full"
        >
          <Chrome className="w-4 h-4 mr-2" />
          Entrar com Google
        </Button>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Não tem conta?{" "}
          <button
            onClick={() => setLocation("/register")}
            className="text-amber-600 font-medium hover:underline"
          >
            Criar conta
          </button>
        </p>

        {/* Forgot Password Link */}
        <p className="text-center text-sm text-gray-600 mt-2">
          <button
            onClick={() => setLocation("/forgot-password")}
            className="text-amber-600 font-medium hover:underline"
          >
            Esqueceu a senha?
          </button>
        </p>
      </Card>
    </div>
  );
}
