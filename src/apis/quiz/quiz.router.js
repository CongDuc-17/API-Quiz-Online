import express from "express";
import QuizController from "./quiz.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/createQuiz", authMiddleware, QuizController.createQuiz);
router.post(
  "/addQuestionToQuiz",
  authMiddleware,
  QuizController.addQuestionToQuiz
);
router.delete("/:quiz_id", authMiddleware, QuizController.deleteQuiz);
router.delete(
  "/deleteQuestion/:question_id",
  authMiddleware,
  QuizController.deleteQuestion
);
router.get("/:quiz_id", QuizController.getQuiz);
router.post("/sendQuiz", authMiddleware, QuizController.sendQuiz);
export default router;
