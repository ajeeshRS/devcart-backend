const mongoose = require("mongoose");

function connectDb(callback) {
  const url = process.env.MONGODB_URI;

  // connection to the uri
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((err) => console.log(err));

  const db = mongoose.connection;

  db.once("open", () => {
    console.log("connection succeed");
    callback();
  });

  db.on("error", (err) => {
    console.log("error:", err);
  });
}

module.exports = connectDb;
