import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Star, Zap } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const city = formData.get("city") as string;
    if (city) {
      setLocation(`/search?city=${encodeURIComponent(city)}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocation("/")}>
            <img src="/manus-storage/WhatsAppImage2026-05-20at18.45.46_e16157f8.jpeg" alt="Zezinho Delivery" className="w-10 h-10" />
            <h1 className="text-2xl font-bold text-amber-500">Zezinho Delivery</h1>
          </div>
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">Olá, {user?.name}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (user?.role === 'restaurant') setLocation("/dashboard/restaurant");
                    else if (user?.role === 'delivery') setLocation("/dashboard/delivery");
                    else if (user?.role === 'admin') setLocation("/dashboard/admin");
                    else setLocation("/");
                  }}
                >
                  Minha Conta
                </Button>
              </>
            ) : (
              <Button 
                className="bg-red-600 hover:bg-red-700" 
                size="sm" 
                onClick={() => setLocation("/login")}
              >
                Entrar
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Comida Rápida, Entrega Mais Rápida Ainda
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Encontre seus restaurantes favoritos e receba sua comida quente na porta de casa
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  name="city"
                  placeholder="Digite sua cidade..."
                  className="pl-10 py-6 text-lg rounded-lg border-2 border-gray-200 focus:border-red-600"
                  required
                />
              </div>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 px-8 py-6 text-lg rounded-lg"
              >
                <Search className="w-5 h-5 mr-2" />
                Buscar
              </Button>
            </form>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Entrega Rápida</h3>
              <p className="text-gray-600">
                Receba sua comida em até 30 minutos com nossos entregadores experientes
              </p>
            </Card>

            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Melhor Qualidade</h3>
              <p className="text-gray-600">
                Restaurantes selecionados e avaliados pela comunidade
              </p>
            </Card>

            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Rastreamento</h3>
              <p className="text-gray-600">
                Acompanhe seu pedido em tempo real no mapa
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Categorias Populares</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Pizzas", icon: "🍕", color: "bg-red-100" },
              { name: "Hambúrgueres", icon: "🍔", color: "bg-orange-100" },
              { name: "Asiática", icon: "🍜", color: "bg-yellow-100" },
              { name: "Saudável", icon: "🥗", color: "bg-green-100" },
              { name: "Japonesa", icon: "🍱", color: "bg-blue-100" },
              { name: "Mexicana", icon: "🌮", color: "bg-purple-100" },
              { name: "Brasileira", icon: "🥘", color: "bg-pink-100" },
              { name: "Doces", icon: "🍰", color: "bg-indigo-100" },
            ].map((category) => (
              <button
                key={category.name}
                onClick={() => setLocation(`/search?category=${encodeURIComponent(category.name)}`)}
                className={`${category.color} p-6 rounded-lg font-semibold text-gray-900 hover:shadow-lg transition-shadow text-center`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Quer ser um restaurante parceiro?</h2>
          <p className="text-lg mb-8 opacity-90">
            Aumente suas vendas com a plataforma Zezinho Delivery
          </p>
          <Button 
            className="bg-white text-red-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
            onClick={() => setLocation("/register")}
          >
            Cadastre seu Restaurante
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Zezinho Delivery</h3>
              <p className="text-gray-400">Entrega rápida e segura de comida</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Para Clientes</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => setLocation("/search")} className="hover:text-white">Buscar Restaurantes</button></li>
                <li><button onClick={() => setLocation("/login")} className="hover:text-white">Minha Conta</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Para Restaurantes</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => setLocation("/register")} className="hover:text-white">Cadastrar Restaurante</button></li>
                <li><button onClick={() => setLocation("/dashboard/restaurant")} className="hover:text-white">Painel do Restaurante</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Para Entregadores</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => setLocation("/register")} className="hover:text-white">Cadastrar como Entregador</button></li>
                <li><button onClick={() => setLocation("/dashboard/delivery")} className="hover:text-white">Painel do Entregador</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Zezinho Delivery. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
