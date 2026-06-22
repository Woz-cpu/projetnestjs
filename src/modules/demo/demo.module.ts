import { Module } from '@nestjs/common';
import { DemoController } from './demo.controller';
import { MailModule } from '../mail/mail.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [MailModule, QueueModule],
  controllers: [DemoController],
})
export class DemoModule {}
