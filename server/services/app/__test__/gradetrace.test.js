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

const student = [
  {
    fullName: "name_test",
    className: "class_test",
    email: "email_student_test@gmail.com",
    password: hashPassword("password_test"),
    photo:
      "https://toppng.com//public/uploads/preview/black-widow-natasha-romanoff-infinity-war-11563164367lbcfuwdyt2.png",
    address: "address_test",
    phoneNumber: "phoneNumber_test",
    gender: "gender_test",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    fullName: "John Doe",
    className: "9",
    email: "johndoe@mail.com",
    password: hashPassword("johndoe"),
    photo:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
    address: "Home sweet home",
    phoneNumber: "0812345678",
    gender: "Male",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    fullName: "name1_test",
    className: "9",
    email: "email_student1_test@gmail.com",
    password: hashPassword("password_test"),
    photo:
      "https://toppng.com//public/uploads/preview/black-widow-natasha-romanoff-infinity-war-11563164367lbcfuwdyt2.png",
    address: "address_test1",
    phoneNumber: "phoneNumber_test1",
    gender: "gender_test1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    fullName: "name2_test",
    className: "9",
    email: "email_student2_test@gmail.com",
    password: hashPassword("password_test"),
    photo:
      "https://toppng.com//public/uploads/preview/black-widow-natasha-romanoff-infinity-war-11563164367lbcfuwdyt2.png",
    address: "address_test2",
    phoneNumber: "phoneNumber_test2",
    gender: "gender_test2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let access_token;
let access_token_student;
let testId = 1;

beforeAll(async () => {
  await queryInterface
    .bulkInsert("Students", student, {})
    .then(() => {
      return Student.findOne({
        where: {
          email: student[0].email,
        },
      });
    })
    .then((result) => {
      studentId = result.id;
      access_token_student = signToken({
        id: result.id,
        email: result.email,
        role : 'Student'
      });
    });

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
        role : 'Teacher'
      });
    });

  await queryInterface.bulkInsert("Assignments", [
    {
      description: "description_test",
      CourseId: 1,
      deadline: "2022-12-12 18:00:00",
      name: "name_test1",
      className: "class_test",
      createById: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      description: "description_test_1",
      CourseId: 1,
      deadline: "2022-12-12 18:00:00",
      name: "name_test",
      className: "class_test",
      createById: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      description: "description_test_1",
      CourseId: 1,
      deadline: "2022-12-12 18:00:00",
      name: "name_test",
      className: "class",
      createById: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      description: "description_test_1",
      CourseId: 1,
      deadline: "2022-12-12 18:00:00",
      name: "name_test",
      className: "class_test",
      createById: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      description: "description_test_1",
      CourseId: 1,
      deadline: "2022-12-12 18:00:00",
      name: "name_test",
      className: "class_test",
      createById: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      description: "description_test_1",
      CourseId: 1,
      deadline: "2022-12-12 18:00:00",
      name: "name_test",
      className: "class_test",
      createById: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      description: "description_test_1",
      CourseId: 1,
      deadline: "2022-12-12 18:00:00",
      name: "name_test",
      className: "class_test1",
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
      score: 99,
      StudentId: 1,
      AssignmentId: 2,
      url: "www.google.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      score: 99,
      StudentId: 1,
      AssignmentId: 3,
      url: "www.google.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      score: 99,
      StudentId: 1,
      AssignmentId: 4,
      url: "www.google.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      score: 99,
      StudentId: 1,
      AssignmentId: 5,
      url: "www.google.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      score: 99,
      StudentId: 2,
      AssignmentId: 6,
      url: "www.google.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      score: 99,
      StudentId: 1,
      AssignmentId: 7,
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

  const d = new Date();
  d.setDate(d.getDate() - 2);

  await queryInterface.bulkInsert("Attendances", [
    {
      dateAndTime: new Date(),
      StudentId: 1,
      status: true,
      lon: `106°50'07.1"E`,
      lat: `6°11'30.4"S`,
      createdAt: d,
      updatedAt: d,
    },
  ]);
});

afterAll(async () => {
  await queryInterface.bulkDelete("Students", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await queryInterface.bulkDelete("Teachers", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await queryInterface.bulkDelete("Assignments", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await queryInterface.bulkDelete("AssignmentGrades", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await queryInterface.bulkDelete("ExamGrades", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await queryInterface.bulkDelete("Attendances", null, {
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
  test("POST /teachers/exams - failed - invalid token", () => {
    return request(app)
      .post("/teachers/exams")
      .set("access_token", access_token_student)
      .send({
        name: "name_test",
        CourseId: 1,
        className: "class_test",
      })
      .then((response) => {
        console.log(response, "<<asd")
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

describe("GET /teachers/exams/:className", () => {
  test("GET /teachers/exams/:className - success", () => {
    return request(app)
      .get("/teachers/exams/7")
      .set("access_token", access_token)
      .then((response) => {
        expect(response.status).toBe(201);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("findExamId", expect.any(Array));
        expect(response.body.findExamId).toBeInstanceOf(Array);
        expect(response.body.findExamId[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body.findExamId[0]).toHaveProperty("CourseId", expect.any(Number));
        expect(response.body.findExamId[0]).toHaveProperty("name", expect.any(String));
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
        expect(response.body[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body[0]).toHaveProperty(
          "className",
          expect.any(String)
        );
        expect(response.body[0]).toHaveProperty("fullName", expect.any(String));
        expect(response.body[0]).toHaveProperty("email", expect.any(String));
        expect(response.body[0]).toHaveProperty("photo", expect.any(String));
        expect(response.body[0]).toHaveProperty("address", expect.any(String));
        expect(response.body[0]).toHaveProperty("phoneNumber", expect.any(String));
        expect(response.body[0]).toHaveProperty("gender", expect.any(String));
      });
  });
});

describe("GET /teachers/exams/score/:id", () => {
  test("GET /teachers/exams/score/:id - success", () => {
    return request(app)
      .get("/teachers/exams/score/" + testId)
      .set("access_token", access_token)
      .then((response) => {
        expect(response.status).toBe(201);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toBeInstanceOf(Object);
        expect(response.body[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body[0]).toHaveProperty(
          "className",
          expect.any(String)
        );
        expect(response.body[0]).toHaveProperty("fullName", expect.any(String));
        expect(response.body[0]).toHaveProperty("email", expect.any(String));
        expect(response.body[0]).toHaveProperty("photo", expect.any(String));
        expect(response.body[0]).toHaveProperty("address", expect.any(String));
        expect(response.body[0]).toHaveProperty("phoneNumber", expect.any(String));
        expect(response.body[0]).toHaveProperty("gender", expect.any(String));
      });
  });
});

describe("PUT /teachers/exams/score", () => {
  test("PUT /teachers/exams/score - success", () => {
    return request(app)
      .put("/teachers/exams/score/")
      .set("access_token", access_token)
      .send({
        "data": [
            {
                "score": 10,
                "StudentId": 1,
                "ExamId": 1
            }
        ]
    })
      .then((response) => {
        expect(response.status).toBe(201);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toBeInstanceOf(Object);
        expect(response.body[0]).toHaveProperty("id",expect.any(Number));
        expect(response.body[0]).toHaveProperty("score",expect.any(String));
        expect(response.body[0]).toHaveProperty("StudentId",expect.any(Number));
        expect(response.body[0]).toHaveProperty("ExamId",expect.any(Number));
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
  test("GET /teachers/assignment - success", () => {
    return request(app)
      .get("/teachers/assignment?name=&className=class_test")
      .set("access_token", access_token)
      .then((response) => {
        console.log(response, "<<>>");
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

describe("GET /teachers/assignments", () => {
  test("GET /teachers/assignments - success", () => {
    return request(app)
      .get("/teachers/assignments")
      .set("access_token", access_token)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("count",expect.any(Number));
        expect(response.body).toHaveProperty("rows",expect.any(Array));
        expect(response.body.rows[0]).toHaveProperty("id",expect.any(Number));
        expect(response.body.rows[0]).toHaveProperty("description",expect.any(String));
        expect(response.body.rows[0]).toHaveProperty("CourseId",expect.any(Number));
        expect(response.body.rows[0]).toHaveProperty("deadline",expect.any(String));
        expect(response.body.rows[0]).toHaveProperty("name",expect.any(String));
        expect(response.body.rows[0]).toHaveProperty("className",expect.any(String));
 
      });
  });

  test("GET /teachers/assignments - invalid token", () => {
    return request(app)
      .get("/teachers/assignments")
      .set("access_token", "invalid_token")
      .then((response) => {
        expect(response.status).toBe(401);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "Invalid token");
      });
  });

  test("GET /teachers/assignments - failed - unauthorized", () => {
    return request(app)
      .get("/teachers/assignments")
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
  test("GET /teachers/assignment/:id - failed - unauthorized", () => {
    return request(app)
      .get("/teachers/assignment/" + testId)
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

describe("DELETE /teachers/assignment", () => {
  test("DELETE /teachers/assignment - success", () => {
    return request(app)
      .delete("/teachers/assignment/" + testId)
      .set("access_token", access_token)
      .then((response) => {
        console.log(response.body,"<<<")
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
        expect(response.body).toHaveProperty(
          "message",
          "Unauthorized activity"
        );
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

describe("GET /teachers/attendances/:className", () => {
  test("GET /teachers/attendances/:className - success", () => {
    return request(app)
      .get("/teachers/attendances/" + testId)
      .set("access_token", access_token)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
      });
  });
  test("GET /teachers/attendances/:className - failed - unauthorized", () => {
    return request(app)
      .get("/teachers/attendances/" + testId)
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
// describe("POST /teachers/scores/final", () => {
//   test("POST /teachers/scores/final - success", () => {
//     return request(app)
//       .post("/teachers/scores/final")
//       .set("access_token", access_token)
//       .send({
//         score: 100,
//         CourseId: 1,
//         StudentId: 1,
//       })
//       .then((response) => {
//         console.log(response, "<<>>");
//         expect(response.status).toBe(200);
//         expect(response.body).toBeInstanceOf(Object);
//       });
//   });
//sequelize db error
// test("POST /teachers/scores/final - failed - unauthorized", () => {
//   return request(app)
//     .post("/teachers/scores/final")
//     .then((response) => {
//       expect(response.status).toBe(403);
//       expect(response.body).toBeInstanceOf(Object);
//       expect(response.body).toHaveProperty(
//         "message",
//         "Unauthorized activity"
//       );
//     });
// });
// });
describe("PUT /teachers/scores/:id", () => {
  test("POST /teachers/scores/:id - success", () => {
    return request(app)
      .put("/teachers/scores/" + testId)
      .set("access_token", access_token)
      .send({
        score: 100,
        StudentId: 1,
        ExamId: 1,
      })
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "success Edit score");
      });
  });
  test("POST /teachers/scores/:id - failed - Score is required", () => {
    return request(app)
      .put("/teachers/scores/" + testId)
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
  test("POST /teachers/scores/:id - failed - StudentId is required", () => {
    return request(app)
      .put("/teachers/scores/" + testId)
      .set("access_token", access_token)
      .send({
        score: 100,
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
  test("POST /teachers/scores/:id - failed - ExamId is required", () => {
    return request(app)
      .put("/teachers/scores/" + testId)
      .set("access_token", access_token)
      .send({
        score: 100,
        StudentId: 1,
        ExamId: "",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "ExamId is required");
      });
  });

  test("PUT /teachers/scores/:id - failed - unauthorized", () => {
    return request(app)
      .put("/teachers/scores/:id")
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
describe("PUT /teachers/assignment/:id", () => {
  test("PUT /teachers/assignment/:id - success", () => {
    return request(app)
      .put("/teachers/assignment/" + testId)
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
        expect(response.body).toHaveProperty("message", "success edit");
      });
  });

  test("PUT /teachers/assignment/:id - failed - description is required", () => {
    return request(app)
      .put("/teachers/assignment/" + testId)
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
  test("PUT /teachers/assignment/:id - failed - deadline is required", () => {
    return request(app)
      .put("/teachers/assignment/" + testId)
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
  test("PUT /teachers/assignment/:id - failed - name is required", () => {
    return request(app)
      .put("/teachers/assignment/" + testId)
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
  test("PUT /teachers/assignment/:id - failed - className is required", () => {
    return request(app)
      .put("/teachers/assignment/" + testId)
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

  test("PUT /teachers/assignment/:id - failed - unauthorized", () => {
    return request(app)
      .put("/teachers/scores/:id")
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
describe("GET /teachers/assignmentGrades", () => {
  test("GET /teachers/assignmentGrades - success", () => {
    return request(app)
      .get("/teachers/assignmentGrades")
      .set("access_token", access_token)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("count", expect.any(Number));
        expect(response.body).toHaveProperty("rows", expect.any(Array));
        expect(response.body.rows[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body.rows[0]).toHaveProperty("score", expect.any(String));
        expect(response.body.rows[0]).toHaveProperty("StudentId", expect.any(Number));
        expect(response.body.rows[0]).toHaveProperty("AssignmentId", expect.any(Number));
        expect(response.body.rows[0]).toHaveProperty("url", expect.any(String));
        expect(response.body.rows[0]).toHaveProperty("Assignment", expect.any(Object));
        expect(response.body.rows[0]).toHaveProperty("Student", expect.any(Object));
        expect(response.body.rows[0].Assignment).toHaveProperty("id", expect.any(Number));
        expect(response.body.rows[0].Assignment).toHaveProperty("description", expect.any(String));
        expect(response.body.rows[0].Assignment).toHaveProperty("CourseId", expect.any(Number));
        expect(response.body.rows[0].Assignment).toHaveProperty("deadline", expect.any(String));
        expect(response.body.rows[0].Assignment).toHaveProperty("name", expect.any(String));
        expect(response.body.rows[0].Assignment).toHaveProperty("className", expect.any(String));
        expect(response.body.rows[0].Assignment).toHaveProperty("createById", expect.any(Number));
        expect(response.body.rows[0].Student).toHaveProperty("id", expect.any(Number));
        expect(response.body.rows[0].Student).toHaveProperty("fullName", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("className", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("email", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("password", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("photo", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("address", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("phoneNumber", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("gender", expect.any(String));
      });
  });
  
  test("GET /teachers/assignmentGrades?size=5&page=2&className=&search= - success - pagination", () => {
    return request(app)
      .get("/teachers/assignmentGrades?size=5&page=2&className=&search=")
      .set("access_token", access_token)
      .then((response) => {
        console.log(response.body)
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("count", expect.any(Number));
        expect(response.body).toHaveProperty("rows", expect.any(Array));
        expect(response.body.rows[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body.rows[0]).toHaveProperty("score", expect.any(String));
        expect(response.body.rows[0]).toHaveProperty("StudentId", expect.any(Number));
        expect(response.body.rows[0]).toHaveProperty("AssignmentId", expect.any(Number));
        expect(response.body.rows[0]).toHaveProperty("url", expect.any(String));
        expect(response.body.rows[0]).toHaveProperty("Assignment", expect.any(Object));
        expect(response.body.rows[0]).toHaveProperty("Student", expect.any(Object));
        expect(response.body.rows[0].Assignment).toHaveProperty("id", expect.any(Number));
        expect(response.body.rows[0].Assignment).toHaveProperty("description", expect.any(String));
        expect(response.body.rows[0].Assignment).toHaveProperty("CourseId", expect.any(Number));
        expect(response.body.rows[0].Assignment).toHaveProperty("deadline", expect.any(String));
        expect(response.body.rows[0].Assignment).toHaveProperty("name", expect.any(String));
        expect(response.body.rows[0].Assignment).toHaveProperty("className", expect.any(String));
        expect(response.body.rows[0].Assignment).toHaveProperty("createById", expect.any(Number));
        expect(response.body.rows[0].Student).toHaveProperty("id", expect.any(Number));
        expect(response.body.rows[0].Student).toHaveProperty("fullName", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("className", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("email", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("password", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("photo", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("address", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("phoneNumber", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("gender", expect.any(String));
      });
  });
  test("GET /teachers/assignmentGrades?size=5&page=1&className=class&search= - success - filter by className", () => {
    return request(app)
      .get("/teachers/assignmentGrades?size=5&page=1&className=9&search=")
      .set("access_token", access_token)
      .then((response) => {
        console.log(response.body)
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("count", expect.any(Number));
        expect(response.body).toHaveProperty("rows", expect.any(Array));
        expect(response.body.rows[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body.rows[0]).toHaveProperty("score", expect.any(String));
        expect(response.body.rows[0]).toHaveProperty("StudentId", expect.any(Number));
        expect(response.body.rows[0]).toHaveProperty("AssignmentId", expect.any(Number));
        expect(response.body.rows[0]).toHaveProperty("url", expect.any(String));
        expect(response.body.rows[0]).toHaveProperty("Assignment", expect.any(Object));
        expect(response.body.rows[0]).toHaveProperty("Student", expect.any(Object));
        expect(response.body.rows[0].Assignment).toHaveProperty("id", expect.any(Number));
        expect(response.body.rows[0].Assignment).toHaveProperty("description", expect.any(String));
        expect(response.body.rows[0].Assignment).toHaveProperty("CourseId", expect.any(Number));
        expect(response.body.rows[0].Assignment).toHaveProperty("deadline", expect.any(String));
        expect(response.body.rows[0].Assignment).toHaveProperty("name", expect.any(String));
        expect(response.body.rows[0].Assignment).toHaveProperty("className", expect.any(String));
        expect(response.body.rows[0].Assignment).toHaveProperty("createById", expect.any(Number));
        expect(response.body.rows[0].Student).toHaveProperty("id", expect.any(Number));
        expect(response.body.rows[0].Student).toHaveProperty("fullName", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("className", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("email", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("password", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("photo", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("address", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("phoneNumber", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("gender", expect.any(String));
      });
  });
  test("GET /teachers/assignmentGrades?size=5&page=1&className=&search=name_test - success - search by assignmet Name", () => {
    return request(app)
      .get("/teachers/assignmentGrades?size=5&page=2&className=&search=name_test")
      .set("access_token", access_token)
      .then((response) => {
        console.log(response.body)
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("count", expect.any(Number));
        expect(response.body).toHaveProperty("rows", expect.any(Array));
        expect(response.body.rows[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body.rows[0]).toHaveProperty("score", expect.any(String));
        expect(response.body.rows[0]).toHaveProperty("StudentId", expect.any(Number));
        expect(response.body.rows[0]).toHaveProperty("AssignmentId", expect.any(Number));
        expect(response.body.rows[0]).toHaveProperty("url", expect.any(String));
        expect(response.body.rows[0]).toHaveProperty("Assignment", expect.any(Object));
        expect(response.body.rows[0]).toHaveProperty("Student", expect.any(Object));
        expect(response.body.rows[0].Assignment).toHaveProperty("id", expect.any(Number));
        expect(response.body.rows[0].Assignment).toHaveProperty("description", expect.any(String));
        expect(response.body.rows[0].Assignment).toHaveProperty("CourseId", expect.any(Number));
        expect(response.body.rows[0].Assignment).toHaveProperty("deadline", expect.any(String));
        expect(response.body.rows[0].Assignment).toHaveProperty("name", expect.any(String));
        expect(response.body.rows[0].Assignment).toHaveProperty("className", expect.any(String));
        expect(response.body.rows[0].Assignment).toHaveProperty("createById", expect.any(Number));
        expect(response.body.rows[0].Student).toHaveProperty("id", expect.any(Number));
        expect(response.body.rows[0].Student).toHaveProperty("fullName", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("className", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("email", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("password", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("photo", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("address", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("phoneNumber", expect.any(String));
        expect(response.body.rows[0].Student).toHaveProperty("gender", expect.any(String));
      });
  });
});
describe("GET /teachers/assignmentGrades/:id", () => {
  test("GET /teachers/assignmentGrades - success", () => {
    return request(app)
      .get("/teachers/assignmentGrades/" + 2)
      .set("access_token", access_token)
      .then((response) => {
        console.log(response.body,"asasas")
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("id",expect.any(Number));
        expect(response.body).toHaveProperty("score",expect.any(String));
        expect(response.body).toHaveProperty("StudentId",expect.any(Number));
        expect(response.body).toHaveProperty("AssignmentId",expect.any(Number));
        expect(response.body).toHaveProperty("url",expect.any(String));
      });
  });

  test("GET /teachers/assignmentGrades - failed", () => {
    return request(app)
      .get("/teachers/assignmentGrades/asd")
      .set("access_token", access_token)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message",expect.any(String));
      });
  });
});

describe("PATCH /teachers/assignmentGrades/:id", () => {
  test("PATCH /teachers/assignmentGrades - success", () => {
    return request(app)
      .patch("/teachers/assignmentGrades/" + testId)
      .set("access_token", access_token)
      .send({
        score : 100
      })
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "success edit score");
      });
  });
  test("PATCH /teachers/assignmentGrades - failed - score is required", () => {
    return request(app)
      .patch("/teachers/assignmentGrades/" + testId)
      .set("access_token", access_token)
      .send({
        score : ""
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Score is required");
      });
  });
});

//====================================================================================

describe("POST /students/register", () => {
  test("POST /students/register - success test", () => {
    return request(app)
      .post("/students/register")
      .send({
        fullName: "name_test",
        className: "9",
        email: "email_student_test_beda@gmail.com",
        password: hashPassword("password_test"),
        photo:
          "https://toppng.com//public/uploads/preview/black-widow-natasha-romanoff-infinity-war-11563164367lbcfuwdyt2.png",
        address: "address_test",
        phoneNumber: "phoneNumber_test",
        gender: "gender_test",
      })
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);

        expect(response.body).toHaveProperty(
          "access_token",
          expect.any(String)
        );
        expect(response.body).toHaveProperty("loggedInName", "name_test");
      });
  });
  test("POST /students/register - failed - fullName is required", () => {
    return request(app)
      .post("/students/register")
      .send({
        fullName: "",
        className: "9",
        email: "email_student_test_beda@gmail.com",
        password: hashPassword("password_test"),
        photo:
          "https://toppng.com//public/uploads/preview/black-widow-natasha-romanoff-infinity-war-11563164367lbcfuwdyt2.png",
        address: "address_test",
        phoneNumber: "phoneNumber_test",
        gender: "gender_test",
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

  test("POST /students/register - failed - className is required", () => {
    return request(app)
      .post("/students/register")
      .send({
        fullName: "name_test",
        className: "",
        email: "email_student_test_beda@gmail.com",
        password: hashPassword("password_test"),
        photo:
          "https://toppng.com//public/uploads/preview/black-widow-natasha-romanoff-infinity-war-11563164367lbcfuwdyt2.png",
        address: "address_test",
        phoneNumber: "phoneNumber_test",
        gender: "gender_test",
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

  test("POST /students/register - failed - email is required", () => {
    return request(app)
      .post("/students/register")
      .send({
        fullName: "name_test",
        className: "9",
        email: "",
        password: hashPassword("password_test"),
        photo:
          "https://toppng.com//public/uploads/preview/black-widow-natasha-romanoff-infinity-war-11563164367lbcfuwdyt2.png",
        address: "address_test",
        phoneNumber: "phoneNumber_test",
        gender: "gender_test",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);

        expect(response.body).toHaveProperty("message", "Email is required");
      });
  });

  test("POST /students/register - failed - password is required", () => {
    return request(app)
      .post("/students/register")
      .send({
        fullName: "name_test",
        className: "9",
        email: "email_student_test_beda@gmail.com",
        password: "",
        photo:
          "https://toppng.com//public/uploads/preview/black-widow-natasha-romanoff-infinity-war-11563164367lbcfuwdyt2.png",
        address: "address_test",
        phoneNumber: "phoneNumber_test",
        gender: "gender_test",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);

        expect(response.body).toHaveProperty("message", "Password is required");
      });
  });

  test("POST /students/register - failed - gender is required", () => {
    return request(app)
      .post("/students/register")
      .send({
        fullName: "name_test",
        className: "9",
        email: "email_student_test_beda@gmail.com",
        password: hashPassword("password_test"),
        photo:
          "https://toppng.com//public/uploads/preview/black-widow-natasha-romanoff-infinity-war-11563164367lbcfuwdyt2.png",
        address: "address_test",
        phoneNumber: "phoneNumber_test",
        gender: "",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);

        expect(response.body).toHaveProperty("message", "Gender is required");
      });
  });

  test("POST /students/register - failed test - email must be unique", () => {
    return request(app)
      .post("/students/register")
      .send({
        fullName: "name_test",
        className: "9",
        email: "email_student_test@gmail.com",
        password: hashPassword("password_test"),
        photo:
          "https://toppng.com//public/uploads/preview/black-widow-natasha-romanoff-infinity-war-11563164367lbcfuwdyt2.png",
        address: "address_test",
        phoneNumber: "phoneNumber_test",
        gender: "gender_test",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "email must be unique");
      });
  });
});

describe("POST /students/login", () => {
  test("POST /students/login - success", () => {
    return request(app)
      .post("/students/login")
      .send({
        email: "email_student_test@gmail.com",
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
  test("POST /students/login - failed - email is required", () => {
    return request(app)
      .post("/students/login")
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

  test("POST /students/login - failed - password is required", () => {
    return request(app)
      .post("/students/login")
      .send({
        email: "email_student_test@gmail.com",
        password: "",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "Password is required");
      });
  });

  test("POST /students/login - failed - wrong password", () => {
    return request(app)
      .post("/students/login")
      .send({
        email: "email_student_test@gmail.com",
        password: "wrong",
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

  test("POST /students/login - failed - wrong email", () => {
    return request(app)
      .post("/students/login")
      .send({
        email: "wrong",
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
});

describe("GET /students/profile", () => {
  test("GET /students/profile - success", () => {
    return request(app)
      .get("/students/profile")
      .set("access_token", access_token_student)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("id", expect.any(Number));
        expect(response.body).toHaveProperty("fullName", expect.any(String));
        expect(response.body).toHaveProperty("email", expect.any(String));
        expect(response.body).toHaveProperty("photo", expect.any(String));
        expect(response.body).toHaveProperty("address", expect.any(String));
        expect(response.body).toHaveProperty("phoneNumber", expect.any(String));
        expect(response.body).toHaveProperty("gender", expect.any(String));
      });
  });
  test("GET /students/profile - invalid token", () => {
    return request(app)
      .get("/students/profile")
      .set("access_token", "invalid")
      .then((response) => {
        expect(response.status).toBe(401);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "Invalid token");
      });
  });
  test("GET /students/profile - unathorized", () => {
    return request(app)
      .get("/students/profile")
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
describe("GET /students/attendance", () => {
  test("GET /students/attendance - success", () => {
    return request(app)
      .get("/students/attendance")
      .set("access_token", access_token_student)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toBeInstanceOf(Object);
        expect(response.body[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body[0]).toHaveProperty(
          "StudentId",
          expect.any(Number)
        );
        expect(response.body[0]).toHaveProperty(
          "dateAndTime",
          expect.any(String)
        );
        expect(response.body[0]).toHaveProperty("status", expect.any(Boolean));
        expect(response.body[0]).toHaveProperty("lon", expect.any(String));
        expect(response.body[0]).toHaveProperty("lat", expect.any(String));
      });
  });

  test("GET /students/attendance - invalid token", () => {
    return request(app)
      .get("/students/attendance")
      .set("access_token", "invalidtoken")
      .then((response) => {
        expect(response.status).toBe(401);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "Invalid token");
      });
  });
});

describe("POST /students/attendance", () => {
  test("POST /students/attendance - success", () => {
    return request(app)
      .post("/students/attendance")
      .set("access_token", access_token_student)
      .send({
        lon: "106°50'07.1\"E",
        lat: "6°11'30.4\"S",
        dateAndTime: new Date(),
      })
      .then((response) => {
        console.log(response.body, "><");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("StudentId", expect.any(Number));
        expect(response.body).toHaveProperty("dateAndTime", expect.any(String));
        expect(response.body).toHaveProperty("status", expect.any(Boolean));
        expect(response.body).toHaveProperty("lon", expect.any(String));
        expect(response.body).toHaveProperty("lat", expect.any(String));
      });
  });
  // test("POST /students/attendance - failed - location is required", () => {
  //   return request(app)
  //     .post("/students/attendance")
  //     .set("access_token", access_token_student)
  //     .send({
  //       dateAndTime: new Date(),
  //     })
  //     .then((response) => {
  //       expect(response.status).toBe(400);
  //       expect(response.body).toBeInstanceOf(Object);
  //       expect(response.body).toHaveProperty(
  //         "message",
  //         "You have already recorded present today"
  //       );
  //     });
  // });
  test("POST /students/attendance - failed - already recorded", () => {
    return request(app)
      .post("/students/attendance")
      .set("access_token", access_token_student)
      .send({
        lon: "106°50'07.1\"E",
        lat: "6°11'30.4\"S",
        dateAndTime: "2022-10-06 16:01:18.707",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "You have already recorded present today"
        );
      });
  });
});

describe("GET /students/tasks", () => {
  test("GET /students/tasks - success", () => {
    return request(app)
      .get("/students/tasks")
      .set("access_token", access_token_student)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body[0]).toHaveProperty("CourseId", expect.any(Number));
        expect(response.body[0]).toHaveProperty(
          "description",
          expect.any(String)
        );
        expect(response.body[0]).toHaveProperty("deadline", expect.any(String));
        expect(response.body[0]).toHaveProperty("name", expect.any(String));
        expect(response.body[0]).toHaveProperty(
          "className",
          expect.any(String)
        );
        expect(response.body[0]).toHaveProperty("Course", expect.any(Object));
        expect(response.body[0]).toHaveProperty(
          "AssignmentGrades",
          expect.any(Array)
        );
        expect(response.body[0].Course).toHaveProperty(
          "name",
          expect.any(String)
        );
        expect(response.body[0].Course).toHaveProperty(
          "icon",
          expect.any(String)
        );
      });
  });
});


describe("PATCH /students/tasks/:id", () => {
  test("PATCH /students/tasks/:id - success", () => {
    return request(app)
      .patch("/students/tasks/" + 2)
      .set("access_token", access_token_student)
      .send({
        url: "www.test_url.com",
      })
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "Assignment url collected: www.test_url.com"
          );
      });
  });
  test("PATCH /students/tasks/:id - success", () => {
    return request(app)
      .patch("/students/tasks/" + 2)
      .send({
        url: "www.test_url.com",
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

    test("PATCH /students/tasks/:id - success", () => {
      return request(app)
      .patch("/students/tasks/" + 3)
      .set("access_token", access_token_student)
      .send({
        url: "www.test_url.com",
      })
      .then((response) => {
        console.log(response, "????");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "Assignment url collected: www.test_url.com"
          );
      });
    });
    test("PATCH /students/tasks/:id - success create new submission", () => {
      return request(app)
      .patch("/students/tasks/" + 6)
      .set("access_token", access_token_student)
      .send({
        url: "www.test_url.com",
      })
      .then((response) => {
        console.log(response, "????");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "Assignment url collected: www.test_url.com"
          );
      });
    });
  test("PATCH /students/tasks/:id - failed - url is required", () => {
    return request(app)
      .patch("/students/tasks/" + 2)
      .set("access_token", access_token_student)
      .send({
        url: "",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty(
          "message",
          "Assignment url is required"
        );
      });
  });
});

describe("GET /students/scores", () => {
  test("GET /students/scores - success", () => {
    return request(app)
      .get("/students/scores")
      .set("access_token", access_token_student)
      .then((response) => {
        console.log(response.body[0].scores,"<<<")
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toBeInstanceOf(Object);
        expect(response.body[0]).toHaveProperty(
          "id",
          expect.any(Number)
        );
        expect(response.body[0]).toHaveProperty(
          "scores",
          expect.any(Array)
        );
        expect(response.body[0].scores[0]).toHaveProperty(
          "course",
          expect.any(String)
        );
        expect(response.body[0].scores[0]).toHaveProperty(
          "name",
          expect.any(String)
        );
        expect(response.body[0].scores[0]).toHaveProperty(
          "score",
          expect.any(Number)
        );
      });
  });
  test("GET /students/scores - failed - invalid token", () => {
    return request(app)
      .get("/students/scores")
      .set("access_token", "sdsads")
      .then((response) => {
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty(
          "message",
          "Invalid token"
        );
      });
  });
  test("GET /students/scores - failed - unauthorized", () => {
    return request(app)
      .get("/students/scores")
      .then((response) => {
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty(
          "message",
          "Unauthorized activity"
        );
      });
  });
});