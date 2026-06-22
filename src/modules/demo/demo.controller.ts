import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { CacheService } from '../cache/cache.service';
import { QueueService } from '../queue/queue.service';
import { SendMailDto, SetCacheDto, AddJobDto } from './demo.dto';

/**
 * Controller de démonstration
 * Expose des endpoints pour tester les différents services :
 * - Mail (envoi via Mailpit)
 * - Cache (stockage Redis)
 * - Queue (jobs asynchrones avec BullMQ)
 */
@Controller('demo')
export class DemoController {
  private readonly logger = new Logger(DemoController.name);

  constructor(
    private readonly mailService: MailService,
    private readonly cacheService: CacheService,
    private readonly queueService: QueueService,
  ) {}

  // ============================================
  // ENDPOINTS MAIL
  // ============================================

  /**
   * POST /demo/mail/send
   * Envoie un email de test (capturé par Mailpit)
   */
  @Post('mail/send')
  async sendMail(@Body() dto: SendMailDto) {
    this.logger.log(`Envoi d'un email à ${dto.to}`);
    return this.mailService.sendMail({
      to: dto.to,
      subject: dto.subject,
      body: dto.body,
    });
  }

  /**
   * GET /demo/mail/status
   * Vérifie la connexion au serveur mail
   */
  @Get('mail/status')
  async mailStatus() {
    const connected = await this.mailService.verifyConnection();
    return {
      service: 'mail',
      connected,
      host: process.env.MAIL_HOST || 'localhost',
      port: process.env.MAIL_PORT || '1025',
    };
  }

  // ============================================
  // ENDPOINTS CACHE
  // ============================================

  /**
   * POST /demo/cache/set
   * Stocke une valeur dans le cache Redis
   */
  @Post('cache/set')
  async setCache(@Body() dto: SetCacheDto) {
    await this.cacheService.set(dto.key, dto.value, dto.ttl);
    return {
      success: true,
      key: dto.key,
      value: dto.value,
      ttl: dto.ttl || 'default (60s)',
    };
  }

  /**
   * GET /demo/cache/get/:key
   * Récupère une valeur du cache
   */
  @Get('cache/get/:key')
  async getCache(@Param('key') key: string) {
    const value = await this.cacheService.get(key);
    return {
      key,
      value,
      found: value !== undefined,
    };
  }

  /**
   * Post /demo/cache/delete/:key
   * Supprime une valeur du cache
   */
  @Post('cache/delete/:key')
  async deleteCache(@Param('key') key: string) {
    await this.cacheService.del(key);
    return {
      success: true,
      key,
      deleted: true,
    };
  }

  // ============================================
  // ENDPOINTS QUEUE
  // ============================================

  /**
   * POST /demo/queue/add
   * Ajoute un job à la queue
   */
  @Post('queue/add')
  async addJob(@Body() dto: AddJobDto) {
    this.logger.log(`Ajout d'un job "${dto.jobName}" à la queue`);
    return this.queueService.addJob(dto.jobName, dto.data || {});
  }

  /**
   * POST /demo/queue/add-delayed
   * Ajoute un job différé (exécuté après un délai)
   */
  @Post('queue/add-delayed')
  async addDelayedJob(
    @Body() dto: AddJobDto & { delayMs?: number },
  ) {
    const delay = dto.delayMs || 5000; // 5 secondes par défaut
    this.logger.log(`Ajout d'un job différé "${dto.jobName}" (délai: ${delay}ms)`);
    return this.queueService.addDelayedJob(dto.jobName, dto.data || {}, delay);
  }

  /**
   * GET /demo/queue/stats
   * Récupère les statistiques de la queue
   */
  @Get('queue/stats')
  async queueStats() {
    return this.queueService.getQueueStats();
  }

  // ============================================
  // ENDPOINT SANTÉ GLOBALE
  // ============================================

  /**
   * GET /demo/health
   * Vérifie l'état de tous les services
   */
  @Get('health')
  async healthCheck() {
    const mailConnected = await this.mailService.verifyConnection();
    const queueStats = await this.queueService.getQueueStats();

    // Test rapide du cache
    const testKey = `health-check-${Date.now()}`;
    await this.cacheService.set(testKey, 'ok', 10);
    const cacheValue = await this.cacheService.get(testKey);
    await this.cacheService.del(testKey);

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        mail: {
          connected: mailConnected,
        },
        cache: {
          connected: cacheValue === 'ok',
        },
        queue: {
          connected: true,
          stats: queueStats,
        },
      },
    };
  }
}
