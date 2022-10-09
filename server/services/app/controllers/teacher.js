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
  Attendance,
  Student,
  sequelize,
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

  static async getAssignmentById(req, res, next) {
    try {
      //filter by name

      let { id } = req.params;
      console.log(id);
      const data = await Assignment.findByPk(id);

      return res.status(200).json(data);
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
        where: {
          createById: `${req.user.id}`,
        },
        order: [["createdAt", "DESC"]],
      };

      if (!!name) {
        option.where = {
          ...option.where,
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
    const transaction = await sequelize.transaction();

    try {
      const { description, deadline, name, className } = req.body;
      if (!description) throw { name: "description is required" };
      // if (!CourseId) throw { name: "CourseId is required" };
      if (!deadline) throw { name: "deadline is required" };
      if (!name) throw { name: "name is required" };
      if (!className) throw { name: "className is required" };

      const createById = +req.user.id;
      const CourseId = +req.user.CourseId;

      // Add assignment
      const data = await Assignment.create(
        {
          description,
          CourseId,
          deadline,
          name,
          className,
          createById,
        },
        { transaction }
      );

      if (!data) throw { name: "Failed to add new assignment" };

      // Add assignmentGrades
      const students = await Student.findAll({ where: { className } });

      const studentData = students.map((el) => {
        return el.id;
      });

      const dataAssignmentGrades = studentData.map((el) => {
        return {
          score: 0,
          StudentId: el,
          AssignmentId: data.id,
          url: "none",
        };
      });

      // Add assignment grades
      const assignmentGrades = await AssignmentGrades.bulkCreate(
        dataAssignmentGrades,
        { transaction, dataAssignmentGrades }
      );

      await transaction.commit();
      return res
        .status(201)
        .json({ message: `Success create new ${data.name} assignment` });
    } catch (err) {
      await transaction.rollback();
      console.log(err);
      next(err);
    }
  }

  static async editAssignment(req, res, next) {
    try {
      const { description, deadline, name, className } = req.body;
      if (!description) throw { name: "description is required" };
      // if (!CourseId) throw { name: "CourseId is required" };
      if (!deadline) throw { name: "deadline is required" };
      if (!name) throw { name: "name is required" };
      if (!className) throw { name: "className is required" };

      const createById = +req.user.id;
      const CourseId = +req.user.CourseId;
      let { id } = req.params;
      const data = await Assignment.update(
        {
          description,
          CourseId,
          deadline,
          name,
          className,
          createById,
        },
        { where: { id } }
      );

      return res.status(201).json(data);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async deleteAssignment(req, res, next) {
    try {
      let { id } = req.params;
      const data = await Assignment.destroy({ where: { id } });
      if (!data) {
        throw { name: "not found" };
      }
      return res.status(200).json({ message: "success deleted" });
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

  static async examScoreBySubject(req, res, next) {
    try {
      let { name } = req.query;
      console.log(name, "<<");
      const data = await ExamGrades.findAll({
        include: [
          {
            model: Exam,
            include: [
              {
                model: Course,
              },
            ],
          },
          {
            model: Student,
          },
        ],
      });
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

  static async assignmetScoreBySubject(req, res, next) {
    try {
      let subject = req.query.subject;
      const data = await AssignmentGrades.findAll({
        include: [
          {
            model: Assignment,
            include: [
              {
                model: Course,
              },
            ],
          },
          {
            model: Student,
          },
        ],
      });
      return res.status(201).json(data);
    } catch (err) {
      console.log(err);
    }
  }

  //! UNTUK SEMENTARA NILAI AKHIR DI INPUT MANNNUAL DULU NDANN ... MASIH BELOM NEMU FORMULA NYA UNTUK KALKULASIIN

  static async getStudentAttendance(req, res, next) {
    try {
      const { className } = req.params;

      const result = await Attendance.findAll({
        include: [
          {
            model: Student,
            where: { className },
            attributes: {
              exclude: [
                "password",
                "email",
                "photo",
                "address",
                "phoneNumber",
                "gender",
                "createdAt",
                "updatedAt",
              ],
            },
          },
        ],
      });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TeacherController;
