import emailjs from '@emailjs/browser';

// Replace these with your actual EmailJS credentials
const EMAIL_SERVICE_ID = process.env.REACT_APP_EMAIL_SERVICE_ID || 'service_aiwomyw';  // Your EmailJS service ID
const EMAIL_TEMPLATE_ID = process.env.REACT_APP_EMAIL_TEMPLATE_ID || 'template_jayhz2y'; // Your EmailJS template ID
const EMAIL_PUBLIC_KEY = process.env.REACT_APP_EMAIL_PUBLIC_KEY || 'pCruUNl_sOjz6Zalq'; // Your EmailJS public key
const ADMIN_EMAIL = 'pshealthcarelab@gmail.com';

interface EmailParams {
  subject: string;
  message: string;
  details: Record<string, string>;
}

export const sendAdminNotification = async ({ subject, message, details }: EmailParams) => {
  try {
    const templateParams = {
      to_email: ADMIN_EMAIL,
      subject,
      message,
      details: Object.entries(details)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n'),
    };

    const response = await emailjs.send(
      EMAIL_SERVICE_ID,
      EMAIL_TEMPLATE_ID,
      templateParams,
      EMAIL_PUBLIC_KEY
    );

    return response;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    throw error;
  }
};
