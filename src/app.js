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
            background: linear-gradient(135deg, #1c1f2c, #343a7c);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #ffffff;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .card {
            background-color: #2e3353;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
            text-align: center;
            max-width: 600px;
            width: 90%;
          }

          h1 {
            margin-bottom: 10px;
            font-size: 2.4em;
            font-weight: 600;
          }

          p {
            margin-bottom: 30px;
            font-size: 1.15em;
            color: #dddddd;
          }

          .buttons {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-top: 20px;
          }

          a.button {
            display: inline-block;
            text-decoration: none;
            background-color: #00aaff;
            color: white;
            padding: 12px 25px;
            border-radius: 10px;
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(0, 170, 255, 0.3);
          }

          a.button:hover {
            background-color: #0077cc;
            transform: translateY(-2px);
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🚀 Shakeeb's Node APIs</h1>
          <p>A robust RESTful backend powered by Node.js, Prisma, PostgreSQL & AWS S3.</p>
          <div class="buttons">
            <a class="button" href="https://www.postman.com/avionics-geologist-50824642/workspace/shakeeb416/collection/24038022-a26f1e31-63d0-47aa-83b8-57a961008689?action=share&creator=24038022" target="_blank">
              🔗 View Postman Collection
            </a>
            <a class="button" href="https://github.com/shakeeb416/node-apis" target="_blank">
              💻 View GitHub Repository
            </a>
          </div>
        </div>
      </body>
    </html>
  `);
});

module.exports = app;

// app.use("/uploads", express.static(path.join(__dirname, "../uploads"))); // serve files
