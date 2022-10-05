"use strict";
const { hashPassword } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/teachers.json");
    const { teachers } = data;
    teachers.forEach((el) => {
      el.password = hashPassword(el.password);
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Teachers", teachers);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Teachers", null);
  },
};
