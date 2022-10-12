const router = require("express").Router();
const TeacherController = require("../controllers/teacher");
const authc = require("../middlewares/authc");
const autht = require("../middlewares/autht");

router.post("/register", TeacherController.register);
router.post("/login", TeacherController.login);
router.get("/courses", TeacherController.getCourses);

// User authentication
router.use(autht);

// User authentication
router.use(authc);

// Exams
router.post("/exams", TeacherController.addExam);
router.get("/exams/score", TeacherController.examScoreBySubject);
router.put("/exams/score", TeacherController.editScoreById);
router.get("/exams/score/:id", TeacherController.examScoreById);
router.put("/exams/:id", TeacherController.editExam);
router.get("/exams/:className", TeacherController.getExamByClass);

// Scores
router.post("/scores", TeacherController.addScore);
router.put("/scores/:id", TeacherController.editScore);

// Assignment
router.get("/assignment", TeacherController.getAssignment);
router.post("/assignment", TeacherController.postAssignment);
router.put("/assignment/score", TeacherController.assignmentScore);
router.get("/assignment/score", TeacherController.assignmetScoreBySubject);
// router.get("/assignment/paginate", TeacherController.getAssignmentPagination);
router.get("/assignment/grade/:id", TeacherController.getGradeAssignment);
router.get("/assignment/:id", TeacherController.getAssignmentById);
router.put("/assignment/:id", TeacherController.editAssignment);
router.delete("/assignment/:id", TeacherController.deleteAssignment);
// Assignments
router.get("/assignments", TeacherController.getAssignmented);

// Assignment Grades
router.get("/assignmentGrades", TeacherController.getAssignmentGrades);
router.get("/assignmentGrades/:id", TeacherController.getAssignmentGradesById);
router.patch("/assignmentGrades/:id", TeacherController.editAssignmentGrades);

// Attendances
router.get("/attendances/:className", TeacherController.getStudentAttendance);

module.exports = router;
