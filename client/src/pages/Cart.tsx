import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowLeft, Plus, Minus, Trash2, Tag, TrendingDown } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurant: string;
}

export default function Cart() {
  const [, setLocation] = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Pizza Margherita",
      price: 35.90,
      quantity: 2,
      restaurant: "Pizza Hut",
    },
    {
      id: "2",
      name: "Refrigerante 2L",
      price: 8.90,
      quantity: 1,
      restaurant: "Pizza Hut",
    },
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 5.0;
  const discount = appliedPromo ? (subtotal * appliedPromo.discount) / 100 : 0;
  const total = subtotal + deliveryFee - discount;

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
    } else {
      setCartItems(
        cartItems.map(item => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.success("Item removido do carrinho");
  };

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "BEMVINDO20") {
      setAppliedPromo({ code: promoCode, discount: 20 });
      toast.success("Cupom aplicado com sucesso!");
      setPromoCode("");
    } else if (promoCode.toUpperCase() === "ESPECIAL15") {
      setAppliedPromo({ code: promoCode, discount: 15 });
      toast.success("Cupom aplicado com sucesso!");
      setPromoCode("");
    } else {
      toast.error("Cupom inválido");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    toast.success("Cupom removido");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Carrinho vazio");
      return;
    }
    setLocation("/checkout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setLocation("/restaurants")}
            className="flex items-center text-red-600 hover:text-red-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Carrinho</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {cartItems.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-600 mb-4">Seu carrinho está vazio</p>
              <Button
                onClick={() => setLocation("/restaurants")}
                className="bg-red-600 hover:bg-red-700"
              >
                Continuar Comprando
              </Button>
            </Card>
          ) : (
            <>
              {/* Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.restaurant}</p>
                      </div>
                      <p className="font-bold text-red-600">
                        R${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Promo Code */}
              <Card className="p-4 mb-6 border-blue-200 bg-blue-50">
                <div className="flex gap-2 mb-3">
                  <Tag className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <h3 className="font-semibold text-blue-900">Cupom de Desconto</h3>
                </div>

                {appliedPromo ? (
                  <div className="flex items-center justify-between p-3 bg-white rounded border border-green-200">
                    <div>
                      <p className="text-sm font-mono font-bold text-green-700">
                        {appliedPromo.code}
                      </p>
                      <p className="text-xs text-green-600">
                        {appliedPromo.discount}% de desconto aplicado
                      </p>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="text-red-600 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Digite o código..."
                      className="flex-1 px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      onClick={handleApplyPromo}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Aplicar
                    </Button>
                  </div>
                )}
              </Card>

              {/* Summary */}
              <Card className="p-6 space-y-3 border-2 border-red-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>R${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxa de Entrega:</span>
                  <span>R${deliveryFee.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span className="flex items-center gap-1">
                      <TrendingDown className="w-4 h-4" />
                      Desconto:
                    </span>
                    <span>-R${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-red-600">R${total.toFixed(2)}</span>
                </div>
              </Card>

              {/* Buttons */}
              <div className="mt-6 space-y-3">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
                >
                  Ir para Checkout
                </Button>
                <Button
                  onClick={() => setLocation("/restaurants")}
                  variant="outline"
                  className="w-full border-red-600 text-red-600 hover:bg-red-50"
                >
                  Continuar Comprando
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
