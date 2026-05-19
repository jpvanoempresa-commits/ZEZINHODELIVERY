import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TrendingUp, Users, Store, DollarSign, Eye } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AdminDashboard() {
  const { data: allOrders } = trpc.admin.getAllOrders.useQuery();
  const { data: allCommissions } = trpc.admin.getAllCommissions.useQuery();
  const { data: allUsers } = trpc.admin.getAllUsers.useQuery();
  const { data: allRestaurants } = trpc.admin.getAllRestaurants.useQuery();

  const totalRevenue = allOrders?.reduce((sum: number, order: any) => 
    sum + parseFloat(order.total || 0), 0) || 0;
  
  const totalCommissions = allCommissions?.reduce((sum: number, c: any) => 
    sum + parseFloat(c.amount || 0), 0) || 0;
  
  const totalRepassed = totalRevenue - totalCommissions;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="text-gray-600 mt-1">Visão geral da plataforma DeliveryGo</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  R$ {totalRevenue.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Comissões</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  R$ {totalCommissions.toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-red-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Repassado</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  R$ {totalRepassed.toFixed(2)}
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pedidos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {allOrders?.length || 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Restaurantes</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {allRestaurants?.length || 0}
                </p>
              </div>
              <Store className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Pedidos Recentes</h2>
            <div className="space-y-3">
              {allOrders?.slice(0, 5).map((order: any) => (
                <div
                  key={order.id}
                  className="p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">
                      Pedido #{order.id}
                    </span>
                    <span className="text-red-600 font-bold">
                      R$ {parseFloat(order.total).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Comissão: R$ {parseFloat(order.commission).toFixed(2)}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Users */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Usuários</h2>
            <div className="space-y-3">
              {allUsers?.slice(0, 5).map((user: any) => (
                <div
                  key={user.id}
                  className="p-3 border border-gray-200 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    user.role === 'admin'
                      ? 'bg-red-100 text-red-700'
                      : user.role === 'restaurant'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Commissions Table */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Histórico de Comissões</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Pedido
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Restaurante
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Comissão
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {allCommissions?.map((commission: any) => (
                  <tr key={commission.id} className="border-b border-gray-200">
                    <td className="py-3 px-4 text-gray-900">
                      #{commission.orderId}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {commission.restaurantName}
                    </td>
                    <td className="py-3 px-4 font-semibold text-red-600">
                      R$ {parseFloat(commission.amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        commission.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {commission.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
