"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    static associate(models) {
      // define association here
      Student.belongsToMany(models.Course, {
        through: models.FinalGrades,
        foreignKey: "StudentId",
      });
      Student.hasMany(models.Attendance, {
        foreignKey: "StudentId",
      });
      Student.hasMany(models.AssignmentGrades, {
        foreignKey: "StudentId",
      });
      Student.hasMany(models.ExamGrades, {
        foreignKey: "StudentId",
      });
    }
  }
  Student.init(
    {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Fullname is required" },
          notEmpty: { msg: "Fullname is required" },
        },
      },
      className: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Class name is required" },
          notEmpty: { msg: "Class name is required" },
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
      address: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Gender is required" },
          notEmpty: { msg: "Gender is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "Student",
    }
  );

  Student.addHook("beforeCreate", (student, options) => {
    student.password = hashPassword(student.password);
  });
  return Student;
};
