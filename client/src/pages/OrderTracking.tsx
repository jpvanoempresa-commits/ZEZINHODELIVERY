import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface DeliveryPerson {
  name: string;
  phone: string;
  rating: number;
  vehicle: string;
}

interface OrderStatus {
  step: number;
  label: string;
  completed: boolean;
  time?: string;
}

export default function OrderTracking() {
  const [, setLocation] = useLocation();
  const [currentLocation, setCurrentLocation] = useState({ lat: -23.5505, lng: -46.6333 });
  const [deliveryPerson] = useState<DeliveryPerson>({
    name: "João Silva",
    phone: "(11) 98765-4321",
    rating: 4.8,
    vehicle: "Moto Vermelha - ABC-1234",
  });

  const [orderStatus] = useState<OrderStatus[]>([
    { step: 1, label: "Pedido Confirmado", completed: true, time: "14:30" },
    { step: 2, label: "Preparando", completed: true, time: "14:35" },
    { step: 3, label: "Saiu para Entrega", completed: true, time: "14:50" },
    { step: 4, label: "Entregando", completed: false },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
          <h1 className="text-2xl font-bold text-gray-900">Rastreamento</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto mb-8 h-80 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <p className="text-gray-600">Mapa de rastreamento em tempo real</p>
            <p className="text-sm text-gray-500 mt-2">
              Localização: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
            </p>
          </div>
        </Card>

        <Card className="max-w-3xl mx-auto mb-8 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Entregador</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                {deliveryPerson.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{deliveryPerson.name}</h3>
                <p className="text-sm text-gray-600">{deliveryPerson.vehicle}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < Math.floor(deliveryPerson.rating)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    {deliveryPerson.rating}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                <Phone className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="max-w-3xl mx-auto mb-8 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Status do Pedido</h2>
          <div className="space-y-4">
            {orderStatus.map((status, idx) => (
              <div key={status.step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      status.completed
                        ? "bg-green-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {status.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                  </div>
                  {idx < orderStatus.length - 1 && (
                    <div
                      className={`w-1 h-12 ${
                        status.completed ? "bg-green-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
                <div className="pb-4">
                  <h3 className="font-semibold text-gray-900">{status.label}</h3>
                  {status.time && (
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Clock className="w-4 h-4" />
                      {status.time}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="max-w-3xl mx-auto p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-900 font-medium">Tempo estimado de entrega</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">8 minutos</p>
            </div>
            <Clock className="w-12 h-12 text-blue-600" />
          </div>
        </Card>
      </div>
    </div>
  );
}
