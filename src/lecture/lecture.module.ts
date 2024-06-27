import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application, Lecture } from './entities/lecture.entity';
import { LectureController } from './lecture.controller';
import { LectureService } from './lecture.service';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'lecturedata.db',
            entities: [Lecture, Application], // - 구동시 entity파일 자동 로드
            // synchronize: true, // - 서비스 구동시 entity와 디비의 테이블 싱크 개발만 할것
            // logging: true, // - orm 사용시 로그 남기기
        }),
        TypeOrmModule.forFeature([Lecture, Application]),
    ],
    controllers: [LectureController],
    providers: [LectureService],
})
export class LectureModule {}
