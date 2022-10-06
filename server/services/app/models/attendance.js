"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      // define association here
      Attendance.belongsTo(models.Student);
    }
  }
  Attendance.init(
    {
      dateAndTime: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Date and time is required" },
          notEmpty: { msg: "Date and time is required" },
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
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: { msg: "Status is required" },
          notEmpty: { msg: "Status is required" },
        },
      },
      lon: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Longitude is required" },
          notEmpty: { msg: "Longitude is required" },
        },
      },
      lat: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Latitude is required" },
          notEmpty: { msg: "Latitude is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "Attendance",
    }
  );
  return Attendance;
};
