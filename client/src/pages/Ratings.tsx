import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowLeft, Star, Send } from "lucide-react";
import { toast } from "sonner";

interface RatingForm {
  restaurantRating: number;
  deliveryRating: number;
  comment: string;
}

export default function Ratings() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState<RatingForm>({
    restaurantRating: 0,
    deliveryRating: 0,
    comment: "",
  });

  const handleRestaurantRating = (rating: number) => {
    setFormData(prev => ({ ...prev, restaurantRating: rating }));
  };

  const handleDeliveryRating = (rating: number) => {
    setFormData(prev => ({ ...prev, deliveryRating: rating }));
  };

  const handleSubmit = () => {
    if (formData.restaurantRating === 0 || formData.deliveryRating === 0) {
      toast.error("Por favor, avalie o restaurante e a entrega");
      return;
    }
    toast.success("Avaliação enviada com sucesso!");
    setFormData({ restaurantRating: 0, deliveryRating: 0, comment: "" });
  };

  const StarRating = ({
    rating,
    onRate,
  }: {
    rating: number;
    onRate: (rating: number) => void;
  }) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => onRate(star)}
          className="transition transform hover:scale-110"
        >
          <Star
            className={`w-8 h-8 ${
              star <= rating
                ? "fill-yellow-500 text-yellow-500"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Avaliar Pedido</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-8">
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Pedido #12345</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium text-gray-900">Restaurante:</span> Burger King
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium text-gray-900">Entregador:</span> João Silva
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">Data:</span> 20 de maio de 2026
              </p>
            </div>
          </div>

          <div className="mb-8 pb-8 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Como foi o restaurante?
            </h3>
            <StarRating
              rating={formData.restaurantRating}
              onRate={handleRestaurantRating}
            />
            <div className="mt-4 flex gap-2">
              {["Péssimo", "Ruim", "Ok", "Bom", "Excelente"].map((label, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-2 py-1 rounded ${
                    idx + 1 === formData.restaurantRating
                      ? "bg-yellow-100 text-yellow-800 font-medium"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8 pb-8 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Como foi a entrega?
            </h3>
            <StarRating
              rating={formData.deliveryRating}
              onRate={handleDeliveryRating}
            />
            <div className="mt-4 flex gap-2">
              {["Péssima", "Ruim", "Ok", "Boa", "Excelente"].map((label, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-2 py-1 rounded ${
                    idx + 1 === formData.deliveryRating
                      ? "bg-yellow-100 text-yellow-800 font-medium"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Deixe um comentário (opcional)
            </label>
            <textarea
              value={formData.comment}
              onChange={e =>
                setFormData(prev => ({ ...prev, comment: e.target.value }))
              }
              placeholder="Compartilhe sua experiência..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
              rows={4}
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Enviar Avaliação
          </Button>
        </Card>
      </div>
    </div>
  );
}
