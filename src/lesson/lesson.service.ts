import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

    /**
     * Creates a new lesson with validation
     * @param createLessonInput - The lesson creation input data
     * @returns Promise<Lesson> - The created lesson
     * @throws BadRequestException - If validation fails
     */
    async createLesson(createLessonInput: CreateLessonInput): Promise<Lesson> {
        const { name, startDate, endDate } = createLessonInput;
        
        // Validate date inputs
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new BadRequestException('Invalid date format provided');
        }
        
        if (end <= start) {
            throw new BadRequestException('End date must be after start date');
        }
        
        const lesson = this.lessonRepository.create({
            id: uuid(),
            name: name.trim(),
            startDate,
            endDate,
            students: []
        });

        return this.lessonRepository.save(lesson);
    }

    /**
     * Retrieves a lesson by ID
     * @param id - The lesson ID
     * @returns Promise<Lesson> - The found lesson
     * @throws BadRequestException - If ID is invalid
     * @throws NotFoundException - If lesson is not found
     */
    async getLesson(id: string): Promise<Lesson> {
        if (!id?.trim()) {
            throw new BadRequestException('Lesson ID is required');
        }
        
        const lesson = await this.lessonRepository.findOne({ where: { id: id.trim() } });
        
        if (!lesson) {
            throw new NotFoundException(`Lesson with ID ${id} not found`);
        }
        
        return lesson;
    }

    /**
     * Retrieves all lessons ordered by start date
     * @returns Promise<Lesson[]> - Array of all lessons
     */
    async getAllLessons(): Promise<Lesson[]> {
        return this.lessonRepository.find({ order: { startDate: 'ASC' } });
    }

    /**
     * Assigns students to a lesson with comprehensive validation
     * @param lessonId - The lesson ID
     * @param studentIds - Array of student IDs to assign
     * @returns Promise<Lesson> - The updated lesson
     * @throws BadRequestException - If input validation fails
     * @throws NotFoundException - If lesson or students are not found
     */
    async assignStudentsToLesson(
        lessonId: string,
        studentIds: string[]
    ): Promise<Lesson> {
        // Input validation
        if (!lessonId?.trim()) {
            throw new BadRequestException('Lesson ID is required');
        }
        
        if (!studentIds || studentIds.length === 0) {
            throw new BadRequestException('At least one student ID is required');
        }
        
        // Validate student IDs format
        const validStudentIds = studentIds.filter(id => id?.trim()).map(id => id.trim());
        if (validStudentIds.length === 0) {
            throw new BadRequestException('Valid student IDs are required');
        }
        
        const lesson = await this.lessonRepository.findOne({ where: { id: lessonId.trim() } });
        
        if (!lesson) {
            throw new NotFoundException(`Lesson with ID ${lessonId} not found`);
        }
        
        // Batch validate students existence using helper method
        await this.validateStudentsExist(validStudentIds);
        
        // Avoid duplicate students
        const currentStudents = lesson.students || [];
        const newStudents = validStudentIds.filter(id => !currentStudents.includes(id));
        
        if (newStudents.length === 0) {
            throw new BadRequestException('All provided students are already assigned to this lesson');
        }
        
        lesson.students = [...currentStudents, ...newStudents];
        return this.lessonRepository.save(lesson);
    }

    /**
     * Private helper method to validate student existence efficiently
     * @param studentIds - Array of student IDs to validate
     * @returns Promise<void>
     * @throws NotFoundException - If any student is not found
     */
    private async validateStudentsExist(studentIds: string[]): Promise<void> {
        const validationPromises = studentIds.map(async (studentId) => {
            const student = await this.studentService.getStudent(studentId);
            if (!student) {
                throw new NotFoundException(`Student with ID ${studentId} not found`);
            }
        });
        
        await Promise.all(validationPromises);
    }
}
