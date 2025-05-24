import express from "express";
import authRoute from "./apis/auth/auth.router.js";
import quizRoute from "./apis/quiz/quiz.router.js";
import sequelize from "./config/database.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // Debug middleware
// app.use((req, res, next) => {
//   console.log("Request Body:", req.body);
//   console.log("Content-Type:", req.headers["content-type"]);
//   next();
// });

// Test database connection and sync models
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
    return sequelize.sync({ force: false });
  })
  .then(() => {
    console.log("All models were synchronized successfully.");

    // Setup routes
    app.use("/api/auth", authRoute);
    app.use("/api/quiz", quizRoute);

    // Start server
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection or sync failed:", err);
    process.exit(1);
  });
