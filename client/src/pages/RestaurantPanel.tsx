import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";

export default function RestaurantPanel() {
  const [balance] = useState(1250.50);
  const [orders] = useState([
    { id: 1, customer: "João Silva", total: 85.50, status: "entregando" },
    { id: 2, customer: "Maria Santos", total: 120.00, status: "preparando" },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Painel do Restaurante</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Saldo Disponível</p>
                <p className="text-2xl font-bold text-green-600">R$ {balance.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pedidos Hoje</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Produtos</p>
                <p className="text-2xl font-bold">45</p>
              </div>
              <Package className="w-8 h-8 text-orange-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avaliação</p>
                <p className="text-2xl font-bold">4.8 ⭐</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-600" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="withdrawals">Saques</TabsTrigger>
            <TabsTrigger value="analytics">Análise</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Pedidos Recentes</h3>
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <p className="font-semibold">{order.customer}</p>
                      <p className="text-sm text-gray-600">Pedido #{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">R$ {order.total.toFixed(2)}</p>
                      <p className="text-sm text-orange-600 capitalize">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Gerenciar Produtos</h3>
              <Button className="bg-red-600">+ Adicionar Produto</Button>
            </Card>
          </TabsContent>

          <TabsContent value="withdrawals">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Solicitar Saque</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Valor</label>
                  <input type="number" placeholder="R$ 0,00" className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Chave Pix</label>
                  <input type="text" placeholder="email@example.com" className="w-full border rounded px-3 py-2" />
                </div>
                <Button className="w-full bg-green-600">Solicitar Saque</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Análise de Vendas</h3>
              <p className="text-gray-600">Gráficos e estatísticas em breve...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
