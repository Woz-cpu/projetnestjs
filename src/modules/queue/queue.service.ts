import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, JobsOptions } from 'bullmq';

export interface JobData {
  [key: string]: unknown;
}

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(@InjectQueue('demo') private demoQueue: Queue) {
    this.logger.log('Queue service initialisé');
  }

  /**
   * Ajoute un job à la queue "demo"
   * @param name Nom du job
   * @param data Données du job
   * @param options Options du job (delay, attempts, etc.)
   */
  async addJob(name: string, data: JobData, options?: JobsOptions) {
    const job = await this.demoQueue.add(name, data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      ...options,
    });

    this.logger.log(`Job ajouté: ${name} (ID: ${job.id})`);

    return {
      id: job.id,
      name: job.name,
      data: job.data,
      timestamp: job.timestamp,
    };
  }

  /**
   * Ajoute un job différé
   * @param name Nom du job
   * @param data Données du job
   * @param delayMs Délai en millisecondes
   */
  async addDelayedJob(name: string, data: JobData, delayMs: number) {
    return this.addJob(name, data, { delay: delayMs });
  }

  /**
   * Récupère les statistiques de la queue
   */
  async getQueueStats() {
    const [waiting, active, completed, failed] = await Promise.all([
      this.demoQueue.getWaitingCount(),
      this.demoQueue.getActiveCount(),
      this.demoQueue.getCompletedCount(),
      this.demoQueue.getFailedCount(),
    ]);

    return {
      name: 'demo',
      waiting,
      active,
      completed,
      failed,
    };
  }
}
