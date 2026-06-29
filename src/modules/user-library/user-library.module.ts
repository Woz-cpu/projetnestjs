import { Module } from '@nestjs/common';
import { UserLibraryController } from './user-library.controller';
import { UserLibraryService } from './user-library.service';

@Module({
    controllers : [UserLibraryController],
    providers : [UserLibraryService],
    exports : [UserLibraryService],
})
export class UserLibraryModule {}
