const { Op } = require("sequelize");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { getPagination } = require("../helpers/pagination");

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

      const payload = { id: findTeacher.id, role: "Teacher" };
      const access_token = signToken(payload);
      const loggedInName = findTeacher.fullName;

      res
        .status(200)
        .json({ access_token, loggedInName, CourseId: findTeacher.CourseId });
    } catch (err) {
      next(err);
    }
  }

  static async addExam(req, res, next) {
    try {
      let { name, CourseId, className } = req.body;
      if (!name) throw { name: "Fullname is required" };
      if (!CourseId) throw { name: "CourseId is required" };
      if (!className) throw { name: "Class name is required" };

      await Exam.create({ name, CourseId, className });
      res.status(201).json({ message: "success Add Exam" });
    } catch (err) {
      next(err);
    }
  }

  static async editExam(req, res, next) {
    try {
      let { name, CourseId, className } = req.body;
      if (!name) throw { name: "Fullname is required" };
      if (!CourseId) throw { name: "CourseId is required" };
      if (!className) throw { name: "Class name is required" };

      let { id } = req.params;
      await Exam.update({ name, CourseId, className }, { where: { id } });
      res.status(200).json({ message: "success Edit Exam" });
    } catch (err) {
      next(err);
    }
  }

  static async getExamByClass(req, res, next) {
    try {
      let courseId = req.user.CourseId;
      let params = req.params.className;

      let findExamId = await Exam.findAll({
        where: { CourseId: courseId, className: params },
      });
      res.status(201).json({ findExamId });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async addScore(req, res, next) {
    try {
      let { score, StudentId, ExamId } = req.body;

      if (!score) throw { name: "Score is required" };
      if (!StudentId) throw { name: "StudentId name is required" };
      if (!ExamId) throw { name: "ExamId is required" };

      await ExamGrades.create({ score, StudentId, ExamId });
      res.status(201).json({ message: "success Add score" });
    } catch (err) {
      next(err);
    }
  }

  static async editScore(req, res, next) {
    try {
      let { score, StudentId, ExamId } = req.body;
      if (!score) throw { name: "Score is required" };
      if (!StudentId) throw { name: "StudentId name is required" };
      if (!ExamId) throw { name: "ExamId is required" };

      let { id } = req.params;
      await ExamGrades.update({ score, StudentId, ExamId }, { where: { id } });
      res.status(200).json({ message: "success Edit score" });
    } catch (err) {
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
      next(err);
    }
  }

  static async getAssignmentById(req, res, next) {
    try {
      //filter by name
      let { id } = req.params;
      const data = await Assignment.findByPk(id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getAssignment(req, res, next) {
    try {
      //filter by name
      const { name, className } = req.query;

      const option = {
        where: {
          createById: `${req.user.id}`,
        },
        include: [
          {
            model: AssignmentGrades,
            include: [
              {
                model: Student,
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      };

      if (!!name) {
        option.where = {
          ...option.where,
          name: { [Op.iLike]: `%${name}%` },
        };
      }

      if (!!className) {
        option.where = {
          ...option.where,
          className: { [Op.iLike]: `%${className}%` },
        };
      }

      const data = await Assignment.findAll(option);

      return res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getAssignmented(req, res, next) {
    try {
      //filter by name
      const { page, size } = req.query;
      const { limit, offset } = getPagination(page - 1, size);
      const option = {
        limit,
        offset,
      };

      const data = await Assignment.findAndCountAll(option);

      return res.status(200).json(data);
    } catch (err) {
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
      next(err);
    }
  }

  static async postAssignment(req, res, next) {
    try {
      const { description, deadline, name, className } = req.body;
      if (!description) throw { name: "description is required" };
      if (!deadline) throw { name: "deadline is required" };
      if (!name) throw { name: "name is required" };
      if (!className) throw { name: "className is required" };

      const createById = +req.user.id;
      const CourseId = +req.user.CourseId;

      // Add assignment
      const data = await Assignment.create({
        description,
        CourseId,
        deadline,
        name,
        className,
        createById,
      });

      if (!data) throw { name: "Failed to add new assignment" };
      res
        .status(201)
        .json({ message: `Success create new ${data.name} assignment` });
    } catch (err) {
      // await transaction.rollback();
      next(err);
    }
  }

  static async editAssignment(req, res, next) {
    try {
      const { description, deadline, name, className } = req.body;
      if (!description) throw { name: "description is required" };
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

      return res.status(201).json({ message: "success edit" });
    } catch (err) {
      next(err);
    }
  }

  static async deleteAssignment(req, res, next) {
    try {
      let { id } = req.params;
      const data = await Assignment.destroy({ where: { id } });
      if (!data) throw { name: "not found" };

      return res.status(200).json({ message: "success deleted" });
    } catch (err) {
      next(err);
    }
  }

  static async getCourses(req, res, next) {
    try {
      const data = await Course.findAll();
      return res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async examScoreBySubject(req, res, next) {
    try {
      let CourseId = req.user.CourseId;
      const result = await Student.findAll({
        attributes: { exclude: ["password"] },
        include: [
          {
            model: ExamGrades,
            include: [
              {
                model: Exam,
                where: {
                  CourseId,
                },
              },
            ],
          },
        ],
        order: [
          ["fullName", "ASC"],
          [ExamGrades, "id", "ASC"],
        ],
      });

      return res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async examScoreById(req, res, next) {
    try {
      let id = req.params.id;
      let CourseId = req.user.CourseId;

      const data = await Student.findAll({
        include: [
          {
            model: ExamGrades,
            include: [
              {
                model: Exam,
                where: {
                  CourseId,
                },
                include: Course,
              },
            ],
          },
        ],
        where: { id },
      });

      return res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async editScoreById(req, res, next) {
    try {
      let data = req.body.data;
      const dataInput = await ExamGrades.bulkCreate(data, {
        updateOnDuplicate: ["score"],
      });

      return res.status(201).json(dataInput);
    } catch (err) {
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
      next(err);
    }
  }

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

  static async editAssignmentGrades(req, res, next) {
    try {
      const { score } = req.body;
      const { id } = req.params;
      await AssignmentGrades.update(
        {
          score,
        },
        { where: { id } }
      );

      return res.status(200).json({ message: "success edit score" });
    } catch (err) {
      next(err);
    }
  }
  static async getAssignmentGrades(req, res, next) {
    try {
      const { page, size, className, search } = req.query;
      const { limit, offset } = getPagination(page - 1, size);

      const CourseId = req.user.CourseId;

      let option = {
        include: [
          { model: Assignment, where: { CourseId } },
          { model: Student },
        ],
        order: [["updatedAt", "ASC"]],
        limit,
        offset,
      };

      if (!!className) {
        option.include[1].where = {
          className: { [Op.iLike]: `%${className}%` },
        };
      }

      if (!!search) {
        option.include[0].where = {
          CourseId,
          name: { [Op.iLike]: `%${search}%` },
        };
      }

      const data = await AssignmentGrades.findAndCountAll(option);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
  static async getAssignmentGradesById(req, res, next) {
    try {
      let { id } = req.params;
      const data = await AssignmentGrades.findByPk(id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TeacherController;
