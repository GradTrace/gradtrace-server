"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Assignment extends Model {
    static associate(models) {
      // define association here
      Assignment.belongsTo(models.Course);
      Assignment.hasMany(models.AssignmentGrades, {
        foreignKey: "AssignmentId",
      });
    }
  }
  Assignment.init(
    {
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Description is required" },
          notEmpty: { msg: "Description is required" },
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
      deadline: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Deadline is required" },
          notEmpty: { msg: "Deadline is required" },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Assignment name is required" },
          notEmpty: { msg: "Assignment name is required" },
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
      modelName: "Assignment",
    }
  );
  return Assignment;
};
