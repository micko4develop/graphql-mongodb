import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CreateLessonInput } from './lesson.input';
import { StudentService } from '../student/student.service';

@Injectable()
export class LessonService {
    constructor(
        @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
        private studentService: StudentService
    ) {}

    async createLesson(createLessonInput: CreateLessonInput): Promise<Lesson | null> {
        const { name, startDate, endDate } = createLessonInput;
        const lesson = this.lessonRepository.create({
            id: uuid(),
            name,
            startDate,
            endDate,
            students: []
        }) 

        return this.lessonRepository.save(lesson)
    }

    async getLesson(id: string): Promise<Lesson | null> {
        return this.lessonRepository.findOne({ where: { id } })
    }

    async getAllLessons(): Promise<Lesson[] | null> {
        return this.lessonRepository.find()
    }

    async assignStudentsToLesson(
        lessonId: string,
        studentIds: string[]
    ): Promise<Lesson | null> {
        const lesson = await this.lessonRepository.findOne({ where: { id: lessonId } })
        
        if (!lesson) {
            throw new Error(`Lesson with id ${lessonId} not found`);
        }
        
        // Validate that all students exist
        for (const studentId of studentIds) {
            const student = await this.studentService.getStudent(studentId);
            if (!student) {
                throw new Error(`Student with id ${studentId} not found`);
            }
        }
        
        // Avoid duplicate students
        const currentStudents = lesson.students || [];
        const newStudents = studentIds.filter(id => !currentStudents.includes(id));
        
        lesson.students = [...currentStudents, ...newStudents];
        return this.lessonRepository.save(lesson);
    }
}
