import Stripe from 'stripe';
import { ENV } from './_core/env.js';

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripe) {
    if (!ENV.stripeSecretKey) {
      throw new Error('Stripe secret key not configured');
    }
    stripe = new Stripe(ENV.stripeSecretKey, {
      typescript: true,
    });
  }
  return stripe;
}

export interface ShippingCalculation {
  subtotal: number;
  shippingCost: number;
  shippingMethod: string;
}

/**
 * Calculate shipping costs based on order total and shipping method
 *
 * Pricing:
 * - Standard (5-7 business days): $9.95 for orders under $100, FREE for $100+
 * - Expedited (2-3 business days): $19.95 for orders under $100, $14.95 for $100+
 * - Express (Next day): $29.95 flat rate
 */
export function calculateShipping(
  subtotal: number,
  method: 'standard' | 'expedited' | 'express' = 'standard'
): ShippingCalculation {
  let shippingCost = 0;
  let shippingMethod = '';

  switch (method) {
    case 'standard':
      shippingMethod = 'Standard Shipping (5-7 business days)';
      shippingCost = subtotal >= 100 ? 0 : 9.95;
      break;
    case 'expedited':
      shippingMethod = 'Expedited Shipping (2-3 business days)';
      shippingCost = subtotal >= 100 ? 14.95 : 19.95;
      break;
    case 'express':
      shippingMethod = 'Express Shipping (Next day)';
      shippingCost = 29.95;
      break;
    default:
      shippingMethod = 'Standard Shipping (5-7 business days)';
      shippingCost = subtotal >= 100 ? 0 : 9.95;
  }

  return {
    subtotal,
    shippingCost,
    shippingMethod,
  };
}

/**
 * Calculate Virginia sales tax (5.3%)
 */
export function calculateTax(subtotal: number, shipping: number): number {
  const taxableAmount = subtotal + shipping;
  return Math.round(taxableAmount * 0.053 * 100) / 100;
}

/**
 * Create a Stripe Payment Intent for checkout
 */
export async function createPaymentIntent(
  amount: number,
  customerEmail: string,
  orderNumber: string,
  metadata?: Record<string, string>
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripe();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    receipt_email: customerEmail,
    metadata: {
      orderNumber,
      ...metadata,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
}

/**
 * Retrieve a Payment Intent
 */
export async function getPaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripe();
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}

/**
 * Cancel a Payment Intent
 */
export async function cancelPaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripe();
  return await stripe.paymentIntents.cancel(paymentIntentId);
}
