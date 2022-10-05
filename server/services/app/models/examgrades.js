"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ExamGrades extends Model {
    static associate(models) {
      // define association here
      ExamGrades.belongsTo(models.Student);
      ExamGrades.belongsTo(models.Exam);
    }
  }
  ExamGrades.init(
    {
      score: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: { msg: "Score is required" },
          notEmpty: { msg: "Score is required" },
        },
      },
      StudentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Student ID is required" },
          notEmpty: { msg: "Student ID is required" },
        },
      },
      ExamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Exam ID is required" },
          notEmpty: { msg: "Exam ID is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "ExamGrades",
    }
  );
  return ExamGrades;
};
