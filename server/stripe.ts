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
 * Create a Stripe Checkout Session with dynamic line items
 * Uses price_data so we don't need pre-created Stripe products
 */
export async function createCheckoutSession(
  items: Array<{
    name: string;
    sku: string;
    unitPrice: number; // in dollars
    quantity: number;
    imageUrl?: string | null;
  }>,
  successUrl: string,
  cancelUrl: string,
  metadata?: Record<string, string>
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: `SKU: ${item.sku}`,
          ...(item.imageUrl ? { images: [item.imageUrl] } : {}),
        },
        unit_amount: Math.round(item.unitPrice * 100), // Convert to cents
      },
      quantity: item.quantity,
    };
    return lineItem;
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items,
    shipping_address_collection: {
      allowed_countries: ['US'],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 0, currency: 'usd' },
          display_name: 'Standard Shipping (5-7 business days)',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 5 },
            maximum: { unit: 'business_day', value: 7 },
          },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 1495, currency: 'usd' },
          display_name: 'Expedited Shipping (2-3 business days)',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 2 },
            maximum: { unit: 'business_day', value: 3 },
          },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 2995, currency: 'usd' },
          display_name: 'Express Shipping (Next day)',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 1 },
            maximum: { unit: 'business_day', value: 1 },
          },
        },
      },
    ],
    automatic_tax: { enabled: false },
    payment_intent_data: {
      statement_descriptor_suffix: 'CRITZERS CAB',
    },
    branding_settings: { display_name: "Critzer's Cabinets" },
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: metadata || {},
  });

  return session;
}

/**
 * Retrieve a Checkout Session
 */
export async function getCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();
  return await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'shipping_details'],
  });
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
