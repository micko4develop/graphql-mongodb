import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CreateLessonInput } from './lesson.input';

@Injectable()
export class LessonService {
    constructor(
        @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>
    ) {}

    async createLesson(createLessonInput: CreateLessonInput): Promise<Lesson | null> {
        const { name, startDate, endDate } = createLessonInput;
        const lesson = this.lessonRepository.create({
            id: uuid(),
            name,
            startDate,
            endDate
        }) 

        return this.lessonRepository.save(lesson)

    }

    async getLesson(id: string): Promise<Lesson | null> {
        return this.lessonRepository.findOne({ where: { id } })
    }

    async getAllLessons(): Promise<Lesson[] | null> {
        return this.lessonRepository.find()
    }
}
