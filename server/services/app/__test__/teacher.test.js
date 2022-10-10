const request = require("supertest");
const app = require("../app");
const {
  Teacher,
  Exam,
  ExamGrades,
  AssignmentGrades,
  Assignment,
  Course,
  FinalGrades,
  Attendance,
  Student,
  sequelize,
} = require("../models");
const { queryInterface } = sequelize;
const { signToken } = require("../helpers/jwt");
const { response } = require("../app");
const { hashPassword } = require("../helpers/bcrypt");

let teacher = {
  fullName: "name_test",
  CourseId: 1,
  email: "email_test@gmail.com",
  password: hashPassword("password_test"),
  photo:
    "https://toppng.com//public/uploads/preview/black-widow-natasha-romanoff-infinity-war-11563164367lbcfuwdyt2.png",
  createdAt: new Date(),
  updatedAt: new Date(),
};

let access_token;
let teacherId = 0;
let testId = 1;

beforeAll(async () => {
  await queryInterface
    .bulkInsert("Teachers", [teacher], {})
    .then(() => {
      return Teacher.findOne({
        where: {
          email: teacher.email,
        },
      });
    })
    .then((result) => {
      teacherId = result.id;
      access_token = signToken({
        id: result.id,
        email: result.email,
      });
    });

  await queryInterface.bulkInsert("Assignments", [
    {
      description: "description_test",
      CourseId: 1,
      deadline: "2022-12-12 18:00:00",
      name: "name_test",
      className: "class_test",
      createById: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  await queryInterface.bulkInsert("AssignmentGrades", [
    {
      score: 100,
      StudentId: 1,
      AssignmentId: 1,
      url: "www.google.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      score: 90,
      StudentId: 2,
      AssignmentId: 1,
      url: "www.google.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  await queryInterface.bulkInsert("ExamGrades", [
    {
      score: 100,
      StudentId: 1,
      ExamId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  await queryInterface.bulkInsert("Attendances", [
    {
      dateAndTime: new Date(),
      StudentId: 1,
      status: false,
      lon: `106°50'07.1"E`,
      lat: `6°11'30.4"S`,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
});

afterAll(async() => {
  queryInterface.bulkDelete("Teachers", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  queryInterface.bulkDelete("Assignments", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  queryInterface.bulkDelete("AssignmentGrades", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  queryInterface.bulkDelete("ExamGrades", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  queryInterface.bulkDelete("Attendances", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

describe("POST /teachers/register", () => {
  test("POST /teachers/register - success test", () => {
    return request(app)
      .post("/teachers/register")
      .send({
        fullName: "name_test",
        CourseId: 1,
        email: "email_test1@gmail.com",
        password: "password_test",
        photo:
          "https://toppng.com//public/uploads/preview/black-widow-natasha-romanoff-infinity-war-11563164367lbcfuwdyt2.png",
      })
      .then((response) => {
        expect(response.status).toBe(201);
        expect(response.body).toBeInstanceOf(Object);

        expect(response.body).toHaveProperty("id", expect.any(Number));
        expect(response.body).toHaveProperty("email", "email_test1@gmail.com");
      });
  });

  test("POST /teachers/register - failed test - email must be unique", () => {
    return request(app)
      .post("/teachers/register")
      .send({
        fullName: "name_test",
        CourseId: 1,
        email: "email_test@gmail.com",
        password: "password_test",
        photo:
          "https://toppng.com//public/uploads/preview/black-widow-natasha-romanoff-infinity-war-11563164367lbcfuwdyt2.png",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "Email must be unique");
      });
  });

  test("POST /teachers/register - failed test - fullName is required", () => {
    return request(app)
      .post("/teachers/register")
      .send({
        fullName: "",
        CourseId: 1,
        email: "email_test2@gmail.com",
        password: "password_test",
        photo:
          "https://toppng.com//public/uploads/preview/black-widow-natasha-romanoff-infinity-war-11563164367lbcfuwdyt2.png",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "Full name is required"
        );
      });
  });

  test("POST /teachers/register - failed test - CourseId is required", () => {
    return request(app)
      .post("/teachers/register")
      .send({
        fullName: "name_test",
        CourseId: "",
        email: "email_test2@gmail.com",
        password: "password_test",
        photo:
          "https://toppng.com//public/uploads/preview/black-widow-natasha-romanoff-infinity-war-11563164367lbcfuwdyt2.png",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "Course ID is required"
        );
      });
  });

  test("POST /teachers/register - failed test - email is required", () => {
    return request(app)
      .post("/teachers/register")
      .send({
        fullName: "name_test",
        CourseId: 1,
        email: "",
        password: "password_test",
        photo:
          "https://toppng.com//public/uploads/preview/black-widow-natasha-romanoff-infinity-war-11563164367lbcfuwdyt2.png",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "Email is required");
      });
  });

  test("POST /teachers/register - failed test - password is required", () => {
    return request(app)
      .post("/teachers/register")
      .send({
        fullName: "name_test",
        CourseId: 1,
        email: "email_test2@gmail.com",
        password: "",
        photo:
          "https://toppng.com//public/uploads/preview/black-widow-natasha-romanoff-infinity-war-11563164367lbcfuwdyt2.png",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "Password is required");
      });
  });
});

describe("POST /teachers/login", () => {
  test("POST /teachers/login - success", () => {
    return request(app)
      .post("/teachers/login")
      .send({
        email: "email_test@gmail.com",
        password: "password_test",
      })
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "access_token",
          expect.any(String)
        );
        expect(response.body).toHaveProperty(
          "loggedInName",
          expect.any(String)
        );
      });
  });

  test("POST /teachers/login - failed - wrong email", () => {
    return request(app)
      .post("/teachers/login")
      .send({
        email: "wrong_email_test@gmail.com",
        password: "password_test",
      })
      .then((response) => {
        expect(response.status).toBe(401);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "Invalid email/password"
        );
      });
  });
  test("POST /teachers/login - failed - wrong password", () => {
    return request(app)
      .post("/teachers/login")
      .send({
        email: "email_test@gmail.com",
        password: "wrong_password_test",
      })
      .then((response) => {
        expect(response.status).toBe(401);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "Invalid email/password"
        );
      });
  });

  test("POST /teachers/login - failed - email is required", () => {
    return request(app)
      .post("/teachers/login")
      .send({
        email: "",
        password: "password_test",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "Email is required");
      });
  });

  test("POST /teachers/login - failed - password is required", () => {
    return request(app)
      .post("/teachers/login")
      .send({
        email: "email_test@gmail.com",
        password: "",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "Password is required");
      });
  });
});

describe("GET /teachers/courses", () => {
  test("GET /teachers/exams - success", () => {
    return request(app)
      .get("/teachers/courses")
      .then((response) => {
        expect(response.status).toBe(201);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body[0]).toHaveProperty("name", expect.any(String));
        expect(response.body[0]).toHaveProperty("icon", expect.any(String));
      });
  });
});

describe("POST /teachers/exams", () => {
  test("POST /teachers/exams - success", () => {
    return request(app)
      .post("/teachers/exams")
      .set("access_token", access_token)
      .send({
        name: "name_test",
        CourseId: 1,
        className: "class_test",
      })
      .then((response) => {
        expect(response.status).toBe(201);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "success Add Exam");
      });
  });

  test("POST /teachers/exams - failed - unauthorized", () => {
    return request(app)
      .post("/teachers/exams")
      .send({
        name: "name_test",
        CourseId: 1,
        className: "class_test",
      })
      .then((response) => {
        expect(response.status).toBe(403);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "Unauthorized activity"
        );
      });
  });

  test("POST /teachers/exams - failed - Full Name is required", () => {
    return request(app)
      .post("/teachers/exams")
      .set("access_token", access_token)
      .send({
        name: "",
        CourseId: 1,
        className: "class_test",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "Full name is required"
        );
      });
  });
  test("POST /teachers/exams - failed - CourseId is required", () => {
    return request(app)
      .post("/teachers/exams")
      .set("access_token", access_token)
      .send({
        name: "name_test",
        CourseId: "",
        className: "class_test",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "CourseId is required");
      });
  });
  test("POST /teachers/exams - failed - Class Name is required", () => {
    return request(app)
      .post("/teachers/exams")
      .set("access_token", access_token)
      .send({
        name: "name_test",
        CourseId: 1,
        className: "",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "Class name is required"
        );
      });
  });
});

