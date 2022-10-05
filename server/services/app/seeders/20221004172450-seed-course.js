"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/courses.json");
    const { courses } = data;
    courses.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Courses", courses);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Courses", null);
  },
};
