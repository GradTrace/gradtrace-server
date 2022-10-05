"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    static associate(models) {
      // define association here
      Teacher.belongsTo(models.Course);
    }
  }
  Teacher.init(
    {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Fullname is required" },
          notEmpty: { msg: "Fullname is required" },
        },
      },
      CourseId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Course ID is required" },
          notEmpty: { msg: "Course ID is required" },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Email is required" },
          notEmpty: { msg: "Email is required" },
          isEmail: { msg: "Email must be valid" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Password is required" },
          notEmpty: { msg: "Password is required" },
        },
      },
      photo: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Teacher",
    }
  );

  Teacher.addHook("beforeCreate", (teacher, options) => {
    teacher.password = hashPassword(teacher.password);
  });

  return Teacher;
};
