import axios from 'axios';
import { ENV } from './_core/env';

const NBPAY_BASE_URL = 'https://api.nbpay.com.br';

interface NBPayQRCodeResponse {
  qrCode: string;
  transactionId: string;
  expiresIn: number;
  amount: number;
}

interface NBPayWebhookPayload {
  transactionId: string;
  status: 'paid' | 'pending' | 'failed' | 'expired';
  amount: number;
  timestamp: string;
  signature: string;
}

/**
 * Gera um QR Code Pix para pagamento
 */
export async function generatePixQRCode(
  amount: number,
  orderId: number,
  description: string
): Promise<NBPayQRCodeResponse> {
  try {
    const response = await axios.post(
      `${NBPAY_BASE_URL}/v1/pix/qrcode`,
      {
        amount: amount * 100, // Converter para centavos
        orderId: orderId.toString(),
        description: description,
        expiresIn: 3600, // 1 hora
      },
      {
        headers: {
          'Authorization': `Bearer ${ENV.nbpayApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      qrCode: response.data.qrCode,
      transactionId: response.data.transactionId,
      expiresIn: response.data.expiresIn,
      amount: amount,
    };
  } catch (error: any) {
    console.error('[NBPay] Erro ao gerar QR Code:', error.response?.data || error.message);
    throw new Error('Erro ao gerar QR Code Pix');
  }
}

/**
 * Verifica o status de um pagamento Pix
 */
export async function checkPixPaymentStatus(transactionId: string): Promise<{
  status: 'paid' | 'pending' | 'failed' | 'expired';
  amount: number;
  paidAt?: string;
}> {
  try {
    const response = await axios.get(
      `${NBPAY_BASE_URL}/v1/pix/transactions/${transactionId}`,
      {
        headers: {
          'Authorization': `Bearer ${ENV.nbpayApiKey}`,
        },
      }
    );

    return {
      status: response.data.status,
      amount: response.data.amount / 100, // Converter de centavos
      paidAt: response.data.paidAt,
    };
  } catch (error: any) {
    console.error('[NBPay] Erro ao verificar status:', error.response?.data || error.message);
    throw new Error('Erro ao verificar status do pagamento');
  }
}

/**
 * Valida assinatura do webhook do NBPay
 */
export function validateWebhookSignature(payload: string, signature: string): boolean {
  try {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', ENV.nbpaySecretKey)
      .update(payload)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('[NBPay] Erro ao validar assinatura:', error);
    return false;
  }
}

/**
 * Reembolsa um pagamento Pix
 */
export async function refundPixPayment(transactionId: string): Promise<{
  success: boolean;
  refundId: string;
}> {
  try {
    const response = await axios.post(
      `${NBPAY_BASE_URL}/v1/pix/refunds`,
      {
        transactionId: transactionId,
      },
      {
        headers: {
          'Authorization': `Bearer ${ENV.nbpayApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      refundId: response.data.refundId,
    };
  } catch (error: any) {
    console.error('[NBPay] Erro ao reembolsar:', error.response?.data || error.message);
    throw new Error('Erro ao reembolsar pagamento');
  }
}
