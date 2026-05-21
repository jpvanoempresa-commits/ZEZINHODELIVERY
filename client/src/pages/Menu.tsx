import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowLeft, Plus, Minus, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function Menu() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("Pizzas");
  const [cart, setCart] = useState<CartItem[]>([]);

  const categories = ["Pizzas", "Bebidas", "Sobremesas", "Acompanhamentos"];

  const [menuItems] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Pizza Margherita",
      description: "Molho de tomate, mozzarela e manjericão",
      price: 35.90,
      image: "🍕",
      category: "Pizzas",
      rating: 4.8,
      reviews: 250,
    },
    {
      id: "2",
      name: "Pizza Pepperoni",
      description: "Molho de tomate, mozzarela e pepperoni",
      price: 38.90,
      image: "🍕",
      category: "Pizzas",
      rating: 4.9,
      reviews: 320,
    },
    {
      id: "3",
      name: "Pizza Vegetariana",
      description: "Molho de tomate, mozzarela, brócolis e cogumelo",
      price: 36.90,
      image: "🍕",
      category: "Pizzas",
      rating: 4.6,
      reviews: 180,
    },
    {
      id: "4",
      name: "Refrigerante 2L",
      description: "Refrigerante gelado",
      price: 8.90,
      image: "🥤",
      category: "Bebidas",
      rating: 4.5,
      reviews: 500,
    },
    {
      id: "5",
      name: "Suco Natural",
      description: "Suco natural de frutas",
      price: 6.90,
      image: "🧃",
      category: "Bebidas",
      rating: 4.7,
      reviews: 300,
    },
    {
      id: "6",
      name: "Brownie",
      description: "Brownie de chocolate quente",
      price: 12.90,
      image: "🍫",
      category: "Sobremesas",
      rating: 4.9,
      reviews: 400,
    },
    {
      id: "7",
      name: "Batata Frita",
      description: "Batata frita crocante",
      price: 9.90,
      image: "🍟",
      category: "Acompanhamentos",
      rating: 4.8,
      reviews: 600,
    },
    {
      id: "8",
      name: "Asas de Frango",
      description: "Asas de frango temperadas",
      price: 14.90,
      image: "🍗",
      category: "Acompanhamentos",
      rating: 4.7,
      reviews: 450,
    },
  ]);

  const filteredItems = menuItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
      setCart(
        cart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }

    toast.success(`${item.name} adicionado ao carrinho!`);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
    toast.success("Item removido do carrinho");
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(id);
    } else {
      setCart(
        cart.map(item => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white pb-32">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setLocation("/restaurants")}
            className="flex items-center text-red-600 hover:text-red-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Pizza Hut</h1>
          <div className="w-10" />
        </div>

        <div className="container mx-auto px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                  selectedCategory === category
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
          {filteredItems.map(item => (
            <Card key={item.id} className="p-4 hover:shadow-lg transition">
              <div className="flex gap-4">
                <div className="text-4xl flex-shrink-0">{item.image}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{item.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-red-600">R${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold">{item.rating}</span>
                      <span className="text-gray-600">({item.reviews})</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleAddToCart(item)}
                    size="sm"
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="container mx-auto max-w-3xl">
            <div className="max-h-40 overflow-y-auto mb-4 space-y-2">
              {cart.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-600">
                      R${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-red-600">
                  R${totalPrice.toFixed(2)}
                </span>
              </div>

              <Button
                onClick={() => setLocation("/checkout")}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Ir para Carrinho
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
