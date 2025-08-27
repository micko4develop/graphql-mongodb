import { Module } from '@nestjs/common';
import { StudentResolver } from './student.resolver';
import { StudentService } from './student.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student
    ])
  ],
  providers: [
    StudentResolver,
    StudentService
  ]
})
export class StudentModule {}