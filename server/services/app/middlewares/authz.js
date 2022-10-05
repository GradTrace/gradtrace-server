const { Student } = require("../models");

async function studentAuthz(req, res, next) {
  try {
    const studentId = +req.user.id;
    const student = await Student.findOne({ where: { id: studentId } });

    if (!student) {
      throw { name: "Student not found" };
    } else if (student.id != studentId) {
      throw { name: "Forbidden" };
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { studentAuthz };
