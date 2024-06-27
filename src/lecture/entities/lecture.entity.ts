import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Lecture {
    @PrimaryGeneratedColumn()
    LECTURE_ID: number;

    @Column()
    LECTURE_NAME: string;

    @Column()
    APPLICATION_DATE: string;

    @Column()
    LECTURE_LIMIT: number;
}

@Entity()
export class Application {
    @PrimaryColumn()
    LECTURE_ID: number;

    @PrimaryColumn()
    USER_ID: number;
}
