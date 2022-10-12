const { comparePassword } = require("../helpers/bcrypt");
const nilaiAkhir = require("../helpers/hitungNilaiAkhir");
const { signToken } = require("../helpers/jwt");
const {
  Student,
  Attendance,
  Assignment,
  Course,
  AssignmentGrades,
  Exam,
  ExamGrades,
  sequelize,
  Sequelize,
} = require("../models");

class StudentController {
  static async register(req, res, next) {
    try {
      const {
        fullName,
        className,
        email,
        password,
        photo,
        address,
        phoneNumber,
        gender,
      } = req.body;

      if (!fullName) throw { name: "Fullname is required" };
      if (!className) throw { name: "Class name is required" };
      if (!email) throw { name: "Email is required" };
      if (!password) throw { name: "Password is required" };
      if (!gender) throw { name: "Gender is required" };

      // sudah dihandle di model
      // const emailCheck = await Student.findOne({ where: { email } });
      // if (emailCheck) throw { name: "Email must be unique" };

      await Student.create({
        fullName,
        className,
        email,
        password,
        photo,
        address,
        phoneNumber,
        gender,
      });

      const findStudent = await Student.findOne({ where: { email } });

      // login
      const payload = { id: findStudent.id, className: findStudent.className };
      res.status(200).json({
        access_token: signToken(payload),
        loggedInName: findStudent.fullName,
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) throw { name: "Email is required" };
      if (!password) throw { name: "Password is required" };

      const findStudent = await Student.findOne({ where: { email } });
      if (!findStudent) throw { name: "Invalid email/password" };

      const validatePassword = comparePassword(password, findStudent.password);
      if (!validatePassword) throw { name: "Invalid email/password" };

      const payload = { id: findStudent.id, className: findStudent.className };
      const access_token = signToken(payload);
      const loggedInName = findStudent.fullName;

      // nanti tambahin photo, untuk di set di web
      res.status(200).json({
        access_token,
        loggedInName,
        StudentId: findStudent.id,
        className: findStudent.className,
      });
    } catch (err) {
      next(err);
    }
  }

  static async showProfile(req, res, next) {
    try {
      const studentId = +req.user.id;
      const student = await Student.findOne({
        where: { id: studentId },
        attributes: { exclude: ["password"] },
      });
      if (!student) throw { name: "Student not found" };
      res.status(200).json(student);
    } catch (err) {
      next(err);
    }
  }

  static async newAttendance(req, res, next) {
    // bikin dolo variabel utk cek cekan
    const transaction = await sequelize.transaction();
    const Op = Sequelize.Op;
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();
    try {
      const StudentId = +req.user.id;
      // const dateAndTime = new Date();

      const { lon, lat, dateAndTime } = req.body;
      // console.log(lon, lat, " <<< ini coyy");
      // console.log(StudentId, dateAndTime, "data dari server");

      // checking if student had already present today :
      const checkAttendanceDayStud = await Attendance.findOne(
        {
          where: {
            StudentId,
            createdAt: {
              [Op.gt]: TODAY_START,
              [Op.lt]: NOW,
            },
          },
        },
        { transaction }
      );

      if (checkAttendanceDayStud) {
        throw { name: "already_present_today" };
      }

      if (!lon || !lat) throw { name: "location required" };

      const newAttendance = await Attendance.create(
        {
          StudentId,
          dateAndTime,
          status: true,
          lon,
          lat,
        },
        { transaction }
      );

      await transaction.commit();
      res.status(200).json(newAttendance);
    } catch (err) {
      await transaction.rollback();
      next(err);
    }
  }

  static async getAttendances(req, res, next) {
    try {
      const StudentId = +req.user.id;

      const result = await Attendance.findAll({
        where: { StudentId },
        order: [["id", "DESC"]],
      });

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getTasks(req, res, next) {
    try {
      // const StudentId = req.user.id;
      const className = req.user.className;
      const data = await Assignment.findAll({
        where: { className },
        order: [["deadline", "asc"]],
        include: [
          { model: Course, attributes: ["name", "icon"] },
          {
            model: AssignmentGrades,
            // attributes: ["StudentId", "score", "url"],
            // where: { StudentId },
          },
        ],
      });

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async submitTaskUrl(req, res, next) {
    try {
      const { taskId } = req.params;
      const StudentId = req.user.id;
      const { url } = req.body;

      if (!taskId) throw { name: "Assignment ID is required" };
      if (!url) throw { name: "url is required" };

      const findAssignment = await AssignmentGrades.findOne({
        where: { StudentId, AssignmentId: taskId },
      });

      // If assignment already present, then it will update the current asignment url
      // If there isn't any assignment submission, then it will create new data row
      if (findAssignment) {
        await AssignmentGrades.update(
          { url },
          { where: { StudentId, AssignmentId: taskId } }
        );
      } else if (!findAssignment) {
        await AssignmentGrades.create({
          score: 0,
          StudentId,
          AssignmentId: taskId,
          url: url,
        });
      }

      res.status(200).json({ message: `Assignment url collected: ${url}` });
    } catch (err) {
      next(err);
    }
  }

  static async showStudentScore(req, res, next) {
    try {
      const StudentId = req.user.id;
      const className = req.user.className;

      //! Belum handle nilai tugas
      let resultExam = await Course.findAll({
        include: [
          {
            model: Exam,
            where: {
              className,
            },
            include: [{ model: ExamGrades, where: { StudentId } }],
          },
        ],
      });

      //! Find Task Nya siswa kumpul tugas brapa banyak
      let resultTask = await Course.findAll({
        include: [
          {
            model: Assignment,
            where: {
              className,
            },
            include: [{ model: AssignmentGrades, where: { StudentId } }],
          },
        ],
      });

      // console.log(resultTask, `<< ini result task nya`)
      // loop menampilkan seluruh assigment yang udah dikerjain sama muridnya dari result task

      //! terus kelompokin
      const assignmentGrouping = {};

      resultTask.forEach((element) => {
        const trayOfCourseAssignments = [];
        const courseName = element.dataValues.name;
        // console.log(element.dataValues.name)
        const assignments = element.dataValues.Assignments;
        assignments.forEach((assignment) => {
          const assignmentName = assignment.dataValues.name;
          // console.log(assignmentName, `<< ini assignment nya`)
          let assignmentScores = 0;
          const assignmentGrades = assignment.dataValues.AssignmentGrades;
          assignmentGrades.forEach((grades) => {
            assignmentScores = grades.dataValues.score;
            // console.log(grades.dataValues, ` << MM ini gradesnya`)
          });
          trayOfCourseAssignments.push({ assignmentName, assignmentScores });
        });
        // console.log(trayOfCourseAssignments, `<< ini masokin`)
        assignmentGrouping[courseName] = trayOfCourseAssignments;
      });
      console.log(assignmentGrouping, `<< nih grouping assigment`);

      const submittedAssignment = Object.keys(assignmentGrouping);
      // console.log(submittedAssignment);

      console.log(
        assignmentGrouping["Physical Education"],
        "<<< ini nilai Physical Education"
      );
      // console.log(
      //   assignmentGrouping["Physics"].assignmentScores,
      //   `<< nih skornya`
      // );

      //! cari total semua course assignment
      let totalCourseAssignment = await sequelize.query(
        `SELECT
          "Course"."id",
          "Course"."name",
          COUNT("Assignments"."id") AS "totalAssignment"
        FROM
          "Courses" AS "Course"
        INNER JOIN "Assignments" AS "Assignments" ON
          "Course"."id" = "Assignments"."CourseId"
          AND "Assignments"."className" = '${className}'
        GROUP BY
          "Course"."id";`,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );
      console.log(totalCourseAssignment, `<< ni total course assignment`);

      //! TODO : NYOCOKIN, KALO ASSIGMENT GROUPINGNYA GAADA, KASIH NILAI O, KALO ADA, BAGI AJA DGN TOTAL ASSIGNMENT NYA
      let totalAssignmentScore = 0;

      totalCourseAssignment.forEach((item) => {
        delete item.id;
        submittedAssignment.forEach((el) => {
          if (el === item.name) {
            assignmentGrouping[item.name].forEach((score) => {
              totalAssignmentScore += +score.assignmentScores;
            });
            item.score = totalAssignmentScore / item.totalAssignment;
            totalAssignmentScore = 0;
          }
          else {
            item.score = 0
          }
        });
      });

      //! ini hasilnya score sisanya nolin aja
      console.log(totalCourseAssignment, `<< change`);

      const hasilAkhir = [];
      //! tampung hasil exam
      resultExam.map((course) => {
        let scores = [];
        course.Exams.map((score) => {
          let x = "";
          score.ExamGrades.map((el) => {
            x = el.score;
          });
          scores.push({
            course: course.name,
            name: score.name,
            score: +x,
          });
        });
        hasilAkhir.push({
          name: course.name,
          id: course.id,
          scores
        });
      });
      // console.log(hasilAkhir, `<< ini belom di pembobotan`)
      //! mencoba push hasil tugas ke hasil akhir
      hasilAkhir.forEach((el) => {
        totalCourseAssignment.forEach((tugas) => {
          if (el.name === tugas.name) {
            el.scores.push({
              course: el.name,
              name: "Nilai Tugas",
              score: +tugas.score
            })
          }
        })
      })

      //! pembobotan
      hasilAkhir.forEach((el) => {
        el.scores.push({
          course: el.name,
          name: "Final Score",
          score: (
            0.4 * el.scores[0].score +
            0.3 * el.scores[1].score +
            0.2 * ((el.scores[2].score + el.scores[3].score) / 2
            ) +
            0.1 * el.scores[4].score
          ).toFixed(2),
        });
      });
      // res.status(200).json(resultExam)
      res.status(200).json(hasilAkhir);
      // res.status(200).json(totalCourseAssignment);
      // res.status(200).json({ message: `beloman nih` })
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = StudentController;
