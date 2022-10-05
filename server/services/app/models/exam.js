"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Exam extends Model {
    static associate(models) {
      // define association here
      Exam.belongsTo(models.Course);
      Exam.hasMany(models.ExamGrades, {
        foreignKey: "ExamId",
      });
    }
  }
  Exam.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Exam name is required" },
          notEmpty: { msg: "Exam name is required" },
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
      className: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Class name is required" },
          notEmpty: { msg: "Class name is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "Exam",
    }
  );
  return Exam;
};
