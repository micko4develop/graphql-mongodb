import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { CreateStudentInput } from './create-student.input';
import { v4 as uuid } from 'uuid';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private studentRepository: Repository<Student>
    ) {}

    async getStudent(id: string): Promise<Student | null> {
        return this.studentRepository.findOne({ where: { id } })
    }

    async getStudents(): Promise<Student[]> {
        return this.studentRepository.find();
    }

    async createStudent(createStudentInput: CreateStudentInput): Promise<Student | null> {
        const { firstName, lastName } = createStudentInput;
        const student = this.studentRepository.create({ id: uuid(),firstName, lastName });
        return this.studentRepository.save(student);
    }
}
