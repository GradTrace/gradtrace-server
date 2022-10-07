const router = require("express").Router();
const StudentController = require("../controllers/student");
const authc = require("../middlewares/authc");
const { studentAuthz } = require("../middlewares/authz");

router.post("/register", StudentController.register);
router.post("/login", StudentController.login);
router.use(authc);
router.get("/profile", studentAuthz, StudentController.showProfile);
router.post("/attendance", studentAuthz, StudentController.newAttendance);
router.get("/attendance", studentAuthz, StudentController.getAttendances);

module.exports = router;
