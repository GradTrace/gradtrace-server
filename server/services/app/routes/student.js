const router = require("express").Router();
const StudentController = require("../controllers/student");
const authc = require("../middlewares/authc");
const { studentAuthz } = require("../middlewares/authz");

router.post("/register", StudentController.register);
router.post("/login", StudentController.login);

// User authentication
router.use(authc);

router.get("/profile", studentAuthz, StudentController.showProfile);
router.post("/attendance", studentAuthz, StudentController.newAttendance);
router.get("/attendance", studentAuthz, StudentController.getAttendances);
router.get("/tasks", studentAuthz, StudentController.getTasks);
router.patch("/tasks/:taskId", studentAuthz, StudentController.submitTaskUrl);
router.get("/scores", studentAuthz, StudentController.showStudentScore);

module.exports = router;
