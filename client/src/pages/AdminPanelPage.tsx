import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import {
  Users,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Edit2,
  Trash2,
  Plus,
  Eye,
  Lock,
  Unlock,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  type: "customer" | "restaurant" | "delivery";
  status: "active" | "inactive" | "blocked";
  joinDate: string;
}

interface AdminStats {
  totalUsers: number;
  totalRestaurants: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function AdminPanelPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "restaurants" | "settings">(
    "dashboard"
  );

  const [users] = useState<User[]>([
    {
      id: "1",
      name: "João Silva",
      email: "joao@email.com",
      type: "customer",
      status: "active",
      joinDate: "2026-01-15",
    },
    {
      id: "2",
      name: "Pizza Hut",
      email: "pizzahut@email.com",
      type: "restaurant",
      status: "active",
      joinDate: "2026-02-01",
    },
    {
      id: "3",
      name: "Maria Santos",
      email: "maria@email.com",
      type: "delivery",
      status: "active",
      joinDate: "2026-03-10",
    },
    {
      id: "4",
      name: "Pedro Costa",
      email: "pedro@email.com",
      type: "customer",
      status: "blocked",
      joinDate: "2026-01-20",
    },
  ]);

  const stats: AdminStats = {
    totalUsers: 2450,
    totalRestaurants: 125,
    totalOrders: 15000,
    totalRevenue: 285000.0,
  };

  const handleUserStatus = (userId: string, status: string) => {
    toast.success(`Usuário ${status === "active" ? "ativado" : "bloqueado"}`);
  };

  const handleDeleteUser = (userId: string) => {
    toast.success("Usuário deletado");
  };

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case "customer":
        return "Cliente";
      case "restaurant":
        return "Restaurante";
      case "delivery":
        return "Entregador";
      default:
        return type;
    }
  };

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case "customer":
        return "bg-blue-100 text-blue-800";
      case "restaurant":
        return "bg-orange-100 text-orange-800";
      case "delivery":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "blocked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
            <Button
              onClick={() => setLocation("/")}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              Sair
            </Button>
          </div>

          <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
            {["dashboard", "users", "restaurants", "settings"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 font-medium transition whitespace-nowrap ${
                  activeTab === tab
                    ? "border-b-2 border-red-600 text-red-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab === "dashboard"
                  ? "Dashboard"
                  : tab === "users"
                  ? "Usuários"
                  : tab === "restaurants"
                  ? "Restaurantes"
                  : "Configurações"}
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
                    <p className="text-gray-600 text-sm font-medium">Total de Usuários</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                  </div>
                  <Users className="w-12 h-12 text-blue-600 opacity-20" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Restaurantes</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.totalRestaurants}
                    </p>
                  </div>
                  <ShoppingBag className="w-12 h-12 text-orange-600 opacity-20" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total de Pedidos</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.totalOrders.toLocaleString()}
                    </p>
                  </div>
                  <BarChart3 className="w-12 h-12 text-green-600 opacity-20" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Faturamento Total</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      R${(stats.totalRevenue / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-yellow-600 opacity-20" />
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Atividade Recente</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-semibold text-gray-900">Novo pedido #12345</p>
                    <p className="text-xs text-gray-600">João Silva - Pizza Hut</p>
                  </div>
                  <p className="text-sm text-gray-600">2 minutos atrás</p>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-semibold text-gray-900">Novo usuário registrado</p>
                    <p className="text-xs text-gray-600">maria.santos@email.com</p>
                  </div>
                  <p className="text-sm text-gray-600">5 minutos atrás</p>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-semibold text-gray-900">Pagamento processado</p>
                    <p className="text-xs text-gray-600">R$ 2.500,00</p>
                  </div>
                  <p className="text-sm text-gray-600">10 minutos atrás</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Gerenciar Usuários</h2>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Usuário
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                      Data de Cadastro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getUserTypeColor(
                            user.type
                          )}`}
                        >
                          {getUserTypeLabel(user.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            user.status
                          )}`}
                        >
                          {user.status === "active"
                            ? "Ativo"
                            : user.status === "inactive"
                            ? "Inativo"
                            : "Bloqueado"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.joinDate}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUserStatus(
                                user.id,
                                user.status === "active" ? "blocked" : "active"
                              )
                            }
                          >
                            {user.status === "active" ? (
                              <Lock className="w-4 h-4" />
                            ) : (
                              <Unlock className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Restaurants Tab */}
        {activeTab === "restaurants" && (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Restaurantes</h2>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Restaurante
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Pizza Hut", "Burger King", "Sushi Master", "Churrascaria Brasil"].map(
                (restaurant, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900">{restaurant}</h3>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Ativo
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {Math.floor(Math.random() * 500) + 100} pedidos • 4.{Math.floor(Math.random() * 9) + 1}⭐
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Visualizar
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              )}
            </div>
          </Card>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Configurações</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Comissão de Entrega</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    defaultValue="10"
                    className="px-3 py-2 border border-gray-300 rounded w-24 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <span className="text-gray-600 font-medium">R$ por entrega</span>
                  <Button className="ml-auto bg-red-600 hover:bg-red-700">Salvar</Button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Taxa de Plataforma</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    defaultValue="15"
                    className="px-3 py-2 border border-gray-300 rounded w-24 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <span className="text-gray-600 font-medium">% do pedido</span>
                  <Button className="ml-auto bg-red-600 hover:bg-red-700">Salvar</Button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Notificações</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-gray-700">Novos pedidos</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-gray-700">Novos usuários</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-gray-700">Alertas de sistema</span>
                  </label>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
