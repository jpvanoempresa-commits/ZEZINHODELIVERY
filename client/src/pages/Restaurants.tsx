import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Search, MapPin, Clock, Star, Heart, Filter } from "lucide-react";
import { toast } from "sonner";

interface Restaurant {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  deliveryTime: number;
  deliveryFee: number;
  distance: number;
  image: string;
  isOpen: boolean;
  isFavorite: boolean;
  minOrder: number;
}

export default function Restaurants() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const categories = ["all", "Pizzaria", "Hambúrguer", "Sushi", "Brasileira", "Asiática"];

  const [restaurants] = useState<Restaurant[]>([
    {
      id: "1",
      name: "Pizza Hut",
      category: "Pizzaria",
      rating: 4.8,
      reviews: 1250,
      deliveryTime: 30,
      deliveryFee: 5.0,
      distance: 2.5,
      image: "🍕",
      isOpen: true,
      isFavorite: false,
      minOrder: 30,
    },
    {
      id: "2",
      name: "Burger King",
      category: "Hambúrguer",
      rating: 4.6,
      reviews: 980,
      deliveryTime: 25,
      deliveryFee: 4.0,
      distance: 1.8,
      image: "🍔",
      isOpen: true,
      isFavorite: false,
      minOrder: 25,
    },
    {
      id: "3",
      name: "Sushi Master",
      category: "Sushi",
      rating: 4.9,
      reviews: 650,
      deliveryTime: 35,
      deliveryFee: 6.0,
      distance: 3.2,
      image: "🍣",
      isOpen: true,
      isFavorite: false,
      minOrder: 40,
    },
    {
      id: "4",
      name: "Churrascaria Brasil",
      category: "Brasileira",
      rating: 4.7,
      reviews: 1100,
      deliveryTime: 40,
      deliveryFee: 7.0,
      distance: 4.1,
      image: "🥩",
      isOpen: true,
      isFavorite: false,
      minOrder: 50,
    },
    {
      id: "5",
      name: "Wok Express",
      category: "Asiática",
      rating: 4.5,
      reviews: 520,
      deliveryTime: 28,
      deliveryFee: 4.5,
      distance: 2.0,
      image: "🥡",
      isOpen: true,
      isFavorite: false,
      minOrder: 35,
    },
    {
      id: "6",
      name: "Subway",
      category: "Hambúrguer",
      rating: 4.4,
      reviews: 780,
      deliveryTime: 20,
      deliveryFee: 3.5,
      distance: 1.2,
      image: "🥪",
      isOpen: true,
      isFavorite: false,
      minOrder: 20,
    },
  ]);

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || restaurant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
      toast.success("Removido dos favoritos");
    } else {
      newFavorites.add(id);
      toast.success("Adicionado aos favoritos");
    }
    setFavorites(newFavorites);
  };

  const handleSelectRestaurant = (id: string) => {
    setLocation(`/menu/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Restaurantes</h1>

          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar restaurante..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
            <Button variant="outline" className="border-gray-300">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

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
                {category === "all" ? "Todos" : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {filteredRestaurants.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600 mb-4">Nenhum restaurante encontrado</p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Limpar Filtros
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRestaurants.map(restaurant => (
              <Card
                key={restaurant.id}
                className="overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => handleSelectRestaurant(restaurant.id)}
              >
                <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-6xl">{restaurant.image}</span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleToggleFavorite(restaurant.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:shadow-md transition"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.has(restaurant.id)
                          ? "fill-red-600 text-red-600"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                  {!restaurant.isOpen && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-bold">Fechado</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">{restaurant.name}</h3>
                  <p className="text-xs text-gray-600 mb-3">{restaurant.category}</p>

                  <div className="flex items-center justify-between mb-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold text-gray-900">
                        {restaurant.rating}
                      </span>
                      <span className="text-gray-600">({restaurant.reviews})</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-red-600" />
                      {restaurant.deliveryTime} min
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      {restaurant.distance} km • R${restaurant.deliveryFee.toFixed(2)}
                    </div>
                    <p className="text-gray-600">Mín: R${restaurant.minOrder}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
