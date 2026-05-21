import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import {
  MapPin,
  Navigation,
  CheckCircle,
  Clock,
  DollarSign,
  Phone,
  MessageCircle,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface Delivery {
  id: string;
  restaurant: string;
  customer: string;
  address: string;
  distance: number;
  payment: number;
  status: "available" | "accepted" | "picked" | "delivered";
  time?: string;
}

export default function DeliveryPanelPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"available" | "active" | "history">("available");
  const [acceptedDeliveries, setAcceptedDeliveries] = useState<string[]>([]);

  const [deliveries] = useState<Delivery[]>([
    {
      id: "#12345",
      restaurant: "Pizza Hut",
      customer: "João Silva",
      address: "Rua das Flores, 123 - Centro",
      distance: 2.5,
      payment: 98.70,
      status: "available",
    },
    {
      id: "#12344",
      restaurant: "Burger King",
      customer: "Maria Santos",
      address: "Av. Paulista, 1000 - Bela Vista",
      distance: 3.2,
      payment: 65.00,
      status: "available",
    },
    {
      id: "#12343",
      restaurant: "Sushi Master",
      customer: "Pedro Costa",
      address: "Rua Augusta, 500 - Centro",
      distance: 1.8,
      payment: 125.50,
      status: "available",
    },
  ]);

  const stats = {
    totalDeliveries: 450,
    todayDeliveries: 12,
    earnings: 1850.0,
    rating: 4.9,
  };

  const handleAcceptDelivery = (id: string) => {
    setAcceptedDeliveries([...acceptedDeliveries, id]);
    toast.success("Entrega aceita!");
  };

  const handleCompleteDelivery = (id: string) => {
    toast.success("Entrega concluída!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "picked":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Disponível";
      case "accepted":
        return "Aceita";
      case "picked":
        return "Coletada";
      case "delivered":
        return "Entregue";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Painel do Entregador</h1>
            <Button
              onClick={() => setLocation("/")}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              Sair
            </Button>
          </div>

          <div className="flex gap-2 border-b border-gray-200">
            {["available", "active", "history"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 font-medium transition ${
                  activeTab === tab
                    ? "border-b-2 border-red-600 text-red-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab === "available"
                  ? "Disponíveis"
                  : tab === "active"
                  ? "Ativas"
                  : "Histórico"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total de Entregas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalDeliveries}
                </p>
              </div>
              <Navigation className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Hoje</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.todayDeliveries}
                </p>
              </div>
              <Clock className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Ganhos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  R${(stats.earnings / 1000).toFixed(1)}k
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avaliação</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.rating}⭐
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Available Deliveries */}
        {activeTab === "available" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Entregas Disponíveis</h2>
            {deliveries.map(delivery => (
              <Card key={delivery.id} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600 font-medium">PEDIDO</p>
                    <p className="text-lg font-bold text-gray-900">{delivery.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">RESTAURANTE</p>
                    <p className="text-lg font-bold text-gray-900">{delivery.restaurant}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">CLIENTE</p>
                    <p className="text-lg font-bold text-gray-900">{delivery.customer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">DISTÂNCIA</p>
                    <p className="text-lg font-bold text-gray-900">{delivery.distance} km</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">VALOR</p>
                    <p className="text-lg font-bold text-red-600">
                      R${delivery.payment.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <p className="text-sm text-gray-600">{delivery.address}</p>
                </div>

                <Button
                  onClick={() => handleAcceptDelivery(delivery.id)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  Aceitar Entrega
                </Button>
              </Card>
            ))}
          </div>
        )}

        {/* Active Deliveries */}
        {activeTab === "active" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Entregas Ativas</h2>
            {acceptedDeliveries.length === 0 ? (
              <Card className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Nenhuma entrega ativa</p>
              </Card>
            ) : (
              deliveries
                .filter(d => acceptedDeliveries.includes(d.id))
                .map(delivery => (
                  <Card key={delivery.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900">{delivery.id}</h3>
                        <p className="text-sm text-gray-600">{delivery.restaurant}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor("picked")}`}>
                        Coletada
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <p className="text-sm text-blue-900">{delivery.address}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCompleteDelivery(delivery.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Entregar
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))
            )}
          </div>
        )}

        {/* History */}
        {activeTab === "history" && (
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Histórico de Entregas</h2>
            <div className="space-y-3">
              {deliveries.map(delivery => (
                <div key={delivery.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-semibold text-gray-900">{delivery.id}</p>
                    <p className="text-sm text-gray-600">{delivery.restaurant}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">R${delivery.payment.toFixed(2)}</p>
                    <p className="text-xs text-gray-600">{delivery.distance} km</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor("delivered")}`}>
                    Entregue
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
