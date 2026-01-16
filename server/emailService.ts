/**
 * Email Service using SendGrid
 * Sends transactional emails for quote notifications
 */

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Send email using SendGrid API
 */
export async function sendEmail({ to, subject, text, html }: SendEmailParams): Promise<boolean> {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@critzerscabinets.com';
  const FROM_NAME = process.env.FROM_NAME || "Critzer's Cabinet Creations";

  if (!SENDGRID_API_KEY) {
    console.error('[sendEmail] SENDGRID_API_KEY not configured');
    return false;
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
            subject,
          },
        ],
        from: {
          email: FROM_EMAIL,
          name: FROM_NAME,
        },
        content: [
          {
            type: 'text/plain',
            value: text,
          },
          ...(html ? [{
            type: 'text/html',
            value: html,
          }] : []),
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[sendEmail] SendGrid API error:', error);
      return false;
    }

    console.log('[sendEmail] Email sent successfully to:', to);
    return true;
  } catch (error) {
    console.error('[sendEmail] Failed to send email:', error);
    return false;
  }
}

/**
 * Send quote notification email to business owner
 */
export async function sendQuoteNotification(quote: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  projectDescription?: string;
  quoteId: number;
  // Project details
  roomType?: string;
  doorStyle?: string;
  woodSpecies?: string;
  finish?: string;
  countertopType?: string;
  linearFeet?: string;
  dimensions?: string;
  // Educational questions
  currentCondition?: string;
  timeline?: string;
  budgetRange?: string;
  stylePreference?: string;
  specialFeatures?: string;
  referralSource?: string;
  estimatedPrice?: number;
}): Promise<boolean> {
  const TO_EMAIL = process.env.QUOTE_NOTIFICATION_EMAIL || 'info@critzerscabinets.com';

  const subject = `New Quote Request from ${quote.customerName}`;
  
  const formatLabel = (key: string): string => {
    return key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const projectDetails = [
    quote.roomType && `Room Type: ${formatLabel(quote.roomType)}`,
    quote.doorStyle && `Door Style: ${formatLabel(quote.doorStyle)}`,
    quote.woodSpecies && `Wood Species: ${formatLabel(quote.woodSpecies)}`,
    quote.finish && `Finish: ${formatLabel(quote.finish)}`,
    quote.countertopType && `Countertop: ${formatLabel(quote.countertopType)}`,
    quote.linearFeet && `Linear Feet: ${quote.linearFeet}`,
    quote.dimensions && `Dimensions: ${quote.dimensions}`,
    quote.estimatedPrice && `Estimated Price: $${quote.estimatedPrice.toLocaleString()}`,
  ].filter(Boolean).join('\n- ');

  const additionalInfo = [
    quote.currentCondition && `Current Condition: ${formatLabel(quote.currentCondition)}`,
    quote.timeline && `Timeline: ${formatLabel(quote.timeline)}`,
    quote.budgetRange && `Budget Range: ${formatLabel(quote.budgetRange)}`,
    quote.stylePreference && `Style Preference: ${formatLabel(quote.stylePreference)}`,
    quote.specialFeatures && `Special Features: ${formatLabel(quote.specialFeatures)}`,
    quote.referralSource && `How They Found Us: ${formatLabel(quote.referralSource)}`,
  ].filter(Boolean).join('\n- ');

  const text = `
New Quote Request Received

Customer Information:
- Name: ${quote.customerName}
- Email: ${quote.customerEmail}
- Phone: ${quote.customerPhone || 'Not provided'}

Project Details:
${projectDetails || 'No details provided'}

${additionalInfo ? `Additional Information:\n- ${additionalInfo}` : ''}

${quote.projectDescription ? `Additional Notes:\n${quote.projectDescription}` : ''}

Quote ID: ${quote.quoteId}

---
This is an automated notification from your website quote system.
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #2c5530; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .info-row { margin: 10px 0; }
    .label { font-weight: bold; color: #2c5530; }
    .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Quote Request</h1>
    </div>
    <div class="content">
      <h2>Customer Information</h2>
      <div class="info-row">
        <span class="label">Name:</span> ${quote.customerName}
      </div>
      <div class="info-row">
        <span class="label">Email:</span> <a href="mailto:${quote.customerEmail}">${quote.customerEmail}</a>
      </div>
      <div class="info-row">
        <span class="label">Phone:</span> ${quote.customerPhone || 'Not provided'}
      </div>
      
      <h2>Project Details</h2>
      ${projectDetails ? projectDetails.split('\n- ').map(detail => `<div class="info-row">${detail.replace(/^(.+?):\s*/, '<span class="label">$1:</span> ')}</div>`).join('') : '<p>No details provided</p>'}
      
      ${additionalInfo ? `<h2>Additional Information</h2>
      ${additionalInfo.split('\n- ').map(detail => `<div class="info-row">${detail.replace(/^(.+?):\s*/, '<span class="label">$1:</span> ')}</div>`).join('')}` : ''}
      
      ${quote.projectDescription ? `<h2>Additional Notes</h2>
      <p>${quote.projectDescription}</p>` : ''}
      
      <div class="info-row">
        <span class="label">Quote ID:</span> ${quote.quoteId}
      </div>
    </div>
    <div class="footer">
      <p>This is an automated notification from your website quote system at critzerscabinets.com</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return await sendEmail({
    to: TO_EMAIL,
    subject,
    text,
    html,
  });
}