describe("POST /teachers/scores", () => {
  test("POST /teachers/scores - success", () => {
    return request(app)
      .post("/teachers/scores")
      .set("access_token", access_token)
      .send({
        score: 10,
        StudentId: 1,
        ExamId: 1,
      })
      .then((response) => {
        expect(response.status).toBe(201);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "success Add score");
      });
  });
  test("POST /teachers/scores - failed - score is required", () => {
    return request(app)
      .post("/teachers/scores")
      .set("access_token", access_token)
      .send({
        score: "",
        StudentId: 1,
        ExamId: 1,
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "Score name is required"
        );
      });
  });
  test("POST /teachers/scores - failed - StudentId is required", () => {
    return request(app)
      .post("/teachers/scores")
      .set("access_token", access_token)
      .send({
        score: 10,
        StudentId: "",
        ExamId: 1,
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "StudentId name is required"
        );
      });
  });
  test("POST /teachers/scores - failed - ExamId is required", () => {
    return request(app)
      .post("/teachers/scores")
      .set("access_token", access_token)
      .send({
        score: 10,
        StudentId: 1,
        ExamId: "",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "ExamId is required");
      });
  });
});

describe("GET /teachers/exams/score", () => {
  test("GET /teachers/exams/score - success", () => {
    return request(app)
      .get("/teachers/exams/score")
      .set("access_token", access_token)
      .then((response) => {
        expect(response.status).toBe(201);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toBeInstanceOf(Object);
        expect(response.body[0].Exam).toBeInstanceOf(Object);
        expect(response.body[0].Exam.Course).toBeInstanceOf(Object);
        expect(response.body[0].Student).toBeInstanceOf(Object);
        expect(response.body[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body[0]).toHaveProperty("score", expect.any(String));
        expect(response.body[0]).toHaveProperty(
          "StudentId",
          expect.any(Number)
        );
        expect(response.body[0]).toHaveProperty("ExamId", expect.any(Number));
        expect(response.body[0].Exam).toHaveProperty("id", expect.any(Number));
        expect(response.body[0].Exam).toHaveProperty(
          "name",
          expect.any(String)
        );
        expect(response.body[0].Exam).toHaveProperty(
          "CourseId",
          expect.any(Number)
        );
        expect(response.body[0].Exam).toHaveProperty(
          "className",
          expect.any(String)
        );
        expect(response.body[0].Exam.Course).toHaveProperty(
          "id",
          expect.any(Number)
        );
        expect(response.body[0].Exam.Course).toHaveProperty(
          "name",
          expect.any(String)
        );
        expect(response.body[0].Exam.Course).toHaveProperty(
          "icon",
          expect.any(String)
        );
        expect(response.body[0].Student).toHaveProperty(
          "id",
          expect.any(Number)
        );
        expect(response.body[0].Student).toHaveProperty(
          "fullName",
          expect.any(String)
        );
        expect(response.body[0].Student).toHaveProperty(
          "className",
          expect.any(String)
        );
        expect(response.body[0].Student).toHaveProperty(
          "email",
          expect.any(String)
        );
        expect(response.body[0].Student).toHaveProperty(
          "password",
          expect.any(String)
        );
        expect(response.body[0].Student).toHaveProperty(
          "photo",
          expect.any(String)
        );
        expect(response.body[0].Student).toHaveProperty(
          "address",
          expect.any(String)
        );
        expect(response.body[0].Student).toHaveProperty(
          "phoneNumber",
          expect.any(String)
        );
        expect(response.body[0].Student).toHaveProperty(
          "gender",
          expect.any(String)
        );
      });
  });
});

describe("GET /teachers/assignment", () => {
  test("GET /teachers/assignment - success", () => {
    return request(app)
      .get("/teachers/assignment")
      .set("access_token", access_token)
      .then((response) => {
        expect(response.status).toBe(201);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toBeInstanceOf(Object);
        expect(response.body[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body[0]).toHaveProperty(
          "description",
          expect.any(String)
        );
        expect(response.body[0]).toHaveProperty("CourseId", expect.any(Number));
        expect(response.body[0]).toHaveProperty("deadline", expect.any(String));
        expect(response.body[0]).toHaveProperty("name", expect.any(String));
        expect(response.body[0]).toHaveProperty(
          "className",
          expect.any(String)
        );
        expect(response.body[0]).toHaveProperty(
          "createById",
          expect.any(Number)
        );
      });
  });

  test("GET /teachers/assignment - failed - unauthorized", () => {
    return request(app)
      .get("/teachers/assignment")
      .then((response) => {
        expect(response.status).toBe(403);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "Unauthorized activity"
        );
      });
  });
});

describe("POST /teachers/assignment", () => {
  test("POST /teachers/assignment - success", () => {
    return request(app)
      .post("/teachers/assignment")
      .set("access_token", access_token)
      .send({
        description: "description_test",
        CourseId: 1,
        deadline: "2022-12-12 18:00",
        name: "name_test",
        className: "class_test",
      })
      .then((response) => {
        expect(response.status).toBe(201);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "Success create new name_test assignment"
        );
      });
  });

  test("POST /teachers/assignment - failed - description is required", () => {
    return request(app)
      .post("/teachers/assignment")
      .set("access_token", access_token)
      .send({
        description: "",
        CourseId: 1,
        deadline: "2022-12-12 18:00",
        name: "name_test",
        className: "class_test",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "description is required"
        );
      });
  });
  test("POST /teachers/assignment - failed - deadline is required", () => {
    return request(app)
      .post("/teachers/assignment")
      .set("access_token", access_token)
      .send({
        description: "description_test",
        CourseId: 1,
        deadline: "",
        name: "name_test",
        className: "class_test",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "deadline is required");
      });
  });
  test("POST /teachers/assignment - failed - name is required", () => {
    return request(app)
      .post("/teachers/assignment")
      .set("access_token", access_token)
      .send({
        description: "description_test",
        CourseId: 1,
        deadline: "2022-12-12 18:00",
        name: "",
        className: "class_test",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "name is required");
      });
  });
  test("POST /teachers/assignment - failed - className is required", () => {
    return request(app)
      .post("/teachers/assignment")
      .set("access_token", access_token)
      .send({
        description: "description_test",
        CourseId: 1,
        deadline: "2022-12-12 18:00",
        name: "name_test",
        className: "",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "className is required"
        );
      });
  });
});

