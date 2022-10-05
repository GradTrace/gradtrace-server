const bcrypt = require("bcryptjs");

// Hash
const hashPassword = (password) => bcrypt.hashSync(password, 10);

// Compare
const comparePassword = (password, hashedPassword) =>
  bcrypt.compareSync(password, hashedPassword);

module.exports = {
  hashPassword,
  comparePassword,
};
