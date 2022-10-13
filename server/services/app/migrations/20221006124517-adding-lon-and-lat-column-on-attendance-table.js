"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Attendances", "lon", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Attendances", "lat", {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Attendances", "lat");
  },
};
