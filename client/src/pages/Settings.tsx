import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowLeft, Bell, Lock, Eye, MapPin, CreditCard, HelpCircle, LogOut } from "lucide-react";
import { toast } from "sonner";

interface SettingItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

export default function Settings() {
  const [, setLocation] = useLocation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settings: SettingItem[] = [
    {
      id: "notifications",
      title: "Notificações",
      description: notificationsEnabled ? "Ativadas" : "Desativadas",
      icon: <Bell className="w-5 h-5 text-red-600" />,
      action: () => {
        setNotificationsEnabled(!notificationsEnabled);
        toast.success(
          notificationsEnabled ? "Notificações desativadas" : "Notificações ativadas"
        );
      },
    },
    {
      id: "location",
      title: "Localização",
      description: locationEnabled ? "Ativada" : "Desativada",
      icon: <MapPin className="w-5 h-5 text-red-600" />,
      action: () => {
        setLocationEnabled(!locationEnabled);
        toast.success(
          locationEnabled ? "Localização desativada" : "Localização ativada"
        );
      },
    },
    {
      id: "privacy",
      title: "Privacidade",
      description: "Gerenciar dados pessoais",
      icon: <Lock className="w-5 h-5 text-red-600" />,
      action: () => {
        toast.info("Página de privacidade em desenvolvimento");
      },
    },
    {
      id: "payment",
      title: "Métodos de Pagamento",
      description: "Gerenciar cartões e contas",
      icon: <CreditCard className="w-5 h-5 text-red-600" />,
      action: () => {
        toast.info("Página de pagamento em desenvolvimento");
      },
    },
    {
      id: "support",
      title: "Suporte",
      description: "Entrar em contato com a equipe",
      icon: <HelpCircle className="w-5 h-5 text-red-600" />,
      action: () => {
        setLocation("/support");
      },
    },
  ];

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
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Settings List */}
          <div className="space-y-3 mb-8">
            {settings.map(setting => (
              <Card
                key={setting.id}
                className="p-4 hover:shadow-md transition cursor-pointer"
                onClick={setting.action}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {setting.icon}
                    <div>
                      <h3 className="font-semibold text-gray-900">{setting.title}</h3>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Danger Zone */}
          <Card className="p-6 border-red-200 bg-red-50 mb-8">
            <h3 className="text-lg font-bold text-red-900 mb-4">Zona de Perigo</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-red-600 text-red-600 hover:bg-red-100"
              >
                <Eye className="w-4 h-4 mr-2" />
                Alterar Senha
              </Button>
              <Button
                variant="outline"
                className="w-full border-red-600 text-red-600 hover:bg-red-100"
              >
                <Lock className="w-4 h-4 mr-2" />
                Excluir Conta
              </Button>
            </div>
          </Card>

          {/* App Info */}
          <Card className="p-6 text-center text-gray-600">
            <p className="text-sm mb-2">Zezinho Delivery v1.0.0</p>
            <p className="text-xs">© 2026 Todos os direitos reservados</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
