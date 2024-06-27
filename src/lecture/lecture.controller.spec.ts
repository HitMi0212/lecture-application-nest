import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application, Lecture } from './entities/lecture.entity';
import { LectureController } from './lecture.controller';
import { LectureService } from './lecture.service';
import { ApplicationDto } from './dto/application.dto';

describe('LectureController', () => {
    let controller: LectureController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: 'lecturedata.db',
                    entities: [Lecture, Application],
                    logging: true,
                    // synchronize: true,
                }),
                TypeOrmModule.forFeature([Lecture, Application]),
            ],
            controllers: [LectureController],
            providers: [LectureService],
        }).compile();

        controller = module.get<LectureController>(LectureController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('Get', () => {
        it('전체 강의 조회', async () => {
            const expectData: Lecture[] = [];
            const lecture: Lecture = new Lecture();
            lecture.LECTURE_ID = 1;
            lecture.LECTURE_NAME = 'nestjs';
            lecture.APPLICATION_DATE = '2024-06-25 13:00:00';
            lecture.LECTURE_LIMIT = 30;
            expectData.push(lecture);

            expect(await controller.getAllLectures()).toStrictEqual(expectData);
        });

        it('특정 강의 조회', async () => {
            const lectureId = 1;

            const expected = await controller.getOneLecture(1);

            expect(expected.LECTURE_ID).toEqual(lectureId);
        });

        it('특정 유저의 특강 신청 완료 여부 전체 조회', async () => {
            const userId = 123;

            const expectData: Application[] = [];
            const application: Application = new Application();
            application.LECTURE_ID = 1;
            application.USER_ID = 123;
            expectData.push(application);

            expect(await controller.getAllApplication(userId)).toStrictEqual(
                [],
            );
        });

        it('특정 유저의 특정 강의 신청 완료 여부 조회', async () => {
            const lectureId = 1;
            const userId = 123;

            const expected = await controller.getOneApplication(
                userId,
                lectureId,
            );

            expect(expected.LECTURE_ID).toEqual(lectureId);
            expect(expected.USER_ID).toEqual(userId);
        });
    });

    describe('Patch apply', () => {
        it('특강 신청 성공', async () => {
            const lectureId = 1;
            const userId = 123;
            const application: ApplicationDto = new ApplicationDto(
                lectureId,
                userId,
            );

            const expected = await controller.applyLecture(application);

            expect(expected.LECTURE_ID).toEqual(lectureId);
        });
    });
});
