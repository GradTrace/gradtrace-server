const { Student } = require("../models");
const { verifyToken } = require("../helpers/jwt");

async function authc(req, res, next) {
  try {
    const access_token = req.headers.access_token;
    if (!access_token) throw { name: "Unauthorized" };
    const decodeToken = verifyToken(access_token);
    const findUser = await Student.findByPk(decodeToken.id);
    if (!findUser) {
      throw { name: "Invalid token" };
    } else {
      req.user = {
        id: findUser.id,
      };
    }
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authc;
