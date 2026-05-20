import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, TrendingUp, DollarSign } from "lucide-react";

export default function AdminPanel() {
  const [stats] = useState({
    totalCommissions: 5420.00,
    totalOrders: 342,
    totalRestaurants: 28,
    totalDeliveries: 156,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Painel Administrativo</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Comissões</p>
                <p className="text-2xl font-bold text-green-600">R$ {stats.totalCommissions.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pedidos</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Restaurantes</p>
                <p className="text-2xl font-bold">{stats.totalRestaurants}</p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Entregadores</p>
                <p className="text-2xl font-bold">{stats.totalDeliveries}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="commissions" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="commissions">Comissões</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="restaurants">Restaurantes</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
          </TabsList>

          <TabsContent value="commissions">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Histórico de Comissões</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Restaurante</th>
                    <th className="text-left py-2">Pedido</th>
                    <th className="text-right py-2">Comissão</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Pizzaria do João</td>
                    <td className="py-2">#1001</td>
                    <td className="text-right">R$ 10,00</td>
                    <td><span className="bg-green-100 text-green-800 px-2 py-1 rounded">Paga</span></td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Todos os Pedidos</h3>
              <p className="text-gray-600">Tabela de pedidos em desenvolvimento...</p>
            </Card>
          </TabsContent>

          <TabsContent value="restaurants">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Gerenciar Restaurantes</h3>
              <p className="text-gray-600">Lista de restaurantes em desenvolvimento...</p>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Gerenciar Usuários</h3>
              <p className="text-gray-600">Lista de usuários em desenvolvimento...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
