require("dotenv").config();


const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const route = require("./routes");
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", route);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

module.exports = app;
