import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Mail, Phone, MapPin, Edit2, Save, X, LogOut, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ProfileCustomer() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      setLocation("/");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    toast.success("Perfil atualizado com sucesso!");
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">Você precisa estar logado para acessar esta página</p>
          <Button onClick={() => setLocation("/login")} className="bg-red-600 hover:bg-red-700">
            Ir para Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center text-red-600 hover:text-red-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Card */}
        <Card className="max-w-2xl mx-auto p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {isEditing ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Edit2 className="w-5 h-5 text-red-600" />
              )}
            </button>
          </div>

          {/* Info Grid */}
          <div className="space-y-4 mb-8">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 mr-2 text-red-600" />
                Email
              </label>
              {isEditing ? (
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full"
                />
              ) : (
                <p className="text-gray-900">{user.email}</p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 mr-2 text-red-600" />
                Telefone
              </label>
              {isEditing ? (
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  className="w-full"
                />
              ) : (
                <p className="text-gray-900">{user.phone || "Não informado"}</p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2 text-red-600" />
                Endereço
              </label>
              {isEditing ? (
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Rua, número"
                  className="w-full"
                />
              ) : (
                <p className="text-gray-900">{formData.address || "Não informado"}</p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2 text-red-600" />
                Cidade
              </label>
              {isEditing ? (
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Sua cidade"
                  className="w-full"
                />
              ) : (
                <p className="text-gray-900">{formData.city || "Não informado"}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            {isEditing && (
              <Button
                onClick={handleSave}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair da Conta
            </Button>
          </div>
        </Card>

        {/* Additional Info */}
        <Card className="max-w-2xl mx-auto p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Informações da Conta</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Membro desde:</span>
              <span className="font-medium text-gray-900">
                {new Date(user.createdAt).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Último acesso:</span>
              <span className="font-medium text-gray-900">
                {new Date(user.lastSignedIn).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tipo de conta:</span>
              <span className="font-medium text-gray-900 capitalize">{user.role}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
