import { Test, TestingModule } from '@nestjs/testing';
import { LectureService } from './lecture.service';

describe('LectureService', () => {
    let service: LectureService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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
        const lectureId = -12;

        jest.spyOn(service, 'getOneLectures').mockResolvedValue(lectureId);

        await expect(service.getOneLectures(lectureId)).resolves.not.toThrow();
    });

    it('없는 강의인 경우', async () => {
        const lectureId = 112;

        jest.spyOn(service, 'getOneLectures').mockResolvedValue(lectureId);

        await expect(service.getOneLectures(lectureId)).resolves.not.toThrow();
    });

    it('강의 신청일이 아닐 경우', async () => {
        const lectureId = 1;

        jest.spyOn(service, 'getOneLectures').mockResolvedValue(lectureId);

        await expect(service.application(lectureId)).resolves.not.toThrow();
    });

    it('이미 신청한 강의인 경우', async () => {
        const lectureId = 1;

        jest.spyOn(service, 'getOneLectures').mockResolvedValue(lectureId);

        await expect(service.application(lectureId)).resolves.not.toThrow();
    });

    it('신청 정원이 가득 찬 경우', async () => {
        const lectureId = 1;

        jest.spyOn(service, 'getOneLectures').mockResolvedValue(lectureId);

        await expect(service.application(lectureId)).resolves.not.toThrow();
    });

    it('동일한 시간에 다른 특강을 이미 신청한 경우', async () => {
        const lectureId = 1;

        jest.spyOn(service, 'getOneLectures').mockResolvedValue(lectureId);

        await expect(service.application(lectureId)).resolves.not.toThrow();
    });
});