describe("GET /teachers/assignment/score", () => {
  test("GET /teachers/assignment/score - success", () => {
    return request(app)
      .get("/teachers/assignment/score")
      .set("access_token", access_token)
      .then((response) => {
        expect(response.status).toBe(201);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toBeInstanceOf(Object);
        expect(response.body[0]).toHaveProperty(
          "Assignment",
          expect.any(Object)
        );
        expect(response.body[0]).toHaveProperty("Student", expect.any(Object));
        expect(response.body[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body[0]).toHaveProperty("score", expect.any(String));
        expect(response.body[0]).toHaveProperty(
          "StudentId",
          expect.any(Number)
        );
        expect(response.body[0]).toHaveProperty(
          "AssignmentId",
          expect.any(Number)
        );
        expect(response.body[0]).toHaveProperty("url", expect.any(String));
        expect(response.body[0].Assignment).toHaveProperty(
          "id",
          expect.any(Number)
        );
        expect(response.body[0].Assignment).toHaveProperty(
          "description",
          expect.any(String)
        );
        expect(response.body[0].Assignment).toHaveProperty(
          "CourseId",
          expect.any(Number)
        );
        expect(response.body[0].Assignment).toHaveProperty(
          "deadline",
          expect.any(String)
        );
        expect(response.body[0].Assignment).toHaveProperty(
          "name",
          expect.any(String)
        );
        expect(response.body[0].Assignment).toHaveProperty(
          "className",
          expect.any(String)
        );
        expect(response.body[0].Assignment).toHaveProperty(
          "Course",
          expect.any(Object)
        );
        expect(response.body[0].Assignment.Course).toHaveProperty(
          "id",
          expect.any(Number)
        );
        expect(response.body[0].Assignment.Course).toHaveProperty(
          "name",
          expect.any(String)
        );
        expect(response.body[0].Assignment.Course).toHaveProperty(
          "icon",
          expect.any(String)
        );
        expect(response.body[0].Student).toHaveProperty(
          "id",
          expect.any(Number)
        );
        expect(response.body[0].Student).toHaveProperty(
          "fullName",
          expect.any(String)
        );
        expect(response.body[0].Student).toHaveProperty(
          "className",
          expect.any(String)
        );
        expect(response.body[0].Student).toHaveProperty(
          "email",
          expect.any(String)
        );
        expect(response.body[0].Student).toHaveProperty(
          "password",
          expect.any(String)
        );
        expect(response.body[0].Student).toHaveProperty(
          "photo",
          expect.any(String)
        );
        expect(response.body[0].Student).toHaveProperty(
          "address",
          expect.any(String)
        );
        expect(response.body[0].Student).toHaveProperty(
          "phoneNumber",
          expect.any(String)
        );
        expect(response.body[0].Student).toHaveProperty(
          "gender",
          expect.any(String)
        );
      });
  });

  test("GET /teachers/assignment/score - failed - unauthorized", () => {
    return request(app)
      .get("/teachers/assignment/score")
      .then((response) => {
        expect(response.status).toBe(403);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "Unauthorized activity"
        );
      });
  });
});

