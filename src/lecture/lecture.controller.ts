import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApplicationDto } from './dto/application.dto';
import { LectureService } from './lecture.service';

@Controller('lecture')
export class LectureController {
    constructor(private readonly lectureService: LectureService) {}

    @Get()
    async getAllLectures() {
        return await this.lectureService.getAllLectures();
    }

    @Get('lecture/:id')
    async getOneLecture(@Param('id') id: number) {
        return await this.lectureService.getOneLecture(id);
    }

    @Get('application/:id')
    async getAllApplication(@Param('id') userId: number) {
        return await this.lectureService.getAllApplication(userId);
    }

    @Get('application/:userId/:lectureId')
    async getOneApplication(
        @Param('lectureId') lectureId: number,
        @Param('userId') userId: number,
    ) {
        return await this.lectureService.getOneApplication(lectureId, userId);
    }

    @Patch('apply')
    async applyLecture(@Body() applicationDto: ApplicationDto) {
        return await this.lectureService.applyLecture(applicationDto);
    }
}
