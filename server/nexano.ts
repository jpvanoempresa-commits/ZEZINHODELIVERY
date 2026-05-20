import { ENV } from "./_core/env";

export async function transferPixNexano(
  amount: number,
  pixKey: string,
  description: string
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  try {
    // Integração com Nexano para transferência Pix
    // TODO: Implementar chamada real para API Nexano
    
    console.log(`[Nexano] Transferência Pix: R$${amount.toFixed(2)} para ${pixKey}`);
    
    // Simulação de resposta bem-sucedida
    const transactionId = `NEX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      transactionId,
    };
  } catch (error: any) {
    console.error("[Nexano] Erro na transferência:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function validatePixKey(pixKey: string): Promise<boolean> {
  // Validar se a chave Pix é válida
  // Pode ser email, telefone, CPF ou chave aleatória
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{11}$/;
  const cpfRegex = /^\d{11}$/;
  const randomKeyRegex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
  
  return (
    emailRegex.test(pixKey) ||
    phoneRegex.test(pixKey) ||
    cpfRegex.test(pixKey) ||
    randomKeyRegex.test(pixKey)
  );
}
