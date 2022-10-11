'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/Assignments.json");
    const { Assignments } = data;
    Assignments.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Assignments", Assignments);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Assignments", null);
  },
};
