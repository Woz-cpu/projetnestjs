import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('demo')
export class DemoProcessor extends WorkerHost {
  private readonly logger = new Logger(DemoProcessor.name);

  /**
   * Traite les jobs de la queue "demo"
   * C'est ici que tu mets la logique métier pour chaque job
   */
  async process(job: Job<unknown, unknown, string>): Promise<unknown> {
    this.logger.log(`Traitement du job "${job.name}" (ID: ${job.id})`);
    this.logger.debug(`Données du job:`, job.data);

    // Simulation d'un traitement qui prend du temps
    await this.simulateWork(2000);

    // Mise à jour de la progression
    await job.updateProgress(50);

    // Encore un peu de travail...
    await this.simulateWork(1000);

    await job.updateProgress(100);

    const result = {
      processedAt: new Date().toISOString(),
      jobName: job.name,
      data: job.data,
    };

    this.logger.log(`Job "${job.name}" (ID: ${job.id}) terminé avec succès`);

    return result;
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} complété`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job?.id} échoué: ${error.message}`);
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job, progress: number | object) {
    this.logger.debug(`Job ${job.id} progression: ${JSON.stringify(progress)}`);
  }

  private simulateWork(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
