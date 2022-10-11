'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/Exams.json");
    data.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      
    });
    await queryInterface.bulkInsert("Exams", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Exams", null);
  },
};
