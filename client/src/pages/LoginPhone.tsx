import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Phone, ArrowLeft } from "lucide-react";

export default function LoginPhone() {
  const [, setLocation] = useLocation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      setError("Por favor, insira seu número de telefone");
      return;
    }
    
    // Validar formato do telefone (11 dígitos)
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (cleanPhone.length !== 11) {
      setError("Por favor, insira um número de telefone válido (11 dígitos)");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      // Aqui você faria uma chamada para enviar o OTP
      // await trpc.auth.sendOTP.mutate({ phoneNumber: cleanPhone });
      setStep("otp");
    } catch (err) {
      setError("Erro ao enviar código. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError("Por favor, insira o código OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Aqui você faria uma chamada para verificar o OTP
      // await trpc.auth.verifyOTP.mutate({ phoneNumber: cleanPhone, otp });
      setLocation("/");
    } catch (err) {
      setError("Código inválido. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <button 
            onClick={() => setLocation("/login")}
            className="flex items-center text-red-600 hover:text-red-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </button>

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Phone className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-red-600">Zezinho Delivery</h1>
            <p className="text-gray-600 mt-2">
              {step === "phone" ? "Insira seu telefone" : "Insira o código enviado"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {step === "phone" ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Número de Telefone</label>
                  <Input
                    type="tel"
                    placeholder="(11) 98765-4321"
                    value={formatPhoneNumber(phoneNumber)}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2">Incluindo DDD (ex: 11, 21, 85)</p>
                </div>

                <Button 
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={handleSendOTP}
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar Código"}
                </Button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Código OTP</label>
                  <p className="text-sm text-gray-600 mb-3">
                    Enviamos um código para <strong>{formatPhoneNumber(phoneNumber)}</strong>
                  </p>
                  <Input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                  />
                </div>

                <Button 
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={handleVerifyOTP}
                  disabled={isLoading}
                >
                  {isLoading ? "Verificando..." : "Verificar Código"}
                </Button>

                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                  }}
                >
                  Usar outro número
                </Button>
              </>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Não tem conta?{" "}
              <button
                onClick={() => setLocation("/register")}
                className="text-red-600 font-semibold hover:underline"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
