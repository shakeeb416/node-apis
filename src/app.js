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

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Shakeeb's Node APIs</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #1f1c2c, #928dab);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #ffffff;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .card {
            background-color: #2c2f48;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            text-align: center;
            max-width: 500px;
            width: 90%;
          }

          h1 {
            margin-bottom: 10px;
            font-size: 2em;
          }

          p {
            margin-bottom: 30px;
            font-size: 1.1em;
            color: #cccccc;
          }

          a {
            text-decoration: none;
            background-color: #00aaff;
            color: white;
            padding: 12px 25px;
            border-radius: 8px;
            font-weight: bold;
            transition: background-color 0.3s ease;
          }

          a:hover {
            background-color: #0077cc;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🚀 Shakeeb's Node APIs</h1>
          <p>Explore the RESTful API collection built with Node.js, Prisma, PostgreSQL & AWS S3.</p>
          <a href="https://www.postman.com/avionics-geologist-50824642/workspace/shakeeb416/collection/24038022-a26f1e31-63d0-47aa-83b8-57a961008689?action=share&creator=24038022" target="_blank">
            🔗 Open Postman Collection
          </a>
        </div>
      </body>
    </html>
  `);
});

module.exports = app;

// app.use("/uploads", express.static(path.join(__dirname, "../uploads"))); // serve files
