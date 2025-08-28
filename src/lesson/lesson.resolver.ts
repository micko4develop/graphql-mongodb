import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { LessonType } from "./lesson.type";
import { LessonService } from "./lesson.service";
import { CreateLessonInput } from "./lesson.input";

@Resolver(of => LessonType)
export class LessonResolver {
    constructor(private LessonService: LessonService) {}

    @Query(returns  => LessonType)
    lesson(
        @Args('id') id: string
    ) {
        return this.LessonService.getLesson(id)
    }

    @Query(returns => [LessonType])
    lessons() {
        return this.LessonService.getAllLessons()
    }

    @Mutation(returns => LessonType)
    createLesson(
        @Args('createLessonInput') createLessonInput: CreateLessonInput 
    ) {
        return this.LessonService.createLesson(createLessonInput)
    }

    @Mutation(returns => LessonType)
    assignStudentsToLesson(
        @Args('lessonId') lessonId: string,
        @Args('studentIds', { type: () => [String] }) studentIds: string[]
    ) {
        return this.LessonService.assignStudentsToLesson(lessonId, studentIds)
    }
}