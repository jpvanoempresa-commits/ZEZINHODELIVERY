import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const PLATFORM_COMMISSION = 10;
const DELIVERY_FEE = 5;

export default function Checkout() {
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    address: "",
    notes: "",
    paymentMethod: "pix" as const,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCreated, setOrderCreated] = useState<any>(null);

  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const subtotal = cart.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  const total = subtotal + DELIVERY_FEE;
  const restaurantReceives = total - PLATFORM_COMMISSION;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.address) {
      toast.error("Por favor, informe o endereço de entrega");
      return;
    }

    setIsProcessing(true);

    try {
      // Here you would call the tRPC procedure to create the order
      // For now, we'll simulate the response
      const mockOrder = {
        orderId: `ORD-${Date.now()}`,
        paymentId: `PAY-${Date.now()}`,
        total: total.toFixed(2),
        platformCommission: PLATFORM_COMMISSION.toFixed(2),
        restaurantReceives: restaurantReceives.toFixed(2),
      };

      setOrderCreated(mockOrder);
      toast.success("Pedido criado com sucesso!");
      localStorage.removeItem("cart");
    } catch (error) {
      toast.error("Erro ao criar pedido");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderCreated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pedido Confirmado!
          </h1>
          <p className="text-gray-600 mb-6">
            Seu pedido foi recebido e está sendo preparado
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Pedido:</span>
                <span className="font-semibold text-gray-900">
                  {orderCreated.orderId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold text-lg text-red-600">
                  R$ {orderCreated.total}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tempo estimado:</span>
                <span className="text-gray-900">30 minutos</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setLocation("/")}
            className="w-full bg-red-600 hover:bg-red-700 mb-2"
          >
            Voltar ao Início
          </Button>
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
            className="w-full"
          >
            Acompanhar Pedido
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => setLocation("/")}
            className="text-red-600 font-bold text-xl hover:text-red-700"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Checkout</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Endereço de Entrega
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Endereço Completo *
                  </label>
                  <Input
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Rua, número, complemento, bairro, cidade"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Observações (opcional)
                  </label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Ex: Deixar na portaria, não tocar na campainha..."
                    className="w-full"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Método de Pagamento *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border-2 border-red-600 rounded-lg cursor-pointer bg-red-50">
                      <input
                        type="radio"
                        name="payment"
                        value="pix"
                        checked={formData.paymentMethod === "pix"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paymentMethod: e.target.value as any,
                          })
                        }
                      />
                      <div>
                        <p className="font-semibold text-gray-900">Pix</p>
                        <p className="text-sm text-gray-600">
                          Escaneie o QR Code ou copie a chave
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-red-600 hover:bg-red-700 py-6 text-lg font-semibold"
                >
                  {isProcessing ? "Processando..." : "Confirmar Pedido"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Resumo do Pedido
              </h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                {cart.map((item: any) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-semibold text-gray-900">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    R$ {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa de entrega:</span>
                  <span className="font-semibold text-gray-900">
                    R$ {DELIVERY_FEE.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Commission Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                      Informações de Comissão
                    </p>
                    <div className="space-y-1 text-xs text-blue-800">
                      <div className="flex justify-between">
                        <span>Comissão DeliveryGo:</span>
                        <span className="font-semibold">
                          -R$ {PLATFORM_COMMISSION.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Restaurante recebe:</span>
                        <span className="font-semibold">
                          R$ {restaurantReceives.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-red-600">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
