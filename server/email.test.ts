import { describe, it, expect } from 'vitest';
import { sendEmail } from './emailService';

describe('SendGrid Email Service', () => {
  it('should validate SendGrid API key is configured', async () => {
    // Check that SENDGRID_API_KEY exists
    expect(process.env.SENDGRID_API_KEY).toBeDefined();
    expect(process.env.SENDGRID_API_KEY).not.toBe('');
  });

  it('should send a test email successfully', async () => {
    const result = await sendEmail({
      to: process.env.QUOTE_NOTIFICATION_EMAIL || 'info@critzerscabinets.com',
      subject: 'Test Email - SendGrid Configuration',
      text: 'This is a test email to verify SendGrid is configured correctly for the Critzer\'s Cabinet quote system.',
      html: '<p>This is a test email to verify SendGrid is configured correctly for the Critzer\'s Cabinet quote system.</p>',
    });

    // Should return true if email sent successfully
    expect(result).toBe(true);
  }, 15000); // 15 second timeout for API call
});
