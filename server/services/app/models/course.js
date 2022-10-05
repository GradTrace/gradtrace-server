"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      // define association here
      Course.belongsToMany(models.Student, {
        through: models.FinalGrades,
        foreignKey: "CourseId",
      });
      Course.hasMany(models.Teacher, {
        foreignKey: "CourseId",
      });
      Course.hasMany(models.Assignment, {
        foreignKey: "CourseId",
      });
      Course.hasMany(models.Exam, {
        foreignKey: "CourseId",
      });
    }
  }
  Course.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Name is required" },
          notEmpty: { msg: "Name is required" },
        },
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Icon is required" },
          notEmpty: { msg: "Icon is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "Course",
    }
  );
  return Course;
};
