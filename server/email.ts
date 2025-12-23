import nodemailer from 'nodemailer';
import { ENV } from './_core/env.js';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    if (!ENV.emailUser || !ENV.emailPassword) {
      console.warn('[Email] Email credentials not configured - emails will not be sent');
      // Return a test transporter that logs instead of sending
      transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true,
      });
    } else {
      transporter = nodemailer.createTransport({
        host: ENV.emailHost,
        port: ENV.emailPort,
        secure: ENV.emailPort === 465,
        auth: {
          user: ENV.emailUser,
          pass: ENV.emailPassword,
        },
      });
    }
  }
  return transporter;
}

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  orderItems: Array<{
    name: string;
    sku: string;
    quantity: number;
    price: string;
    subtotal: string;
  }>;
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  shippingAddress: string;
  shippingMethod: string;
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmation(data: OrderEmailData): Promise<void> {
  const transporter = getTransporter();

  const itemsHtml = data.orderItems
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong><br>
          <span style="color: #666; font-size: 14px;">SKU: ${item.sku}</span>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.subtotal}</td>
      </tr>
    `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #8B4513; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .order-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; }
        th { background-color: #f5f5f5; padding: 10px; text-align: left; }
        .total-row { font-weight: bold; font-size: 18px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Your Order!</h1>
        </div>

        <div class="content">
          <p>Dear ${data.customerName},</p>

          <p>We've received your order and will begin processing it right away. You'll receive another email with tracking information once your order ships.</p>

          <div class="order-details">
            <h2>Order #${data.orderNumber}</h2>

            <h3>Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <table style="margin-top: 20px;">
              <tr>
                <td style="padding: 5px; text-align: right;"><strong>Subtotal:</strong></td>
                <td style="padding: 5px; text-align: right; width: 100px;">$${data.subtotal}</td>
              </tr>
              <tr>
                <td style="padding: 5px; text-align: right;"><strong>Shipping (${data.shippingMethod}):</strong></td>
                <td style="padding: 5px; text-align: right;">$${data.shipping}</td>
              </tr>
              <tr>
                <td style="padding: 5px; text-align: right;"><strong>Tax:</strong></td>
                <td style="padding: 5px; text-align: right;">$${data.tax}</td>
              </tr>
              <tr class="total-row">
                <td style="padding: 10px; text-align: right; border-top: 2px solid #333;"><strong>Total:</strong></td>
                <td style="padding: 10px; text-align: right; border-top: 2px solid #333;">$${data.total}</td>
              </tr>
            </table>

            <h3 style="margin-top: 30px;">Shipping Address</h3>
            <p style="white-space: pre-line;">${data.shippingAddress}</p>
          </div>

          <p>If you have any questions about your order, please don't hesitate to contact us at ${ENV.emailFrom} or call (434) 973-1691.</p>

          <p>Thank you for choosing Critzer's Cabinets!</p>
        </div>

        <div class="footer">
          <p>Critzer's Cabinet Creations, Inc.<br>
          661 Berkmar Court, Charlottesville, VA 22901<br>
          (434) 973-1691 | info@critzerscabinets.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Critzer's Cabinets" <${ENV.emailFrom}>`,
      to: data.customerEmail,
      subject: `Order Confirmation - #${data.orderNumber}`,
      html,
    });
    console.log(`[Email] Order confirmation sent to ${data.customerEmail}`);
  } catch (error) {
    console.error('[Email] Failed to send order confirmation:', error);
    throw error;
  }
}

/**
 * Send admin notification about new order
 */
export async function sendAdminOrderNotification(data: OrderEmailData): Promise<void> {
  const transporter = getTransporter();

  const itemsList = data.orderItems
    .map((item) => `- ${item.name} (SKU: ${item.sku}) - Qty: ${item.quantity} - $${item.subtotal}`)
    .join('\n');

  const text = `
New Hardware Order Received!

Order Number: ${data.orderNumber}
Customer: ${data.customerName}
Email: ${data.customerEmail}

Items:
${itemsList}

Subtotal: $${data.subtotal}
Shipping: $${data.shipping} (${data.shippingMethod})
Tax: $${data.tax}
TOTAL: $${data.total}

Shipping Address:
${data.shippingAddress}

Action Required:
1. Log into Top Knobs dealer portal
2. Place order for the items listed above
3. Update order status in admin dashboard
4. Add tracking number once shipped
  `;

  try {
    await transporter.sendMail({
      from: `"Critzer's Cabinets Store" <${ENV.emailFrom}>`,
      to: ENV.emailFrom,
      subject: `🛒 New Order #${data.orderNumber} - ${data.customerName}`,
      text,
    });
    console.log(`[Email] Admin notification sent for order ${data.orderNumber}`);
  } catch (error) {
    console.error('[Email] Failed to send admin notification:', error);
    // Don't throw - admin notification is not critical
  }
}

/**
 * Send shipping confirmation with tracking number
 */
export async function sendShippingConfirmation(
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  trackingNumber: string,
  carrier: string = 'USPS'
): Promise<void> {
  const transporter = getTransporter();

  const trackingUrl =
    carrier.toLowerCase() === 'usps'
      ? `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`
      : `https://www.google.com/search?q=${carrier}+tracking+${trackingNumber}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #8B4513; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .tracking-box { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; border: 2px solid #8B4513; }
        .tracking-number { font-size: 24px; font-weight: bold; color: #8B4513; text-align: center; margin: 10px 0; }
        .button { display: inline-block; padding: 12px 24px; background-color: #8B4513; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📦 Your Order Has Shipped!</h1>
        </div>

        <div class="content">
          <p>Dear ${customerName},</p>

          <p>Great news! Your order #${orderNumber} has been shipped and is on its way to you.</p>

          <div class="tracking-box">
            <h2 style="margin-top: 0;">Tracking Information</h2>
            <p><strong>Carrier:</strong> ${carrier}</p>
            <p><strong>Tracking Number:</strong></p>
            <div class="tracking-number">${trackingNumber}</div>
            <div style="text-align: center;">
              <a href="${trackingUrl}" class="button">Track Your Package</a>
            </div>
          </div>

          <p>Your hardware will arrive within the estimated delivery time based on your selected shipping method. If you have any questions, please contact us at ${ENV.emailFrom} or call (434) 973-1691.</p>

          <p>Thank you for choosing Critzer's Cabinets!</p>
        </div>

        <div class="footer">
          <p>Critzer's Cabinet Creations, Inc.<br>
          661 Berkmar Court, Charlottesville, VA 22901<br>
          (434) 973-1691 | info@critzerscabinets.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Critzer's Cabinets" <${ENV.emailFrom}>`,
      to: customerEmail,
      subject: `Your Order Has Shipped! - #${orderNumber}`,
      html,
    });
    console.log(`[Email] Shipping confirmation sent to ${customerEmail}`);
  } catch (error) {
    console.error('[Email] Failed to send shipping confirmation:', error);
    throw error;
  }
}
