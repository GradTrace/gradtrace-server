const express = require("express");
const router = express.Router();
const studentRouter = require("./student");
const teacherRouter = require("./teacher");

router.get("/", (req, res) => {
  res.status(200).json({
    message: "P3-Final-Project",
  });
});

router.use("/students", studentRouter);
router.use("/teachers", teacherRouter);

module.exports = router;
