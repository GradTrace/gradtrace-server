const { Op } = require("sequelize");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

const {
  Teacher,
  Exam,
  ExamGrades,
  AssignmentGrades,
  Assignment,
  Course,
  FinalGrades,
} = require("../models");

class TeacherController {
  static async register(req, res, next) {
    try {
      const { fullName, CourseId, email, password, photo } = req.body;

      if (!fullName) throw { name: "Fullname is required" };
      if (!CourseId) throw { name: "Course ID is required" };
      if (!email) throw { name: "Email is required" };
      if (!password) throw { name: "Password is required" };

      const emailCheck = await Teacher.findOne({ where: { email } });
      if (emailCheck) throw { name: "Email must be unique" };

      await Teacher.create({ fullName, CourseId, email, password, photo });

      const findTeacher = await Teacher.findOne({ where: { email } });
      res.status(201).json({ id: findTeacher.id, email: findTeacher.email });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) throw { name: "Email is required" };
      if (!password) throw { name: "Password is required" };

      const findTeacher = await Teacher.findOne({ where: { email } });
      if (!findTeacher) throw { name: "Invalid email/password" };

      const validatePassword = comparePassword(password, findTeacher.password);
      if (!validatePassword) throw { name: "Invalid email/password" };

      const payload = { id: findTeacher.id };
      const access_token = signToken(payload);
      const loggedInName = findTeacher.fullName;

      // nanti tambahin photo, untuk di set di web
      res.status(200).json({ access_token, loggedInName });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async addExam(req, res, next) {
    try {
      let { name, CourseId, className } = req.body;
      if (!name) {
        throw { name: "Fullname is required" };
      }
      if (!CourseId) {
        throw { name: "CourseId is required" };
      }
      if (!className) {
        throw { name: "Class name is required" };
      }
      await Exam.create({ name, CourseId, className });
      res.status(201).json({ message: "success Add Exam" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async editExam(req, res, next) {
    try {
      let { name, CourseId, className } = req.body;
      if (!name) {
        throw { name: "Fullname is required" };
      }
      if (!CourseId) {
        throw { name: "CourseId is required" };
      }
      if (!className) {
        throw { name: "Class name is required" };
      }
      let { id } = req.params;
      console.log(id);
      await Exam.update({ name, CourseId, className }, { where: { id } });
      res.status(200).json({ message: "success Edit Exam" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async addScore(req, res, next) {
    try {
      let { score, StudentId, ExamId } = req.body;
      if (!score) {
        throw { name: "Score is required" };
      }
      if (!StudentId) {
        throw { name: "StudentId name is required" };
      }
      if (!ExamId) {
        throw { name: "ExamId is required" };
      }
      console.log(req.body, "<<<<");
      await ExamGrades.create({ score, StudentId, ExamId });
      res.status(201).json({ message: "success Add score" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async editScore(req, res, next) {
    try {
      let { score, StudentId, ExamId } = req.body;
      if (!score) {
        throw { name: "Score is required" };
      }
      if (!StudentId) {
        throw { name: "StudentId name is required" };
      }
      if (!ExamId) {
        throw { name: "ExamId is required" };
      }
      let { id } = req.params;
      console.log(id, "<<<<");
      console.log(req.body, "<<<<");
      await ExamGrades.update({ score, StudentId, ExamId }, { where: { id } });
      res.status(200).json({ message: "success Edit score" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async assignmentScore(req, res, next) {
    try {
      const { id, score } = req.body;
      await AssignmentGrades.update(
        {
          score,
        },
        {
          where: { id },
        }
      );
      res.status(201).json({ message: "success input assignment score" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getAssignment(req, res, next) {
    try {
      //filter by name
      const { name } = req.query;

      const option = {
        where: {},
        order: [["createdAt", "DESC"]],
      };

      if (!!name) {
        option.where = {
          name: { [Op.iLike]: `%${name}%` },
        };
      }

      const data = await Assignment.findAll(option);

      return res.status(201).json(data);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getGradeAssignment(req, res, next) {
    try {
      const { id } = req.params;
      const option = {
        where: {
          AssignmentId: id,
        },
      };

      const data = await AssignmentGrades.findAll(option);

      return res.status(201).json(data);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async postAssignment(req, res, next) {
    try {
      const data = await Assignment.create(req.body);
      return res.status(201).json(data);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getCourses(req, res, next) {
    try {
      const data = await Course.findAll();
      return res.status(201).json(data);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async addFinalGrades(req, res, next) {
    try {
      let { StudentId, CourseId } = req.body;
      let nilai = await ExamGrades.findOne({ where: { StudentId } });
      console.log(nilai, "<<<");
      await FinalGrades.create({ score: nilai, StudentId, CourseId });
      res.status(201).json({ message: "success Add score FinalGrades" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  //! UNTUK SEMENTARA NILAI AKHIR DI INPUT MANNNUAL DULU NDANN ... MASIH BELOM NEMU FORMULA NYA UNTUK KALKULASIIN
}

module.exports = TeacherController;
