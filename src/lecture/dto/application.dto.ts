export class ApplicationDto {
    constructor(
        private readonly lectureId: number,
        private readonly userId: number,
    ) {
        this.lectureId = lectureId;
        this.userId = userId;
    }

    getUserId(): number {
        return this.userId;
    }

    getLectureId(): number {
        return this.lectureId;
    }
}
