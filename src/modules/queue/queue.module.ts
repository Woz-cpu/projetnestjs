import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.service';
import { DemoProcessor } from './demo.processor';

@Module({
  imports: [
    // Configuration globale de BullMQ
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
    // Enregistrement de la queue "demo"
    BullModule.registerQueue({
      name: 'demo',
    }),
  ],
  providers: [QueueService, DemoProcessor],
  exports: [QueueService, BullModule],
})
export class QueueModule {}
