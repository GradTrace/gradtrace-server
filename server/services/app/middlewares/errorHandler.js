function errorHandler(err, req, res, next) {
  console.log("ERROR", err);

  let errCode = 500;
  let message = "Internal Server Error";

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    errCode = 400;
    message = err.errors[0].message;
  } else if (err.name === "Fullname is required") {
    errCode = 400;
    message = "Full name is required";
  } else if (err.name === "Class name is required") {
  } else if (err.name === "Score is required") {
    errCode = 400;
    message = "Score name is required";
  } else if (err.name === "Class name is required") {
    errCode = 400;
    message = "Class name is required";
  } else if (err.name === "StudentId name is required") {
    errCode = 400;
    message = "StudentId name is required";
  } else if (err.name === "CourseId is required") {
    errCode = 400;
    message = "CourseId is required";
  } else if (err.name === "ExamId is required") {
    errCode = 400;
    message = "ExamId is required";
  } else if (err.name === "Email is required") {
    errCode = 400;
    message = "Email is required";
  } else if (err.name === "Password is required") {
    errCode = 400;
    message = "Password is required";
  } else if (err.name === "Gender is required") {
    errCode = 400;
    message = "Gender is required";
  } else if (err.name === "Course ID is required") {
    errCode = 400;
    message = "Course ID is required";
  } else if (err.name === "Email must be unique") {
    errCode = 400;
    message = "Email must be unique";
  } else if (err.name === "Invalid email/password") {
    errCode = 401;
    message = "Invalid email/password";
  } else if (err.name === "Invalid token" || err.name === "JsonWebTokenError") {
    errCode = 401;
    message = "Invalid token";
  } else if (err.name === "Unauthorized") {
    errCode = 403;
    message = "Unauthorized activity";
  } else if (err.name === "Forbidden") {
    errCode = 403;
    message = "Forbidden activity";
  } else if (err.name === "Student not found") {
    errCode = 404;
    message = "Student not found";
  } else if (err.name === "not found") {
    errCode = 404;
    message = "not found";
  } else {
    errCode = 400;
    message = err.name;
  }

  // else if (err.name === "Category name must be unique") {
  //   errCode = 400;
  //   message = "Category name must be unique";
  // } else if (err.name === "Invalid email/password") {
  // } else if (err.name === "Invalid input") {
  //   errCode = 400;
  //   message = "Invalid input";
  // } else if (err.name === "Invalid email/password") {
  // } else if (err.name === "All 4 ingredients is required") {
  //   errCode = 400;
  //   message = "All 4 ingredients is required";
  // } else if (err.name === "Mongo user id is required") {
  //   errCode = 400;
  //   message = "Mongo user id is required";
  // } else if (err.name === "Menu already exists") {
  //   errCode = 400;
  //   message = "Menu already exists, please select another name";
  // } else if (err.name === "Failed to add new menu") {
  //   errCode = 400;
  //   message = "Failed to add new menu";
  // } else if (err.name === "Invalid email/password") {
  //   errCode = 401;
  //   message = "Invalid email/password";
  // } else if (err.name === "Invalid token" || err.name === "JsonWebTokenError") {
  //   errCode = 401;
  //   message = "Invalid token";
  // } else if (err.name === "Unauthorized") {
  //   errCode = 403;
  //   message = "Unauthorized activity";
  // } else if (err.name === "Category not found") {
  //   errCode = 404;
  //   message = "Category not found";
  // } else if (err.name === "Item not found") {
  //   errCode = 404;
  //   message = "Item not found";
  // } else if (err.name === "Item ingredient not found") {
  //   errCode = 404;
  //   message = "Item ingredient not found";
  // }

  res.status(errCode).json({ message });
}

module.exports = errorHandler;
