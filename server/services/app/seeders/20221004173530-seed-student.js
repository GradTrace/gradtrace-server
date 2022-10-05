"use strict";
const { hashPassword } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/students.json");
    const { students } = data;
    students.forEach((el) => {
      el.password = hashPassword(el.password);
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Students", students);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Students", null);
  },
};
