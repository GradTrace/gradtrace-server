const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { Teacher } = require("../models");

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
}

module.exports = TeacherController;
