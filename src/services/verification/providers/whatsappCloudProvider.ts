// ====================================================================
// META WHATSAPP BUSINESS CLOUD API PROVIDER
// Platform: https://kriblasemsar.com
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/
// ====================================================================

import { IVerificationProvider, VerificationChannel } from '../types';

export interface WhatsAppCloudConfig {
  apiToken: string;
  phoneNumberId: string;
  templateName?: string;
  languageCode?: string;
}

export class WhatsAppCloudProvider implements IVerificationProvider {
  name = 'MetaWhatsAppCloud';
  channel: VerificationChannel = 'whatsapp';

  private config: WhatsAppCloudConfig;

  constructor(config?: Partial<WhatsAppCloudConfig>) {
    const env = (import.meta as any).env || {};
    this.config = {
      apiToken: config?.apiToken || env.VITE_WHATSAPP_API_TOKEN || '',
      phoneNumberId: config?.phoneNumberId || env.VITE_WHATSAPP_PHONE_NUMBER_ID || '',
      templateName: config?.templateName || 'kriblasemsar_otp_auth',
      languageCode: config?.languageCode || 'fr'
    };
  }

  async sendOtp(phoneE164: string, otpCode: string): Promise<{ success: boolean; providerRef?: string; error?: string }> {
    if (!this.config.apiToken || !this.config.phoneNumberId) {
      return {
        success: false,
        error: 'Passerelle WhatsApp Business officielle en attente de configuration. Les privilèges réservés aux numéros vérifiés restent désactivés pour protéger la communauté contre les semsars.'
      };
    }

    // Format recipient without the leading +
    const recipient = phoneE164.replace('+', '');

    try {
      const url = `https://graph.facebook.com/v18.0/${this.config.phoneNumberId}/messages`;
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipient,
        type: 'template',
        template: {
          name: this.config.templateName,
          language: { code: this.config.languageCode },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: otpCode }
              ]
            },
            {
              type: 'button',
              sub_type: 'url',
              index: '0',
              parameters: [
                { type: 'text', text: otpCode }
              ]
            }
          ]
        }
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return {
          success: false,
          error: `Erreur WhatsApp Cloud API (${res.status}): ${JSON.stringify(errorData)}`
        };
      }

      const data = await res.json();
      return {
        success: true,
        providerRef: data?.messages?.[0]?.id
      };
    } catch (err: any) {
      return {
        success: false,
        error: `Échec de connexion WhatsApp Cloud API: ${err.message}`
      };
    }
  }
}
