const router = require("express").Router();
const TeacherController = require("../controllers/teacher");

router.post("/register", TeacherController.register);
router.post("/login", TeacherController.login);
router.post("/exams", TeacherController.addExam);
router.post("/scores", TeacherController.addScore);

module.exports = router;
