import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { LessonType } from "./lesson.type";
import { LessonService } from "./lesson.service";

@Resolver(of => LessonType)
export class LessonResolver {
    constructor(private LessonService: LessonService) {}

    @Query(returns  => LessonType)
    lesson(
        @Args('id') id: string
    ) {
        return this.LessonService.getLesson(id)
    }

    @Mutation(returns => LessonType)
    createLesson(
        @Args('name') name: string,
        @Args('startDate') startDate: string,
        @Args('endDate') endDate: string
    ) {
        return this.LessonService.createLesson(name, startDate, endDate)
    }
}