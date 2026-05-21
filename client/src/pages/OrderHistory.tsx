import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowLeft, MapPin, Clock, DollarSign, Star, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  restaurantName: string;
  items: string[];
  total: number;
  status: "delivered" | "cancelled" | "completed";
  date: Date;
  rating?: number;
}

export default function OrderHistory() {
  const [, setLocation] = useLocation();
  const [orders] = useState<Order[]>([
    {
      id: "#12345",
      restaurantName: "Burger King",
      items: ["Whopper", "Batata Frita", "Refrigerante"],
      total: 45.90,
      status: "delivered",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      rating: 5,
    },
    {
      id: "#12344",
      restaurantName: "Pizza Hut",
      items: ["Pizza Grande", "Refrigerante"],
      total: 65.00,
      status: "delivered",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      rating: 4,
    },
  ]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "delivered":
        return "Entregue";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleReorder = (order: Order) => {
    toast.success(`Pedido de ${order.restaurantName} adicionado ao carrinho!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center text-red-600 hover:text-red-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Histórico de Pedidos</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-4">
          {orders.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-600 mb-4">Você ainda não fez nenhum pedido</p>
              <Button
                onClick={() => setLocation("/")}
                className="bg-red-600 hover:bg-red-700"
              >
                Fazer um Pedido
              </Button>
            </Card>
          ) : (
            orders.map(order => (
              <Card key={order.id} className="p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {order.restaurantName}
                    </h3>
                    <p className="text-sm text-gray-600">{order.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Itens:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {order.items.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-red-600" />
                    {order.date.toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-red-600" />
                    R$ {order.total.toFixed(2)}
                  </div>
                  {order.rating && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-500" />
                      {order.rating}.0
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleReorder(order)}
                    variant="outline"
                    className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Pedir Novamente
                  </Button>
                  <Button
                    onClick={() => setLocation(`/restaurant/${order.id}`)}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Ver Restaurante
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
