import { describe, it, expect } from 'vitest';
import { validateNBPayCredentials } from './db';

describe('NBPay Integration', () => {
  it('should validate NBPay API credentials', async () => {
    const apiKey = process.env.NBPAY_API_KEY;
    const secretKey = process.env.NBPAY_SECRET_KEY;

    expect(apiKey).toBeDefined();
    expect(secretKey).toBeDefined();
    expect(apiKey).toMatch(/^nxp_/);
    expect(secretKey).toBeTruthy();

    // Validate that credentials are properly formatted
    expect(apiKey?.length).toBeGreaterThan(20);
    expect(secretKey?.length).toBeGreaterThan(10);
  });

  it('should have valid NBPay configuration', async () => {
    const result = await validateNBPayCredentials();
    expect(result).toBe(true);
  });
});