describe("PUT /teachers/assignment/score", () => {
  test("PUT /teachers/assignment/score - success", () => {
    return request(app)
      .put("/teachers/assignment/score")
      .set("access_token", access_token)
      .send({
        id: 1,
        score: 90,
      })
      .then((response) => {
        expect(response.status).toBe(201);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "success input assignment score"
        );
      });
  });
  test("PUT /teachers/assignment/score - failed - unauthorized", () => {
    return request(app)
      .put("/teachers/assignment/score")
      .then((response) => {
        expect(response.status).toBe(403);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "Unauthorized activity"
        );
      });
  });
});

describe("PUT /teachers/exams/", () => {
  test("PUT /teachers/exams - success", () => {
    return request(app)
      .put("/teachers/exams/" + testId)
      .set("access_token", access_token)
      .send({
        name: "name_test",
        CourseId: 1,
        className: "class_test",
      })
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "success Edit Exam");
      });
  });
  test("PUT /teachers/exams - success", () => {
    return request(app)
      .put("/teachers/exams/" + testId)
      .send({
        name: "name_test",
        CourseId: 1,
        className: "class_test",
      })
      .then((response) => {
        expect(response.status).toBe(403);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "Unauthorized activity"
        );
      });
  });
  test("PUT /teachers/exams - failed - fullname is required", () => {
    return request(app)
      .put("/teachers/exams/" + testId)
      .set("access_token", access_token)
      .send({
        name: "",
        CourseId: 1,
        className: "class_test",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "Full name is required"
        );
      });
  });
  test("PUT /teachers/exams - failed - CourseId is required", () => {
    return request(app)
      .put("/teachers/exams/" + testId)
      .set("access_token", access_token)
      .send({
        name: "name_test",
        CourseId: "",
        className: "class_test",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "CourseId is required");
      });
  });
  test("PUT /teachers/exams - failed - className is required", () => {
    return request(app)
      .put("/teachers/exams/" + testId)
      .set("access_token", access_token)
      .send({
        name: "name_test",
        CourseId: 1,
        className: "",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "Class name is required"
        );
      });
  });
});

