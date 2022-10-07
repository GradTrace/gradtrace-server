const router = require("express").Router();
const TeacherController = require("../controllers/teacher");

router.post("/register", TeacherController.register);
router.post("/login", TeacherController.login);
router.post("/exams", TeacherController.addExam);
router.post("/scores", TeacherController.addScore);
router.put("/assignment/score", TeacherController.assignmentScore)
router.get("/assignment", TeacherController.getAssignment)
router.get("/assignment/grade/:id", TeacherController.getGradeAssignment)
router.post("/assignment", TeacherController.postAssignment)
router.get("/courses", TeacherController.getCourses)
router.post("/scores/final", TeacherController.addFinalGrades);


module.exports = router;
