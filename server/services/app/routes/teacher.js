const router = require("express").Router();
const TeacherController = require("../controllers/teacher");
const authc = require("../middlewares/authc");

router.post("/register", TeacherController.register);
router.post("/login", TeacherController.login);
router.get("/courses", TeacherController.getCourses);
router.use(authc);
router.post("/exams", TeacherController.addExam);
router.post("/scores", TeacherController.addScore);
router.get("/exams/score", TeacherController.examScoreBySubject);
router.post("/assignment", TeacherController.postAssignment);

router.get("/assignment", TeacherController.getAssignment); //done

router.get("/assignment/score", TeacherController.assignmetScoreBySubject);//done

router.put("/assignment/score", TeacherController.assignmentScore);//done
router.put("/exams/:id", TeacherController.editExam);//done

router.get("/assignment/grade/:id", TeacherController.getGradeAssignment);//done

router.delete("/assignment/:id", TeacherController.deleteAssignment);//done
router.put("/assignment/:id", TeacherController.editAssignment);//done
router.get("/assignment/:id", TeacherController.getAssignmentById);//done
router.put("/scores/:id", TeacherController.editScore);//done
router.post("/scores/final", TeacherController.addFinalGrades); //?
router.get("/attendances/:className", TeacherController.getStudentAttendance);//?

module.exports = router;
