declare module '@emailjs/browser' {
  interface EmailJSResponseStatus {
    status: number;
    text: string;
  }

  interface SendOptions {
    serviceId: string;
    templateId: string;
    templateParams: Record<string, any>;
    publicKey: string;
  }

  export function send(
    serviceId: string,
    templateId: string,
    templateParams: Record<string, any>,
    publicKey: string
  ): Promise<EmailJSResponseStatus>;

  export function init(publicKey: string): void;
}
