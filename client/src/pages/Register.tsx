import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Register() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer" as "customer" | "restaurant" | "delivery",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não correspondem");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Email inválido");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implementar registro via tRPC
      toast.success("Conta criada com sucesso! Faça login para continuar.");
      setLocation("/login");
    } catch (error) {
      toast.error("Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/manus-storage/WhatsAppImage2026-05-20at18.45.46_e16157f8.jpeg" alt="Zezinho" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-amber-600">Zezinho Delivery</h1>
          <p className="text-gray-600 mt-2">Criar nova conta</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
            <Input
              type="text"
              name="name"
              placeholder="Seu nome"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <Input
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
            <Input
              type="tel"
              name="phone"
              placeholder="(11) 99999-9999"
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Conta</label>
            <Select value={formData.role} onValueChange={(value: any) => setFormData((prev) => ({ ...prev, role: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Cliente</SelectItem>
                <SelectItem value="restaurant">Restaurante</SelectItem>
                <SelectItem value="delivery">Entregador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Senha</label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700"
            disabled={isLoading}
          >
            {isLoading ? "Criando conta..." : "Criar Conta"}
          </Button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Já tem conta?{" "}
          <button
            onClick={() => setLocation("/login")}
            className="text-amber-600 font-medium hover:underline"
          >
            Faça login
          </button>
        </p>
      </Card>
    </div>
  );
}
