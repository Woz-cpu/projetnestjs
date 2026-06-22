import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export interface SendMailOptions {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter;

  constructor() {
    // Configuration pour Mailpit (en développement)
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'localhost',
      port: parseInt(process.env.MAIL_PORT || '1025', 10),
      secure: false, // Mailpit n'utilise pas TLS
      ignoreTLS: true,
    });

    this.logger.log(
      `Mail service configuré pour ${process.env.MAIL_HOST || 'localhost'}:${process.env.MAIL_PORT || '1025'}`,
    );
  }

  /**
   * Envoie un email
   * @param options Options de l'email (to, subject, body, html)
   * @returns Informations sur l'envoi
   */
  async sendMail(options: SendMailOptions) {
    const { to, subject, body, html } = options;

    try {
      const info = await this.transporter.sendMail({
        from: '"Mon Application" <noreply@monapp.local>',
        to,
        subject,
        text: body,
        html: html || `<p>${body}</p>`,
      });

      this.logger.log(`Email envoyé à ${to}: ${info.messageId}`);

      return {
        success: true,
        messageId: info.messageId,
        to,
        subject,
      };
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email à ${to}:`, error);
      throw error;
    }
  }

  /**
   * Vérifie la connexion au serveur SMTP
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('Connexion au serveur mail OK');
      return true;
    } catch (error) {
      this.logger.error('Erreur de connexion au serveur mail:', error);
      return false;
    }
  }
}
