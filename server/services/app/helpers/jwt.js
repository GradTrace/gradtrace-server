const jwt = require("jsonwebtoken");

const signToken = (payload) => jwt.sign(payload, process.env.jwt_secret);
const verifyToken = (token) => jwt.verify(token, process.env.jwt_secret);

module.exports = { signToken, verifyToken };
