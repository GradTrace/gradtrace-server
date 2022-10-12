const { Student, Teacher } = require("../models");
const { verifyToken } = require("../helpers/jwt");

async function autht(req, res, next) {
  try {
    const access_token = req.headers.access_token;
    if (!access_token) throw { name: "Unauthorized" };
    const decodeToken = verifyToken(access_token);
    if (decodeToken.role != "Teacher") throw { name: "Unauthorized" };
    const findTeacher = await Teacher.findByPk(decodeToken.id);
    if (!findTeacher) {
      throw { name: "Invalid token" };
    } else {
      req.user = {
        id: findTeacher.id,
        CourseId: findTeacher.CourseId,
      };
    }
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = autht;
