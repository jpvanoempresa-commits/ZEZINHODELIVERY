import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, DollarSign, CheckCircle } from "lucide-react";

export default function DeliveryPanel() {
  const [earnings] = useState(1850.00);
  const [deliveries] = useState([
    { id: 1, restaurant: "Pizzaria do João", address: "Rua A, 123", status: "disponível" },
    { id: 2, restaurant: "Burger King", address: "Av. B, 456", status: "em_rota" },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Painel do Entregador</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Ganhos Hoje</p>
                <p className="text-2xl font-bold text-green-600">R$ {earnings.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Entregas Hoje</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tempo Médio</p>
                <p className="text-2xl font-bold">28 min</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avaliação</p>
                <p className="text-2xl font-bold">4.9 ⭐</p>
              </div>
              <MapPin className="w-8 h-8 text-red-600" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">Disponíveis</TabsTrigger>
            <TabsTrigger value="active">Em Rota</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Entregas Disponíveis</h3>
              <div className="space-y-3">
                {deliveries.filter(d => d.status === 'disponível').map((delivery) => (
                  <div key={delivery.id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <p className="font-semibold">{delivery.restaurant}</p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" /> {delivery.address}
                      </p>
                    </div>
                    <Button className="bg-red-600">Aceitar</Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Entregas em Rota</h3>
              <div className="space-y-3">
                {deliveries.filter(d => d.status === 'em_rota').map((delivery) => (
                  <div key={delivery.id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <p className="font-semibold">{delivery.restaurant}</p>
                      <p className="text-sm text-gray-600">{delivery.address}</p>
                    </div>
                    <Button variant="outline">Ver Mapa</Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Histórico de Entregas</h3>
              <p className="text-gray-600">Últimas 30 entregas realizadas...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
