const router = require("express").Router();
const TeacherController = require("../controllers/teacher");
const authc = require("../middlewares/authc");

router.post("/register", TeacherController.register);
router.post("/login", TeacherController.login);
router.get("/courses", TeacherController.getCourses)
router.use(authc);
router.post("/exams", TeacherController.addExam);
router.post("/scores", TeacherController.addScore);
router.put("/assignment/score", TeacherController.assignmentScore)
router.get("/assignment", TeacherController.getAssignment)
router.get("/assignment/grade/:id", TeacherController.getGradeAssignment)
router.post("/assignment", TeacherController.postAssignment)
router.post("/scores/final", TeacherController.addFinalGrades);


module.exports = router;
