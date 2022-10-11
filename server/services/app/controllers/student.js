const { comparePassword } = require("../helpers/bcrypt");
const nilaiAkhir = require("../helpers/hitungNilaiAkhir");
const { signToken } = require("../helpers/jwt");
const {
  Student,
  Attendance,
  Assignment,
  Course,
  AssignmentGrades,
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
      res
        .status(200)
        .json({ access_token, loggedInName, StudentId: findStudent.id });
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
      const StudentId = req.user.id;
      const className = req.user.className;
      const data = await Assignment.findAll({
        where: { className },
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
      // if (!findAssignment) throw { name: "Assignment not found" }; // bisa create

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

      //! bikin jadi create atau createOrUpdate, dibuat saat murid submit
      // await AssignmentGrades.update(
      //   { url },
      //   { where: { StudentId, AssignmentId: taskId } }
      // )

      res.status(200).json({ message: `Assignment url collected: ${url}` });
    } catch (err) {
      next(err);
    }
  }

  static async showStudentScore(req, res, next) {
    try {
      const StudentId = req.user.id;
      let uas = 0;
      let uts = 0;
      let ulangan = [];
      let tugas = [];

      // TODO: 1. Find List of nilai tugas
      let resultTugas = await AssignmentGrades.findAll({ where: StudentId })
      tugas = resultTugas.map(item => { return item.score })

      // TODO: 2. Find list of nilai ulangan harian doang. Asumsi isi exam grade , cmn ulangan harian doang

      // let resultExam = await ExamGrades.findAll({ where: StudentId })
      // ulangan = resultExam.map(item => { return item.score })


      // TODO: 3. Find kumulatif skor.



      // TODO : 4. MASOKIN SEMUA 1 1 DALAM OBJEK, BIAR GA BINGUNG BOS


      res.status(200).json({ message: `masih beloman nih` })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = StudentController;
