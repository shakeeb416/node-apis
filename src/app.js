const express = require("express");
const path = require("path");
const postRoutes = require("./routes/post.route");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");

const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/users", userRoutes);

module.exports = app;



// app.use("/uploads", express.static(path.join(__dirname, "../uploads"))); // serve files
