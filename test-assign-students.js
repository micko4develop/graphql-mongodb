// Simple GraphQL query to test assignStudentsToLesson functionality

// 1. First create a lesson:
const createLessonMutation = `
  mutation {
    createLesson(createLessonInput: {
      name: "Math 101",
      startDate: "2024-01-01",
      endDate: "2024-06-30"
    }) {
      id
      name
      students
    }
  }
`;

// 2. Create a student:
const createStudentMutation = `
  mutation {
    createStudent(createStudentInput: {
      firstName: "John",
      lastName: "Doe"
    }) {
      id
      firstName
      lastName
    }
  }
`;

// 3. Assign student to lesson (replace LESSON_ID and STUDENT_ID with actual values):
const assignStudentsToLessonMutation = `
  mutation {
    assignStudentsToLesson(
      lessonId: "LESSON_ID",
      studentIds: ["STUDENT_ID"]
    ) {
      id
      name
      students
    }
  }
`;

// 4. Query lesson to verify assignment:
const getLessonQuery = `
  query {
    lesson(id: "LESSON_ID") {
      id
      name
      students
    }
  }
`;

console.log("Use these GraphQL operations to test assignStudentsToLesson:");
console.log("\n1. Create Lesson:", createLessonMutation);
console.log("\n2. Create Student:", createStudentMutation);
console.log("\n3. Assign Student to Lesson:", assignStudentsToLessonMutation);
console.log("\n4. Query Lesson:", getLessonQuery);