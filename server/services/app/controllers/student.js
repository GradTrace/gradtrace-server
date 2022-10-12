const { comparePassword } = require("../helpers/bcrypt");
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

      // Login
      const payload = { id: findStudent.id, className: findStudent.className , role : 'Student'};
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
    const transaction = await sequelize.transaction();
    const Op = Sequelize.Op;
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();
    try {
      const StudentId = +req.user.id;
      const { lon, lat, dateAndTime } = req.body;

      // Check if student had already create attendance today:
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
      const className = req.user.className;
      const data = await Assignment.findAll({
        where: { className },
        order: [["deadline", "asc"]],
        include: [
          { model: Course, attributes: ["name", "icon"] },
          {
            model: AssignmentGrades,
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
        where: { StudentId, AssignmentId: +taskId },
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

      // Find all exam scores
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

      // Find all assignment scores
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

      // Group assignment by course name
      const assignmentGrouping = {};

      resultTask.forEach((element) => {
        const trayOfCourseAssignments = [];
        const courseName = element.dataValues.name;
        const assignments = element.dataValues.Assignments;
        assignments.forEach((assignment) => {
          const assignmentName = assignment.dataValues.name;
          let assignmentScores = 0;
          const assignmentGrades = assignment.dataValues.AssignmentGrades;
          assignmentGrades.forEach((grades) => {
            assignmentScores = grades.dataValues.score;
          });
          trayOfCourseAssignments.push({ assignmentName, assignmentScores });
        });
        assignmentGrouping[courseName] = trayOfCourseAssignments;
      });

      const submittedAssignment = Object.keys(assignmentGrouping);

      // Find all course assignment
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

      // Group assignment by course name
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
          } else {
            item.score = 0;
          }
        });
      });

      const finalScore = [];

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
        finalScore.push({
          name: course.name,
          id: course.id,
          scores,
        });
      });

      // Push assignment score to final score array
      finalScore.forEach((el) => {
        totalCourseAssignment.forEach((tugas) => {
          if (el.name === tugas.name) {
            el.scores.push({
              course: el.name,
              name: "Nilai Tugas",
              score: +tugas.score,
            });
          }
        });
      });

      // Create weighted grades for student
      finalScore.forEach((el) => {
        // 0. Create tray store final score and exam score
        let trayOfFinalScore = 0;
        let trayOfExam = 0;
        el.scores.forEach((nilai) => {
          // 1. Check score name
          // 2. Weighting = (0.4 * UAS) + (0.3 * UTS) + (0.2 * avg daily exam) + (0.1 * avg assignment score)
          if (nilai.name === "UAS") {
            trayOfFinalScore += +nilai.score * 0.4;
          } else if (nilai.name === "UTS") {
            trayOfFinalScore += +nilai.score * 0.3;
          } else if (nilai.name.includes("Ulangan")) {
            trayOfExam += +nilai.score;
          } else if (nilai.name === "Nilai Tugas") {
            trayOfFinalScore += +nilai.score * 0.1;
          }
        });
        // For exam, there are 2 data
        trayOfFinalScore += (+trayOfExam / 2) * 0.2;

        el.scores.push({
          course: el.name,
          name: "Final Score",
          // 3. Push matched score and weighted to final score tray
          // 4. Push final score tray to final score object
          score: trayOfFinalScore,
        });
      });

      res.status(200).json(finalScore);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = StudentController;
