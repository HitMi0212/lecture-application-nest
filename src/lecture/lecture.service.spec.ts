import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application, Lecture } from './entities/lecture.entity';
import { LectureService } from './lecture.service';
import { ApplicationDto } from './dto/application.dto';

describe('LectureService', () => {
    let service: LectureService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: 'lecturedata.db',
                    entities: [Lecture, Application],
                }),
                TypeOrmModule.forFeature([Lecture, Application]),
            ],
            providers: [LectureService],
        }).compile();

        service = module.get<LectureService>(LectureService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    /**
     * 1. 강의ID가 정수가 아닌 경우
     * 2. 입력한 ID가 없는 강의인 경우
     * 3. 강의 신청일이 아닐 경우
     * 4. 유저ID가 정수가 아닌 경우
     * 5. 이미 신청한 강의인 경우
     * 6. 신청 정원이 가득 찬 경우
     * 7. 동일한 시간에 다른 특강을 이미 신청한 경우
     */

    it('강의ID가 양수가 아닌 경우', async () => {
        const lecture = new Lecture();
        lecture.LECTURE_ID = -12;

        await expect(service.getOneLecture(-12)).rejects.toThrow(
            '올바른 강의ID를 입력해주세요.',
        );
    });

    it('없는 강의인 경우', async () => {
        const lectureId = 112;
        const userId = 123;
        const application: ApplicationDto = new ApplicationDto(
            lectureId,
            userId,
        );

        await expect(service.applyLecture(application)).rejects.toThrow(
            '강의 ID(' + lectureId + ')는 없는 강의입니다.',
        );
    });

    it('강의 신청일이 아닐 경우', async () => {
        const lectureId = 2;
        const userId = 123;
        const application: ApplicationDto = new ApplicationDto(
            lectureId,
            userId,
        );

        await expect(service.applyLecture(application)).rejects.toThrow(
            '해당 강의는 아직 신청 불가능합니다.',
        );
    });

    it('이미 신청한 강의인 경우', async () => {
        const lectureId = 1;
        const userId = 123;
        const application: ApplicationDto = new ApplicationDto(
            lectureId,
            userId,
        );

        await expect(service.applyLecture(application)).rejects.toThrow(
            '이미 신청한 강의입니다.',
        );
    });

    it('신청 정원이 가득 찬 경우', async () => {
        const lectureId = 1;
        const userId = 123;
        const application: ApplicationDto = new ApplicationDto(
            lectureId,
            userId,
        );

        await expect(service.applyLecture(application)).rejects.toThrow(
            '해당 특강의 정원이 가득 차 신청 불가능합니다.',
        );
    });

    it('동일한 시간에 다른 특강을 이미 신청한 경우', async () => {
        const lectureId = 1;
        const userId = 123;
        const application: ApplicationDto = new ApplicationDto(
            lectureId,
            userId,
        );

        await expect(service.applyLecture(application)).rejects.toThrow(
            '해당 특강과 동일한 시간대에 신청한 특강이 존재합니다.',
        );
    });
});
