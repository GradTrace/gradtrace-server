const router = require("express").Router();
const TeacherController = require("../controllers/teacher");
const authc = require("../middlewares/authc");

router.post("/register", TeacherController.register);
router.post("/login", TeacherController.login);
router.get("/courses", TeacherController.getCourses);

router.use(authc);

router.post("/exams", TeacherController.addExam);
router.get("/exams/score", TeacherController.examScoreBySubject);
router.put("/exams/:id", TeacherController.editExam);

router.post("/scores", TeacherController.addScore);
router.post("/scores/final", TeacherController.addFinalGrades); //?
router.put("/scores/:id", TeacherController.editScore);

router.get("/assignment", TeacherController.getAssignment);
router.post("/assignment", TeacherController.postAssignment);
router.get("/assignments", TeacherController.getAssignmented);
router.put("/assignment/score", TeacherController.assignmentScore);
router.get("/assignment/score", TeacherController.assignmetScoreBySubject);
router.get("/assignmentGrades", TeacherController.getAssignmentGrades);

router.delete("/assignment/:id", TeacherController.deleteAssignment);
router.patch("/assignmentGrades/:id", TeacherController.editAssignmentGrades);
router.get("/assignmentGrades/:id", TeacherController.getAssignmentGradesById);
router.get("/assignment/grade/:id", TeacherController.getGradeAssignment);
router.put("/assignment/:id", TeacherController.editAssignment);
router.get("/assignment/:id", TeacherController.getAssignmentById);
router.get("/attendances/:className", TeacherController.getStudentAttendance);

module.exports = router;
