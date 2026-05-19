import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Star, Clock, DollarSign } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Search() {
  const [, setLocation] = useLocation();
  const [searchParams] = useLocation();
  const city = new URLSearchParams(searchParams.split("?")[1]).get("city") || "";
  const [searchCity, setSearchCity] = useState(city);

  const { data: restaurants, isLoading } = trpc.restaurants.getByCity.useQuery(
    { city: searchCity },
    { enabled: !!searchCity }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity) {
      setLocation(`/search?city=${encodeURIComponent(searchCity)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => setLocation("/")}
            className="text-red-600 font-bold text-xl mb-4 hover:text-red-700"
          >
            ← DeliveryGo
          </button>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Digite sua cidade..."
                className="pl-10 py-2 rounded-lg border-2 border-gray-200 focus:border-red-600"
              />
            </div>
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 px-6"
            >
              Buscar
            </Button>
          </form>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Carregando restaurantes...</p>
          </div>
        ) : restaurants && restaurants.length > 0 ? (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Restaurantes em {searchCity}
            </h1>
            <p className="text-gray-600 mb-8">
              {restaurants.length} restaurante{restaurants.length !== 1 ? "s" : ""} encontrado{restaurants.length !== 1 ? "s" : ""}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <Card
                  key={restaurant.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setLocation(`/restaurant/${restaurant.id}`)}
                >
                  <div className="h-48 bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
                    <div className="text-6xl">🍽️</div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {restaurant.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {restaurant.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900">
                          {restaurant.rating || "4.5"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        30 min
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        Taxa: R$ 5,00
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        restaurant.isOpen
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {restaurant.isOpen ? "Aberto" : "Fechado"}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Nenhum restaurante encontrado
            </h2>
            <p className="text-gray-600 mb-6">
              Tente buscar em outra cidade ou volte mais tarde
            </p>
            <Button
              onClick={() => setLocation("/")}
              className="bg-red-600 hover:bg-red-700"
            >
              Voltar ao Início
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
