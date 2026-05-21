import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Star, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function SearchPage() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const city = searchParams.get("city") || "";
  const [searchCity, setSearchCity] = useState(city);

  const { data: restaurants, isLoading } = trpc.restaurants.getByCity.useQuery(
    { city: searchCity || city },
    { enabled: !!(searchCity || city) }
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchCity) {
      setLocation(`/search?city=${encodeURIComponent(searchCity)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setLocation("/")} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-red-600">Buscar Restaurantes</h1>
          </div>
        </div>
      </header>

      <div className="bg-white border-b p-4">
        <div className="container mx-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Digite sua cidade..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="pl-10 py-2"
              />
            </div>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              <Search className="w-5 h-5 mr-2" />
              Buscar
            </Button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando restaurantes...</p>
          </div>
        ) : restaurants && restaurants.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {restaurants.length} restaurante{restaurants.length !== 1 ? "s" : ""} encontrado{restaurants.length !== 1 ? "s" : ""} em {city || searchCity}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant: any) => (
                <Card
                  key={restaurant.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setLocation(`/restaurant/${restaurant.id}`)}
                >
                  {restaurant.image && (
                    <img src={restaurant.image} alt={restaurant.name} className="w-full h-40 object-cover" />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{restaurant.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{restaurant.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold">4.8</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4" />
                        {restaurant.city}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">📍 {restaurant.address}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {city || searchCity ? `Nenhum restaurante encontrado em ${city || searchCity}` : "Digite uma cidade para buscar restaurantes"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
