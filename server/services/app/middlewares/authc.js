const { Student, Teacher } = require("../models");
const { verifyToken } = require("../helpers/jwt");

async function authc(req, res, next) {
  try {
    const access_token = req.headers.access_token;
    if (!access_token) throw { name: "Unauthorized" };
    const decodeToken = verifyToken(access_token);
    console.log(decodeToken, "<<<< ini decode");
    if (decodeToken.role != "Student") throw { name: "Unauthorized" };
    const findUser = await Student.findByPk(decodeToken.id);
    if (!findUser) {
      throw { name: "Invalid token" };
    } else {
      req.user = {
        id: findUser.id,
        className: findUser.className,
      };
    }
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authc;
