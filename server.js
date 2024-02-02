const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
// requiring routes
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middlewares/errorHandler");
const path = require("path");

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "routes", "uploads")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(errorHandler);

// routes
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

// initializing db and and server
connectDb(() => {
  app.listen(port, () => {
    console.log(`server listening on port : ${port}`);
  });
});
