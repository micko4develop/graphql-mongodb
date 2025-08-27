import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { StudentType } from "./student.type";
import { StudentService } from "./student.service";
import { CreateStudentInput } from "./create-student.input";

@Resolver(of => StudentType)
export class StudentResolver {
    constructor(private StudentService: StudentService) {}

    @Query(returns  => StudentType)
    student(
        @Args('id') id: string
    ) {
        return this.StudentService.getStudent(id)
    }

    @Query(returns => [StudentType])
    students() {
        return this.StudentService.getStudents()
    }

    @Mutation(returns => StudentType)
    createStudent(
        @Args('createStudentInput') createStudentInput: CreateStudentInput 
    ) {
        return this.StudentService.createStudent(createStudentInput)
    }
}