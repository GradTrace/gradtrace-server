"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AssignmentGrades extends Model {
    static associate(models) {
      // define association here
      AssignmentGrades.belongsTo(models.Student);
      AssignmentGrades.belongsTo(models.Assignment);
    }
  }
  AssignmentGrades.init(
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
      AssignmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Assignment ID is required" },
          notEmpty: { msg: "Assignment ID is required" },
        },
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Url is required" },
          notEmpty: { msg: "Url is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "AssignmentGrades",
    }
  );
  return AssignmentGrades;
};
