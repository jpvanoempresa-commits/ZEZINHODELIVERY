import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, ShoppingBag, DollarSign, Plus, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function RestaurantPanel() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Buscar dados reais do restaurante
  const { data: restaurantData } = trpc.restaurants.getMyRestaurant.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Buscar saldo real
  const { data: balanceData } = trpc.restaurants.getBalance.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Buscar pedidos reais
  const { data: orders } = trpc.restaurants.getMyOrders.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Mutation para solicitar saque
  const withdrawMutation = trpc.payouts.requestWithdrawal.useMutation({
    onSuccess: () => {
      setWithdrawAmount("");
      alert("Saque solicitado com sucesso!");
    },
    onError: (error) => {
      alert(`Erro ao solicitar saque: ${error.message}`);
    },
  });

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && amount <= (balanceData?.balance || 0)) {
      withdrawMutation.mutate({ amount });
    } else {
      alert("Valor inválido ou saldo insuficiente");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setLocation("/")} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-red-600">Painel do Restaurante</h1>
          </div>
          <Button variant="outline" onClick={() => setLocation("/")}>Sair</Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Saldo Disponível (REAL)</p>
                <p className="text-2xl font-bold text-green-600">R$ {(balanceData?.balance || 0).toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pedidos Hoje</p>
                <p className="text-2xl font-bold">{orders?.length || 0}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Restaurante</p>
                <p className="text-lg font-bold">{restaurantData?.name || "Carregando..."}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="withdrawals">Saques</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Pedidos Recentes</h3>
              {orders && orders.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Cliente</th>
                      <th className="text-left py-2">Itens</th>
                      <th className="text-right py-2">Total</th>
                      <th className="text-left py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order: any) => (
                      <tr key={order.id} className="border-b">
                        <td className="py-2">{order.customerName || "Cliente"}</td>
                        <td className="py-2">{order.items || 0}</td>
                        <td className="text-right">R$ {(order.total || 0).toFixed(2)}</td>
                        <td>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status || "Pendente"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600">Nenhum pedido ainda</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Meus Produtos</h3>
                <Button className="bg-red-600 hover:bg-red-700" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Produto
                </Button>
              </div>
              <p className="text-gray-600">Seus produtos aparecerão aqui...</p>
            </Card>
          </TabsContent>

          <TabsContent value="withdrawals">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Solicitar Saque via Pix</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Saldo Disponível: <span className="font-bold text-green-600">R$ {(balanceData?.balance || 0).toFixed(2)}</span></p>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Valor do saque"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      step="0.01"
                      min="0"
                      max={balanceData?.balance || 0}
                    />
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleWithdraw}
                      disabled={withdrawMutation.isPending}
                    >
                      {withdrawMutation.isPending ? "Processando..." : "Sacar"}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Configurações</h3>
              <p className="text-gray-600">Configurações em desenvolvimento...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
