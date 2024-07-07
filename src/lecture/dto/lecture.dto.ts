export class LectureDto {
    constructor(
        private readonly lectureId: number,
        private readonly lectureName: string,
        private readonly applicationDate: string,
        private readonly lectureLimit: number,
    ) {
        this.lectureId = lectureId;
        this.lectureName = lectureName;
        this.applicationDate = applicationDate;
        this.lectureLimit = lectureLimit;
    }

    getLectureId(): number {
        return this.lectureId;
    }

    getLectureName(): string {
        return this.lectureName;
    }

    getaApplicationDate(): string {
        return this.applicationDate;
    }

    getLectureLimit(): number {
        return this.lectureLimit;
    }
}
