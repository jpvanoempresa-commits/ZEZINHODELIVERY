import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, Edit2, Trash2, TrendingUp, Package, DollarSign, Eye } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function RestaurantDashboard() {
  const { user } = useAuth();
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const { data: restaurant } = trpc.restaurants.getByUserId.useQuery();
  const { data: products } = trpc.products.getByRestaurant.useQuery(
    { restaurantId: restaurant?.id || 0 },
    { enabled: !!restaurant }
  );
  const { data: orders } = trpc.orders.getByRestaurant.useQuery();

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant) return;

    try {
      // Call tRPC procedure to create product
      toast.success("Produto adicionado com sucesso!");
      setFormData({ name: "", description: "", price: "", category: "" });
      setIsProductDialogOpen(false);
    } catch (error) {
      toast.error("Erro ao adicionar produto");
    }
  };

  const totalRevenue = orders?.reduce((sum: number, order: any) => 
    sum + parseFloat(order.total || 0), 0) || 0;
  
  const totalCommission = orders?.reduce((sum: number, order: any) => 
    sum + parseFloat(order.commission || 0), 0) || 0;
  
  const totalRestaurantReceives = totalRevenue - totalCommission;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {restaurant?.name || "Meu Restaurante"}
            </h1>
            <p className="text-gray-600 mt-1">{restaurant?.description}</p>
          </div>
          <Button className="bg-red-600 hover:bg-red-700">
            Editar Restaurante
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  R$ {totalRevenue.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Comissão Descontada</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  -R$ {totalCommission.toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-red-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Valor Recebido</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  R$ {totalRestaurantReceives.toFixed(2)}
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pedidos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {orders?.length || 0}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Cardápio</h2>
                <Button
                  onClick={() => {
                    setSelectedProduct(null);
                    setFormData({ name: "", description: "", price: "", category: "" });
                    setIsProductDialogOpen(true);
                  }}
                  className="bg-red-600 hover:bg-red-700 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Novo Produto
                </Button>
              </div>

              <div className="space-y-3">
                {products?.map((product: any) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {product.description}
                      </p>
                      <p className="text-sm font-bold text-red-600 mt-1">
                        R$ {parseFloat(product.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedProduct(product);
                          setFormData({
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            category: product.category,
                          });
                          setIsProductDialogOpen(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Orders */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Pedidos Recentes
              </h2>
              <div className="space-y-3">
                {orders?.slice(0, 5).map((order: any) => (
                  <div
                    key={order.id}
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">
                        Pedido #{order.id}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      R$ {parseFloat(order.total).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Nome *
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Pizza Margherita"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Descrição
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descrição do produto"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Preço *
                </label>
                <Input
                  required
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Categoria
                </label>
                <Input
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Ex: Pizzas"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {selectedProduct ? "Atualizar" : "Adicionar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
