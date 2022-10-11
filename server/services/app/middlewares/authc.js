const { Student, Teacher } = require("../models");
const { verifyToken } = require("../helpers/jwt");

async function authc(req, res, next) {
  try {
    const access_token = req.headers.access_token;
    if (!access_token) throw { name: "Unauthorized" };
    const decodeToken = verifyToken(access_token);
    const findUser = await Student.findByPk(decodeToken.id);
    const findTeacher = await Teacher.findByPk(decodeToken.id);
    if (!findUser && !findTeacher) {
      throw { name: "Invalid token" };
    } else {
      req.user = {
        id: findUser ? findUser.id : findTeacher.id,
        className: findUser ? findUser.className : null,
        CourseId: findTeacher ? findTeacher.CourseId : null,
      };
      console.log(req.user,"<<")
    }
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authc;
