'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/ExamGrades.json");
    data.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("ExamGrades", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ExamGrades", null);
  },
};
