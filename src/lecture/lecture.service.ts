import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ApplicationDto } from './dto/application.dto';
import { Application, Lecture } from './entities/lecture.entity';

@Injectable()
export class LectureService {
    constructor(
        @InjectRepository(Lecture)
        private readonly lectureRepo: Repository<Lecture>,
        @InjectRepository(Application)
        private readonly applicationRepo: Repository<Application>,
        private readonly dataSource: DataSource,
    ) {}

    async getAllLectures(): Promise<Lecture[]> {
        return await this.lectureRepo.find();
    }

    async getAllApplication(userId: number): Promise<Application[]> {
        if (isNaN(userId) || userId <= 0) {
            throw new BadRequestException('올바른 유저ID를 입력해주세요.');
        }

        return await this.applicationRepo.findBy({
            USER_ID: userId,
        });
    }

    async getOneLecture(id: number): Promise<Lecture> {
        if (isNaN(id) || id <= 0) {
            throw new BadRequestException('올바른 강의ID를 입력해주세요.');
        }

        return await this.lectureRepo.findOneBy({ LECTURE_ID: id });
    }

    async getOneApplication(
        lectureId: number,
        userId: number,
    ): Promise<Application> {
        if (isNaN(lectureId) || lectureId <= 0) {
            throw new BadRequestException('올바른 강의ID를 입력해주세요.');
        }
        if (isNaN(userId) || userId <= 0) {
            throw new BadRequestException('올바른 유저ID를 입력해주세요.');
        }

        return await this.applicationRepo.findOneBy({
            LECTURE_ID: lectureId,
            USER_ID: userId,
        });
    }

    async applyLecture(
        lectureApplicationDto: ApplicationDto,
    ): Promise<Application> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction('SERIALIZABLE');

        let result: Application;

        const userId = lectureApplicationDto.getUserId();
        const lectureId = lectureApplicationDto.getLectureId();

        if (isNaN(userId) || userId <= 0) {
            throw new BadRequestException('올바른 유저ID를 입력해주세요.');
        }
        if (isNaN(lectureId) || lectureId <= 0) {
            throw new BadRequestException('올바른 강의ID를 입력해주세요.');
        }

        const lecture = await this.lectureRepo.findOneBy({
            LECTURE_ID: lectureId,
        });

        if (!lecture) {
            throw new BadRequestException(
                '강의 ID(' + lectureId + ')은(는) 없는 강의입니다.',
            );
        }

        const now = new Date();
        const applicationDate = new Date(lecture.APPLICATION_DATE);
        const timeDiff = now.getTime() - applicationDate.getTime();

        if (timeDiff < 0) {
            throw new BadRequestException('아직 강의 신청 시간이 아닙니다.');
        }

        const application = await this.applicationRepo.findOneBy({
            LECTURE_ID: lectureId,
            USER_ID: userId,
        });

        if (application) {
            throw new BadRequestException('이미 신청한 강의입니다.');
        }

        const applicationCount = await this.applicationRepo.countBy({
            LECTURE_ID: lectureId,
        });

        if (applicationCount > lecture.LECTURE_LIMIT) {
            throw new BadRequestException(
                '해당 특강의 정원이 가득 차 접수가 마감되었습니다.',
            );
        }

        const lectures = await this.lectureRepo.findBy({
            APPLICATION_DATE: lecture.APPLICATION_DATE,
        });
        const lectureIds: number[] = lectures.map((v): number => {
            if (v.LECTURE_ID !== lectureId) return v.LECTURE_ID;
        });

        if (lectureIds.length > 1) {
            const userApplications = await this.applicationRepo.findBy({
                USER_ID: userId,
            });

            userApplications.forEach((application) => {
                if (lectureIds.includes(application.LECTURE_ID)) {
                    throw new BadRequestException(
                        '해당 특강과 동일한 시간대에 신청한 특강이 존재합니다.',
                    );
                }
            });
        }

        try {
            result = await this.applicationRepo.save({
                LECTURE_ID: lectureApplicationDto.getLectureId(),
                USER_ID: lectureApplicationDto.getUserId(),
            });
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }

        return result;
    }
}
