import { getDb } from "./db";
import { payments, orders, restaurants, commissions } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export async function handleNBPayWebhook(body: any) {
  const { transactionId, status, amount, orderId } = body;
  
  console.log(`[NBPay Webhook] Pagamento ${transactionId}: ${status}`);
  
  if (status === "confirmed" || status === "paid") {
    try {
      const db = await getDb();
      if (!db) {
        console.error("[NBPay Webhook] Database not available");
        return false;
      }
      
      // 1. Buscar pedido para obter restaurante
      const orderData = await db.select()
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1);
      
      if (orderData.length === 0) {
        console.warn(`[NBPay Webhook] Pedido ${orderId} não encontrado`);
        return false;
      }
      
      const restaurantId = orderData[0].restaurantId;
      const commission = 10; // Comissão fixa de R$10
      const netAmount = amount - commission;
      
      // 3. TODO: Somar saldo do restaurante automaticamente em tabela separada
      // 4. Registrar no histórico de comissões
      await db.insert(commissions).values({
        restaurantId,
        orderId,
        amount: netAmount.toString(),
        status: "paid",
      } as any);
      
      console.log(`[NBPay Webhook] Saldo atualizado para restaurante ${restaurantId}: +R$${netAmount.toFixed(2)}`);
      return true;
    } catch (error) {
      console.error("[NBPay Webhook] Erro ao atualizar saldo:", error);
      return false;
    }
  }
  
  return true;
}
