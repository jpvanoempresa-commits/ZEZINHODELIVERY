import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowLeft, Bell, Trash2, CheckCircle, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "delivery" | "promo" | "info";
  read: boolean;
  createdAt: Date;
}

export default function Notifications() {
  const [, setLocation] = useLocation();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Pedido Confirmado",
      message: "Seu pedido #12345 foi confirmado pelo restaurante",
      type: "order",
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "2",
      title: "Entrega em Andamento",
      message: "Seu pedido saiu para entrega com João Silva",
      type: "delivery",
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: "3",
      title: "Promoção Especial",
      message: "Ganhe 20% de desconto em seu próximo pedido!",
      type: "promo",
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60),
    },
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case "delivery":
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case "promo":
        return <Bell className="w-5 h-5 text-green-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "order":
        return "Pedido";
      case "delivery":
        return "Entrega";
      case "promo":
        return "Promoção";
      default:
        return "Informação";
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success("Notificação removida");
  };

  const handleDeleteAll = () => {
    setNotifications([]);
    toast.success("Todas as notificações foram removidas");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
          <h1 className="text-2xl font-bold text-gray-900">Notificações</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Info Bar */}
        {unreadCount > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <p className="text-blue-900">
              Você tem <strong>{unreadCount}</strong> notificação{unreadCount !== 1 ? "s" : ""} não lida{unreadCount !== 1 ? "s" : ""}
            </p>
            <Button
              size="sm"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Marcar todas como lidas
            </Button>
          </div>
        )}

        {/* Notifications List */}
        <div className="max-w-2xl mx-auto space-y-4 mb-8">
          {notifications.length === 0 ? (
            <Card className="p-12 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma notificação</h3>
              <p className="text-gray-600">Você está em dia com todas as notificações</p>
            </Card>
          ) : (
            notifications.map(notification => (
              <Card
                key={notification.id}
                className={`p-4 cursor-pointer transition hover:shadow-md ${
                  !notification.read ? "bg-blue-50 border-blue-200" : ""
                }`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {getTypeLabel(notification.type)}
                      </span>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-red-600 rounded-full" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-500">
                      {notification.createdAt.toLocaleDateString("pt-BR")} às{" "}
                      {notification.createdAt.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification.id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <Button
              onClick={handleDeleteAll}
              variant="outline"
              className="w-full border-red-600 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar todas as notificações
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
