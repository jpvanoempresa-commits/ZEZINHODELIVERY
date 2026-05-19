import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MapPin, CheckCircle2, Clock, DollarSign, Navigation } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function DeliveryDashboard() {
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);

  const { data: availableDeliveries } = trpc.deliveries.getAvailable.useQuery();
  const { data: activeDeliveries } = trpc.deliveries.getActive.useQuery();
  const { data: completedDeliveries } = trpc.deliveries.getCompleted.useQuery();

  const totalEarnings = completedDeliveries?.reduce((sum: number, d: any) => 
    sum + parseFloat(d.deliveryFee || 0), 0) || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel do Entregador</h1>
          <p className="text-gray-600 mt-1">Gerencie suas entregas e ganhos</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Entregas Ativas</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {activeDeliveries?.length || 0}
                </p>
              </div>
              <Navigation className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Disponíveis</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {availableDeliveries?.length || 0}
                </p>
              </div>
              <MapPin className="w-8 h-8 text-red-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Concluídas</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {completedDeliveries?.length || 0}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Ganhos Hoje</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  R$ {totalEarnings.toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Available Deliveries */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Entregas Disponíveis
              </h2>
              <div className="space-y-3">
                {availableDeliveries?.map((delivery: any) => (
                  <div
                    key={delivery.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {delivery.restaurantName}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {delivery.deliveryAddress}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        R$ {parseFloat(delivery.deliveryFee).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">
                        Estimado: {delivery.estimatedTime} min
                      </span>
                    </div>
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      Aceitar Entrega
                    </Button>
                  </div>
                ))}
                {(!availableDeliveries || availableDeliveries.length === 0) && (
                  <p className="text-center text-gray-600 py-8">
                    Nenhuma entrega disponível no momento
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Active Deliveries */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Entregas Ativas
              </h2>
              <div className="space-y-3">
                {activeDeliveries?.map((delivery: any) => (
                  <div
                    key={delivery.id}
                    className="p-3 border border-blue-200 rounded-lg bg-blue-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">
                        Pedido #{delivery.orderId}
                      </span>
                      <Navigation className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {delivery.deliveryAddress}
                    </p>
                    <Button
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => setSelectedDelivery(delivery)}
                    >
                      Ver Rota
                    </Button>
                  </div>
                ))}
                {(!activeDeliveries || activeDeliveries.length === 0) && (
                  <p className="text-center text-gray-600 py-8">
                    Nenhuma entrega ativa
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Completed Deliveries */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Histórico de Entregas
          </h2>
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
                    Valor
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {completedDeliveries?.map((delivery: any) => (
                  <tr key={delivery.id} className="border-b border-gray-200">
                    <td className="py-3 px-4 text-gray-900">
                      #{delivery.orderId}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {delivery.restaurantName}
                    </td>
                    <td className="py-3 px-4 font-semibold text-green-600">
                      R$ {parseFloat(delivery.deliveryFee).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                        Entregue
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
