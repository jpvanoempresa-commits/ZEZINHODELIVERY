import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import {
  BarChart3,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  customerName: string;
  items: number;
  total: number;
  status: "pending" | "preparing" | "ready" | "delivered";
  time: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  available: boolean;
  orders: number;
}

export default function RestaurantPanelPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "menu">("dashboard");

  const [orders] = useState<Order[]>([
    {
      id: "#12345",
      customerName: "João Silva",
      items: 3,
      total: 98.70,
      status: "preparing",
      time: "14:30",
    },
    {
      id: "#12344",
      customerName: "Maria Santos",
      items: 2,
      total: 65.00,
      status: "ready",
      time: "14:25",
    },
    {
      id: "#12343",
      customerName: "Pedro Costa",
      items: 4,
      total: 125.50,
      status: "pending",
      time: "14:35",
    },
  ]);

  const [menuItems] = useState<MenuItem[]>([
    { id: "1", name: "Pizza Margherita", price: 35.90, available: true, orders: 245 },
    { id: "2", name: "Pizza Pepperoni", price: 38.90, available: true, orders: 312 },
    { id: "3", name: "Refrigerante 2L", price: 8.90, available: false, orders: 156 },
    { id: "4", name: "Brownie", price: 12.90, available: true, orders: 89 },
  ]);

  const stats = {
    totalOrders: 1250,
    todayOrders: 24,
    revenue: 8500.0,
    rating: 4.8,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "preparing":
        return "Preparando";
      case "ready":
        return "Pronto";
      case "delivered":
        return "Entregue";
      default:
        return status;
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    toast.success(`Pedido ${orderId} atualizado para ${newStatus}`);
  };

  const handleToggleItemAvailability = (itemId: string) => {
    toast.success("Disponibilidade do item atualizada");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Pizza Hut</h1>
            <Button
              onClick={() => setLocation("/")}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              Sair
            </Button>
          </div>

          <div className="flex gap-2 border-b border-gray-200">
            {["dashboard", "orders", "menu"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 font-medium transition ${
                  activeTab === tab
                    ? "border-b-2 border-red-600 text-red-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab === "dashboard"
                  ? "Dashboard"
                  : tab === "orders"
                  ? "Pedidos"
                  : "Cardápio"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total de Pedidos</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.totalOrders}
                    </p>
                  </div>
                  <ShoppingBag className="w-12 h-12 text-blue-600 opacity-20" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Pedidos Hoje</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.todayOrders}
                    </p>
                  </div>
                  <Clock className="w-12 h-12 text-orange-600 opacity-20" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Faturamento</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      R${(stats.revenue / 1000).toFixed(1)}k
                    </p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-green-600 opacity-20" />
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
                  <BarChart3 className="w-12 h-12 text-yellow-600 opacity-20" />
                </div>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pedidos Recentes</h2>
              <div className="space-y-3">
                {orders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                    <div>
                      <p className="font-semibold text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">R${order.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-600">{order.items} itens</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Gerenciar Pedidos</h2>
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900">{order.id}</h3>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                    </div>
                    <p className="text-lg font-bold text-red-600">R${order.total.toFixed(2)}</p>
                  </div>

                  <div className="flex gap-2 mb-4">
                    {["pending", "preparing", "ready", "delivered"].map(status => (
                      <Button
                        key={status}
                        size="sm"
                        onClick={() => handleUpdateOrderStatus(order.id, status)}
                        variant={order.status === status ? "default" : "outline"}
                        className={order.status === status ? "bg-red-600 hover:bg-red-700" : ""}
                      >
                        {getStatusLabel(status)}
                      </Button>
                    ))}
                  </div>

                  <p className="text-xs text-gray-600">{order.items} itens • {order.time}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Menu Tab */}
        {activeTab === "menu" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Cardápio</h2>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Item
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map(item => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">R${item.price.toFixed(2)}</p>
                    </div>
                    <p className="text-xs text-gray-600">{item.orders} pedidos</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.available}
                        onChange={() => handleToggleItemAvailability(item.id)}
                        className="w-4 h-4 text-red-600 rounded"
                      />
                      <span className="text-sm text-gray-600">
                        {item.available ? "Disponível" : "Indisponível"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
