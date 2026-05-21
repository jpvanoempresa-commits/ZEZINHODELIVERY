import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowLeft, MessageSquare, Phone, Mail, Send, HelpCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function Support() {
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: "1",
      question: "Como faço para rastrear meu pedido?",
      answer:
        "Você pode rastrear seu pedido em tempo real na seção 'Meus Pedidos'. Lá você verá a localização do entregador e o tempo estimado de chegada.",
    },
    {
      id: "2",
      question: "Qual é o tempo de entrega?",
      answer:
        "O tempo de entrega varia de 30 a 60 minutos, dependendo da distância e da demanda. Você verá o tempo estimado no checkout.",
    },
    {
      id: "3",
      question: "Como faço para cancelar um pedido?",
      answer:
        "Você pode cancelar um pedido enquanto ele está sendo preparado. Vá para 'Meus Pedidos' e clique em 'Cancelar'. Reembolsos são processados em 3-5 dias úteis.",
    },
    {
      id: "4",
      question: "Quais são os métodos de pagamento aceitos?",
      answer:
        "Aceitamos Pix, cartão de crédito e débito. Você pode escolher o método no checkout.",
    },
    {
      id: "5",
      question: "Como faço para reportar um problema com meu pedido?",
      answer:
        "Se houver algum problema com seu pedido, entre em contato conosco através do chat de suporte ou envie um email para support@zezinhodelivery.com",
    },
    {
      id: "6",
      question: "Posso modificar meu pedido após confirmar?",
      answer:
        "Você pode modificar seu pedido nos primeiros 5 minutos após a confirmação. Após esse período, entre em contato com o suporte.",
    },
  ];

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error("Digite uma mensagem");
      return;
    }
    toast.success("Mensagem enviada! Responderemos em breve.");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center text-red-600 hover:text-red-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Suporte</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="p-6 text-center hover:shadow-lg transition">
            <MessageSquare className="w-8 h-8 text-red-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Chat ao Vivo</h3>
            <p className="text-sm text-gray-600 mb-4">
              Converse com nosso time em tempo real
            </p>
            <Button className="w-full bg-red-600 hover:bg-red-700">Abrir Chat</Button>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition">
            <Phone className="w-8 h-8 text-red-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Telefone</h3>
            <p className="text-sm text-gray-600 mb-4">(11) 3000-0000</p>
            <Button variant="outline" className="w-full border-red-600 text-red-600">
              Ligar
            </Button>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition">
            <Mail className="w-8 h-8 text-red-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-sm text-gray-600 mb-4">support@zezinhodelivery.com</p>
            <Button variant="outline" className="w-full border-red-600 text-red-600">
              Enviar Email
            </Button>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="max-w-2xl mx-auto p-8 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-red-600" />
            Envie uma Mensagem
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assunto
              </label>
              <Input
                type="text"
                placeholder="Qual é o assunto?"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensagem
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Descreva seu problema ou dúvida..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
                rows={5}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Mensagem
            </Button>
          </div>
        </Card>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-red-600" />
            Perguntas Frequentes
          </h2>

          <div className="space-y-3">
            {faqItems.map(item => (
              <Card
                key={item.id}
                className="p-4 cursor-pointer hover:shadow-md transition"
                onClick={() =>
                  setExpandedFAQ(expandedFAQ === item.id ? null : item.id)
                }
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{item.question}</h3>
                  <div
                    className={`transform transition-transform ${
                      expandedFAQ === item.id ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                </div>
                {expandedFAQ === item.id && (
                  <p className="mt-4 text-gray-600 text-sm">{item.answer}</p>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Support Hours */}
        <Card className="max-w-2xl mx-auto mt-12 p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Horário de Atendimento</h3>
              <p className="text-sm text-blue-800">
                Segunda a sexta: 8h às 22h<br />
                Sábado e domingo: 10h às 20h
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