describe("GET /teachers/assignment/grade/:id", () => {
  test("GET /teachers/assignment/grade/:id - success", () => {
    return request(app)
      .get("/teachers/assignment/grade/" + testId)
      .set("access_token", access_token)
      .then((response) => {
        expect(response.status).toBe(201);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toBeInstanceOf(Object);
        expect(response.body[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body[0]).toHaveProperty("score", expect.any(String));
        expect(response.body[0]).toHaveProperty(
          "StudentId",
          expect.any(Number)
        );
        expect(response.body[0]).toHaveProperty(
          "AssignmentId",
          expect.any(Number)
        );
        expect(response.body[0]).toHaveProperty("url", expect.any(String));
      });
  });

  test("GET /teachers/assignment/grade/:id - failed - unauthorized", () => {
    return request(app)
      .get("/teachers/assignment/grade/" + testId)
      .then((response) => {
        expect(response.status).toBe(403);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "Unauthorized activity"
        );
      });
  });
});

describe("GET /teachers/assignment/:id", () => {
  test("GET /teachers/assignment/:id - success", () => {
    return request(app)
      .get("/teachers/assignment/" + testId)
      .set("access_token", access_token)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("id", expect.any(Number));
        expect(response.body).toHaveProperty("description", expect.any(String));
        expect(response.body).toHaveProperty("CourseId", expect.any(Number));
        expect(response.body).toHaveProperty("deadline", expect.any(String));
        expect(response.body).toHaveProperty("name", expect.any(String));
        expect(response.body).toHaveProperty("className", expect.any(String));
        expect(response.body).toHaveProperty("createById", expect.any(Number));
      });
  });
  test("GET /teachers/assignment - failed - unauthorized", () => {
    return request(app)
      .get("/teachers/assignment/" + testId)
      .then((response) => {
        expect(response.status).toBe(403);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "Unauthorized activity");
      });
  });

});

