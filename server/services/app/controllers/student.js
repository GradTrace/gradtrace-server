const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const {
  Student,
  Attendance,
  Assignment,
  Course,
  AssignmentGrades,
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

      const emailCheck = await Student.findOne({ where: { email } });
      if (emailCheck) throw { name: "Email must be unique" };

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
      res.status(201).json({ id: findStudent.id, email: findStudent.email });
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
      res.status(200).json({ access_token, loggedInName });
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
    try {
      const StudentId = +req.user.id;
      // const dateAndTime = new Date();

      const { lon, lat, dateAndTime } = req.body;
      console.log(lon, lat, " <<< ini coyy");
      console.log(StudentId, dateAndTime, "data dari server");

      if (!lon || !lat) throw { name: "location required" };

      const newAttendance = await Attendance.create({
        StudentId,
        dateAndTime,
        status: true,
        lon,
        lat,
      });
      res.status(200).json(newAttendance);
    } catch (err) {
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
        include: [
          { model: Course, attributes: ["name", "icon"] },
          { model: AssignmentGrades, attributes: ["url"] },
        ],
      });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = StudentController;
