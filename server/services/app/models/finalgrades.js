"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FinalGrades extends Model {
    static associate(models) {
      // define association here
      FinalGrades.belongsTo(models.Student, {
        foreignKey: "StudentId",
      });
      FinalGrades.belongsTo(models.Course, {
        foreignKey: "CourseId",
      });
    }
  }
  FinalGrades.init(
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
      CourseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Course ID is required" },
          notEmpty: { msg: "Course ID is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "FinalGrades",
    }
  );
  return FinalGrades;
};