describe("DELETE /teachers/assignment", () => {
  test("DELETE /teachers/assignment - success", () => {
    return request(app)
      .delete("/teachers/assignment/" + testId)
      .set("access_token", access_token)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "success deleted");
      });
  });
  test("DELETE /teachers/assignment - failed - unauthorized", () => {
    return request(app)
      .delete("/teachers/assignment/" + testId)
      .then((response) => {
        expect(response.status).toBe(403);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "Unauthorized activity");
      });
  });
  test("DELETE /teachers/assignment - failed - id not found", () => {
    return request(app)
      .delete("/teachers/assignment/" + 1000)
      .set("access_token", access_token)
      .then((response) => {
          expect(response.status).toBe(404);
          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toHaveProperty("message", "not found");
        });
    });
    
});

// describe("GET /teachers/attendances/:className", () => {
//       test("GET /teachers/attendances/:className - success", () => {
//     return request(app)
//       .get("/teachers/attendances/" + )
//       .set("access_token", access_token)
//       .then((response) => {
//         expect(response.status).toBe(201);
//         expect(response.body).toBeInstanceOf(Object);
// expect(response.body[0]).toHaveProperty("score", expect.any(String));
//         expect(response.body).toHaveProperty("message", "success Add Exam");
//       });
//   });
// });



