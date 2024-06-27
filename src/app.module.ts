import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LectureController } from './lecture/lecture.controller';
import { LectureModule } from './lecture/lecture.module';
import { LectureService } from './lecture/lecture.service';

@Module({
    imports: [LectureModule],
    controllers: [AppController, LectureController],
    providers: [AppService, LectureService],
})
export class AppModule {}
