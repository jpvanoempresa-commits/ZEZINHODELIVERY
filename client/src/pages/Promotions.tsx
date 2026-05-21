import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowLeft, Tag, Copy, Check, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface Promotion {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  minOrder: number;
  expiresAt: Date;
  usageCount: number;
  maxUsage: number;
}

export default function Promotions() {
  const [, setLocation] = useLocation();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [promotions] = useState<Promotion[]>([
    {
      id: "1",
      title: "Desconto de Boas-vindas",
      description: "20% de desconto no seu primeiro pedido",
      code: "BEMVINDO20",
      discount: 20,
      type: "percentage",
      minOrder: 30,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      usageCount: 1250,
      maxUsage: 5000,
    },
    {
      id: "2",
      title: "Desconto Especial",
      description: "R$15 de desconto em pedidos acima de R$50",
      code: "ESPECIAL15",
      discount: 15,
      type: "fixed",
      minOrder: 50,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      usageCount: 320,
      maxUsage: 1000,
    },
    {
      id: "3",
      title: "Promoção do Fim de Semana",
      description: "15% de desconto em pizzarias",
      code: "PIZZA15",
      discount: 15,
      type: "percentage",
      minOrder: 40,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      usageCount: 890,
      maxUsage: 2000,
    },
    {
      id: "4",
      title: "Cashback Zezinho",
      description: "5% de cashback em qualquer pedido",
      code: "CASHBACK5",
      discount: 5,
      type: "percentage",
      minOrder: 20,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
      usageCount: 5600,
      maxUsage: 10000,
    },
  ]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Código copiado!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApplyPromotion = (promotion: Promotion) => {
    toast.success(`Promoção ${promotion.code} aplicada ao carrinho!`);
    setLocation("/checkout");
  };

  const getDaysRemaining = (expiresAt: Date) => {
    const days = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Promoções</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-4">
          {promotions.map(promotion => {
            const daysRemaining = getDaysRemaining(promotion.expiresAt);
            const usagePercentage = (promotion.usageCount / promotion.maxUsage) * 100;

            return (
              <Card key={promotion.id} className="p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Tag className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {promotion.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {promotion.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">
                      {promotion.type === "percentage"
                        ? `${promotion.discount}%`
                        : `R$${promotion.discount}`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-red-600" />
                    Mínimo: R${promotion.minOrder}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-red-600" />
                    {daysRemaining} dias restantes
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-600">
                      Uso: {promotion.usageCount} / {promotion.maxUsage}
                    </p>
                    <p className="text-xs font-medium text-gray-600">
                      {Math.round(usagePercentage)}%
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={promotion.code}
                    readOnly
                    className="flex-1 bg-transparent text-sm font-mono font-bold text-gray-900"
                  />
                  <button
                    onClick={() => handleCopyCode(promotion.code)}
                    className="p-2 hover:bg-gray-200 rounded transition"
                  >
                    {copiedCode === promotion.code ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>

                <Button
                  onClick={() => handleApplyPromotion(promotion)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  Usar Promoção
                </Button>
              </Card>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-bold text-blue-900 mb-2">💡 Dica</h3>
          <p className="text-sm text-blue-800">
            Você pode usar apenas um código de promoção por pedido. Escolha o que oferece o melhor desconto!
          </p>
        </div>
      </div>
    </div>
  );
}
