import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Application, Lecture } from './entities/lecture.entity';
import { LectureService } from './lecture.service';
import { ApplicationDto } from './dto/application.dto';
import { Repository } from 'typeorm';

describe('LectureService', () => {
    let service: LectureService;
    let lectureRepo: Repository<Lecture>;
    let applicationRepo: Repository<Application>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    // database: ':memory:',
                    database: 'application.db',
                    entities: [Lecture, Application],
                    // logging: true,
                    synchronize: true,
                    // dropSchema: true,
                }),
                TypeOrmModule.forFeature([Lecture, Application]),
            ],
            providers: [LectureService, Repository<Lecture>],
        }).compile();

        service = module.get<LectureService>(LectureService);
        lectureRepo = module.get<Repository<Lecture>>(
            getRepositoryToken(Lecture),
        );
        applicationRepo = module.get<Repository<Application>>(
            getRepositoryToken(Application),
        );

        // DB설정
        await lectureRepo.save({
            LECTURE_ID: 1,
            LECTURE_NAME: 'nestjs',
            APPLICATION_DATE: '2024-06-28 01:00:00',
            LECTURE_LIMIT: 30,
        });
        await lectureRepo.save({
            LECTURE_ID: 2,
            LECTURE_NAME: 'nestjs_level2',
            APPLICATION_DATE: '2024-06-28 10:00:00',
            LECTURE_LIMIT: 30,
        });
        await lectureRepo.save({
            LECTURE_ID: 3,
            LECTURE_NAME: 'nestjs_level3',
            APPLICATION_DATE: '2024-06-28 01:00:00',
            LECTURE_LIMIT: 30,
        });
        await lectureRepo.save({
            LECTURE_ID: 4,
            LECTURE_NAME: 'nestjs_level4',
            APPLICATION_DATE: '2024-06-28 02:00:00',
            LECTURE_LIMIT: 30,
        });
        await applicationRepo.query('DELETE FROM APPLICATION');
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
            '강의 ID(' + lectureId + ')은(는) 없는 강의입니다.',
        );
    });

    it('강의 신청 시간이 아닐 경우', async () => {
        const lectureId = 2;
        const userId = 123;
        const application: ApplicationDto = new ApplicationDto(
            lectureId,
            userId,
        );

        await expect(service.applyLecture(application)).rejects.toThrow(
            '아직 강의 신청 시간이 아닙니다.',
        );
    });

    it('유저ID가 양수가 아닌 경우', async () => {
        const lectureId = 2;
        const userId = -123;
        const application: ApplicationDto = new ApplicationDto(
            lectureId,
            userId,
        );

        await expect(service.applyLecture(application)).rejects.toThrow(
            '올바른 유저ID를 입력해주세요.',
        );
    });

    it('이미 신청한 강의인 경우', async () => {
        const lectureId = 1;
        const userId = 123;
        const application: ApplicationDto = new ApplicationDto(
            lectureId,
            userId,
        );

        await service.applyLecture(application);

        await expect(service.applyLecture(application)).rejects.toThrow(
            '이미 신청한 강의입니다.',
        );
    });

    it('동일한 시간에 다른 특강을 이미 신청한 경우', async () => {
        const lectureId = 3;
        const userId = 123;
        const application: ApplicationDto = new ApplicationDto(
            lectureId,
            userId,
        );

        await expect(service.applyLecture(application)).rejects.toThrow(
            '해당 특강과 동일한 시간대에 신청한 특강이 존재합니다.',
        );
    });

    it('신청 정원이 가득 찬 경우 - 30명만 성공 나머지는 실패', async () => {
        // Given
        const lectureId = 4;

        const totalUser = 50;
        const lectureLimit = 30;
        const failExpected = totalUser - lectureLimit;

        const applications = Array.from(
            { length: totalUser },
            (v, i) => new ApplicationDto(lectureId, i + 1),
        );
        const applyLectures = applications.map(
            async (application) => await service.applyLecture(application),
        );

        // When
        const result = await Promise.allSettled(applyLectures);

        // Then
        expect(result.filter((v) => v.status === 'fulfilled').length).toBe(
            lectureLimit,
        );
        expect(result.filter((v) => v.status === 'rejected').length).toBe(
            failExpected,
        );
    });
});
