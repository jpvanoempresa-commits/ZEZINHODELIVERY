import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Star, Clock, DollarSign, ShoppingCart, Plus, Minus } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface CartItem {
  productId: number;
  name: string;
  price: string;
  quantity: number;
}

export default function Restaurant() {
  const [, params] = useRoute("/restaurant/:id");
  const [, setLocation] = useLocation();
  const restaurantId = params?.id ? parseInt(params.id) : 0;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  const { data: restaurant } = trpc.restaurants.getById.useQuery(
    { id: restaurantId },
    { enabled: !!restaurantId }
  );

  const { data: products } = trpc.products.getByRestaurant.useQuery(
    { restaurantId },
    { enabled: !!restaurantId }
  );

  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.productId === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
        },
      ]);
    }

    setSelectedProduct(null);
    setQuantity(1);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setLocation(`/checkout?restaurantId=${restaurantId}`);
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setLocation("/search")}
            className="text-red-600 font-bold text-xl hover:text-red-700"
          >
            ← Voltar
          </button>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-gray-900">{cart.length} itens</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Restaurant Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {restaurant.name}
              </h1>
              <p className="text-gray-600 mb-4">{restaurant.description}</p>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-gray-900">
                    {restaurant.rating || "4.5"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="w-5 h-5" />
                  30 min
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <DollarSign className="w-5 h-5" />
                  Taxa: R$ 5,00
                </div>
              </div>
            </div>
            <span
              className={`text-sm font-semibold px-4 py-2 rounded-full ${
                restaurant.isOpen
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {restaurant.isOpen ? "Aberto" : "Fechado"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cardápio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products?.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedProduct(product);
                    setQuantity(1);
                  }}
                >
                  <div className="h-32 bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
                    <div className="text-4xl">🍽️</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-600 text-lg">
                        R$ {parseFloat(product.price).toFixed(2)}
                      </span>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                          setQuantity(1);
                        }}
                      >
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Seu Carrinho</h3>

              {cart.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  Seu carrinho está vazio
                </p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">
                            {item.name}
                          </p>
                          <p className="text-red-600 font-bold">
                            R$ {(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-6 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Taxa de entrega:</span>
                      <span>R$ 5,00</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-gray-900">
                      <span>Total:</span>
                      <span>R$ {(subtotal + 5).toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-red-600 hover:bg-red-700 mt-4 py-6 text-lg font-semibold"
                  >
                    Ir para Checkout
                  </Button>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="h-40 bg-gradient-to-br from-red-100 to-red-50 rounded-lg flex items-center justify-center">
              <div className="text-6xl">🍽️</div>
            </div>
            <p className="text-gray-600">{selectedProduct?.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-red-600">
                R$ {selectedProduct && parseFloat(selectedProduct.price).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-4 justify-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-200 rounded-lg"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-2xl font-bold w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-gray-200 rounded-lg"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <Button
              onClick={() => addToCart(selectedProduct)}
              className="w-full bg-red-600 hover:bg-red-700 py-6 text-lg font-semibold"
            >
              Adicionar ao Carrinho
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
