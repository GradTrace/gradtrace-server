const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { Teacher, Exam, ExamGrades, FinalGrades } = require("../models");

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
      next(err);
    }
  }
  static async addExam(req, res, next) {
    try {
      let { name, CourseId, className } = req.body;
      await Exam.create({ name, CourseId, className });
      res.status(201).json({ message: "success Add Exam" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async addScore(req, res, next) {
    try {
      let { score, StudentId, ExamId } = req.body;
      await ExamGrades.create({ score, StudentId, ExamId });
      res.status(201).json({ message: "success Add score" });
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
