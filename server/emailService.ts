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

function row(label: string, value: string | undefined | null): string {
  if (!value) return '';
  return `
    <tr>
      <td style="padding:8px 12px;font-weight:bold;color:#2c5530;background:#f0f5f0;width:35%;vertical-align:top;">${label}</td>
      <td style="padding:8px 12px;background:#fff;">${value}</td>
    </tr>`;
}

function textRow(label: string, value: string | undefined | null): string {
  if (!value) return '';
  return `${label}: ${value}\n`;
}

/**
 * Send quote notification email to business owner
 * Parses conversationData JSON to extract all form fields
 */
export async function sendQuoteNotification(quote: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  conversationData?: string;
  quoteId: number;
}): Promise<boolean> {
  const TO_EMAIL = process.env.QUOTE_NOTIFICATION_EMAIL || 'info@critzerscabinets.com';

  // Parse conversationData if available
  let projectData: Record<string, string> = {};
  let estimatedPrice: number | null = null;
  try {
    if (quote.conversationData) {
      const parsed = JSON.parse(quote.conversationData);
      projectData = parsed.projectData || {};
      estimatedPrice = parsed.estimatedPrice || null;
    }
  } catch {
    // If parsing fails, fall back to empty
  }

  const subject = `🏠 New Quote Request from ${quote.customerName} — Critzer's Cabinets`;

  // Plain text version
  const text = `
NEW QUOTE REQUEST — CRITZER'S CABINET CREATIONS
================================================

CUSTOMER INFORMATION
${textRow('Name', quote.customerName)}${textRow('Email', quote.customerEmail)}${textRow('Phone', quote.customerPhone || 'Not provided')}
PRELIMINARY ESTIMATE: ${estimatedPrice ? `$${estimatedPrice.toLocaleString()}` : 'Not calculated'}

PROJECT DETAILS
${textRow('Room Type', projectData.roomType)}${textRow('Door Style', projectData.doorStyle)}${textRow('Wood Species', projectData.woodSpecies)}${textRow('Finish', projectData.finish)}${textRow('Countertop', projectData.countertopType)}${textRow('Linear Feet', projectData.linearFeet ? projectData.linearFeet + ' ft' : '')}${textRow('Dimensions', projectData.dimensions)}
PROJECT BACKGROUND
${textRow('Current Condition', projectData.currentCondition)}${textRow('Timeline', projectData.projectTimeline)}${textRow('Budget Range', projectData.budgetRange)}${textRow('Style Preference', projectData.stylePreference)}${textRow('Special Features', projectData.specialFeatures)}${textRow('How They Found Us', projectData.referralSource)}
ADDITIONAL NOTES
${projectData.additionalNotes || 'None provided'}

Quote ID: ${quote.quoteId}
---
Automated notification from critzerscabinets.com
  `.trim();

  // HTML version
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;margin:0;padding:0;background:#f4f4f4;">
  <div style="max-width:640px;margin:20px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background:#2c5530;color:white;padding:24px 32px;text-align:center;">
      <h1 style="margin:0;font-size:22px;">🏠 New Quote Request</h1>
      <p style="margin:8px 0 0;opacity:0.85;font-size:14px;">Critzer's Cabinet Creations</p>
    </div>

    <!-- Estimate Banner -->
    ${estimatedPrice ? `
    <div style="background:#e8f5e9;border-bottom:3px solid #2c5530;padding:20px 32px;text-align:center;">
      <p style="margin:0;font-size:13px;color:#555;">Preliminary Estimate</p>
      <p style="margin:4px 0 0;font-size:36px;font-weight:bold;color:#2c5530;">$${estimatedPrice.toLocaleString()}</p>
      <p style="margin:4px 0 0;font-size:11px;color:#888;">*Rough estimate — final quote after consultation</p>
    </div>` : ''}

    <div style="padding:24px 32px;">

      <!-- Customer Info -->
      <h2 style="color:#2c5530;font-size:16px;border-bottom:2px solid #e0e0e0;padding-bottom:8px;margin-top:0;">Customer Information</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        ${row('Name', quote.customerName)}
        ${row('Email', `<a href="mailto:${quote.customerEmail}" style="color:#2c5530;">${quote.customerEmail}</a>`)}
        ${row('Phone', quote.customerPhone || 'Not provided')}
      </table>

      <!-- Project Details -->
      <h2 style="color:#2c5530;font-size:16px;border-bottom:2px solid #e0e0e0;padding-bottom:8px;">Project Details</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        ${row('Room Type', projectData.roomType)}
        ${row('Door Style', projectData.doorStyle)}
        ${row('Wood Species', projectData.woodSpecies)}
        ${row('Finish', projectData.finish)}
        ${row('Countertop', projectData.countertopType)}
        ${row('Linear Feet', projectData.linearFeet ? projectData.linearFeet + ' ft' : null)}
        ${row('Dimensions', projectData.dimensions)}
      </table>

      <!-- Project Background -->
      <h2 style="color:#2c5530;font-size:16px;border-bottom:2px solid #e0e0e0;padding-bottom:8px;">Project Background</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        ${row('Current Condition', projectData.currentCondition)}
        ${row('Timeline', projectData.projectTimeline)}
        ${row('Budget Range', projectData.budgetRange)}
        ${row('Style Preference', projectData.stylePreference)}
        ${row('Special Features', projectData.specialFeatures)}
        ${row('How They Found Us', projectData.referralSource)}
      </table>

      <!-- Additional Notes -->
      ${projectData.additionalNotes ? `
      <h2 style="color:#2c5530;font-size:16px;border-bottom:2px solid #e0e0e0;padding-bottom:8px;">Additional Notes</h2>
      <div style="background:#f9f9f9;border:1px solid #e0e0e0;border-radius:4px;padding:12px 16px;margin-bottom:24px;">
        <p style="margin:0;white-space:pre-wrap;">${projectData.additionalNotes}</p>
      </div>` : ''}

    </div>

    <!-- Footer -->
    <div style="background:#f4f4f4;padding:16px 32px;text-align:center;font-size:12px;color:#888;border-top:1px solid #e0e0e0;">
      <p style="margin:0;">Quote ID #${quote.quoteId} &nbsp;|&nbsp; Automated notification from <a href="https://critzerscabinets.com" style="color:#2c5530;">critzerscabinets.com</a></p>
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
