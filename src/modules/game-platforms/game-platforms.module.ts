import { Module } from '@nestjs/common';
import { GamePlatformsController } from './game-platforms.controller';
import { GamePlatformsService } from './game-platforms.service';

@Module({
    controllers : [GamePlatformsController],
    providers : [GamePlatformsService],
    exports : [GamePlatformsService],
})
export class GamePlatformsModule {}
