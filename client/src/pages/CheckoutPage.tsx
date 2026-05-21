import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowLeft, MapPin, CreditCard, DollarSign, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Address {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  zipCode: string;
}

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"address" | "payment" | "confirmation">("address");
  const [address, setAddress] = useState<Address>({
    street: "Rua das Flores",
    number: "123",
    complement: "Apto 456",
    neighborhood: "Centro",
    city: "São Paulo",
    zipCode: "01310-100",
  });

  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const total = 98.70;

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleContinueToPayment = () => {
    if (!address.street || !address.number || !address.zipCode) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    setStep("payment");
  };

  const handleProcessPayment = () => {
    if (paymentMethod === "card") {
      if (!cardData.cardNumber || !cardData.cardName || !cardData.expiryDate || !cardData.cvv) {
        toast.error("Preencha todos os dados do cartão");
        return;
      }
    }
    setStep("confirmation");
    toast.success("Pagamento processado com sucesso!");
  };

  const handleConfirmOrder = () => {
    setLocation("/order-tracking");
    toast.success("Pedido confirmado!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setLocation("/cart")}
            className="flex items-center text-red-600 hover:text-red-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="flex gap-4 mb-8">
            {["address", "payment", "confirmation"].map((s, idx) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step === s
                      ? "bg-red-600 text-white"
                      : ["address", "payment"].includes(step) && ["address", "payment"].indexOf(step) > idx
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {idx + 1}
                </div>
                {idx < 2 && <div className="w-8 h-1 bg-gray-300" />}
              </div>
            ))}
          </div>

          {/* Address Step */}
          {step === "address" && (
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-bold text-gray-900">Endereço de Entrega</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rua
                    </label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={e => handleAddressChange("street", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número
                    </label>
                    <input
                      type="text"
                      value={address.number}
                      onChange={e => handleAddressChange("number", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP
                    </label>
                    <input
                      type="text"
                      value={address.zipCode}
                      onChange={e => handleAddressChange("zipCode", e.target.value)}
                      placeholder="00000-000"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complemento (opcional)
                  </label>
                  <input
                    type="text"
                    value={address.complement}
                    onChange={e => handleAddressChange("complement", e.target.value)}
                    placeholder="Apto, sala, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bairro
                    </label>
                    <input
                      type="text"
                      value={address.neighborhood}
                      onChange={e => handleAddressChange("neighborhood", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={e => handleAddressChange("city", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleContinueToPayment}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
                >
                  Continuar para Pagamento
                </Button>
              </div>
            </Card>
          )}

          {/* Payment Step */}
          {step === "payment" && (
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-bold text-gray-900">Forma de Pagamento</h2>
              </div>

              <div className="space-y-4">
                {/* PIX */}
                <div
                  onClick={() => setPaymentMethod("pix")}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                    paymentMethod === "pix"
                      ? "border-red-600 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">PIX</h3>
                      <p className="text-sm text-gray-600">Transferência instantânea</p>
                    </div>
                  </div>
                </div>

                {/* Card */}
                <div
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                    paymentMethod === "card"
                      ? "border-red-600 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Cartão de Crédito</h3>
                      <p className="text-sm text-gray-600">Visa, Mastercard ou Elo</p>
                    </div>
                  </div>
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-3 p-4 bg-gray-50 rounded">
                    <input
                      type="text"
                      placeholder="Número do cartão"
                      value={cardData.cardNumber}
                      onChange={e => setCardData(prev => ({ ...prev, cardNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                    <input
                      type="text"
                      placeholder="Nome do titular"
                      value={cardData.cardName}
                      onChange={e => setCardData(prev => ({ ...prev, cardName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={cardData.expiryDate}
                        onChange={e => setCardData(prev => ({ ...prev, expiryDate: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        value={cardData.cvv}
                        onChange={e => setCardData(prev => ({ ...prev, cvv: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>
                )}

                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-900">
                    <strong>Total a pagar:</strong> R${total.toFixed(2)}
                  </p>
                </div>

                <Button
                  onClick={handleProcessPayment}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
                >
                  Confirmar Pagamento
                </Button>
              </div>
            </Card>
          )}

          {/* Confirmation Step */}
          {step === "confirmation" && (
            <Card className="p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagamento Confirmado!</h2>
              <p className="text-gray-600 mb-6">
                Seu pedido foi confirmado e está sendo preparado. Você receberá atualizações em tempo real.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Número do Pedido:</strong> #12345
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Endereço:</strong> {address.street}, {address.number} - {address.neighborhood}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Total:</strong> R${total.toFixed(2)}
                </p>
              </div>

              <Button
                onClick={handleConfirmOrder}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
              >
                Acompanhar Pedido
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
