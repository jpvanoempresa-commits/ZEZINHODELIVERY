import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, Lock, Phone, ArrowLeft } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <button 
            onClick={() => setLocation("/")}
            className="flex items-center text-red-600 hover:text-red-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-red-600">Zezinho Delivery</h1>
            <p className="text-gray-600 mt-2">Entre na sua conta</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button className="w-full bg-red-600 hover:bg-red-700">
              Entrar
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              Entrar com Google
            </Button>

            <Button variant="outline" className="w-full">
              <Phone className="w-4 h-4 mr-2" />
              Entrar com Telefone
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Não tem conta?{" "}
              <button
                onClick={() => setLocation("/register")}
                className="text-red-600 font-semibold hover:underline"
              >
                Cadastre-se
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <button className="text-sm text-red-600 hover:underline">
              Esqueceu a senha?
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
