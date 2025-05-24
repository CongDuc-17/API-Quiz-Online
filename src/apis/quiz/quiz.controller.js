import QuizService from "./quiz.service.js";

class QuizController {
  //CREATE QUIZ
  async createQuiz(req, res) {
    try {
      console.log(req.user);
      const { title, description, questions } = req.body;
      const created_by = req.user.username;

      // Validate input
      if (
        !title ||
        !description ||
        !questions ||
        questions.length === 0 ||
        !created_by
      ) {
        return res.status(400).json({
          success: false,
          message: "Title, description, questions, and created_by are required",
        });
      }

      const result = await QuizService.createQuiz(
        title,
        description,
        questions,
        created_by
      );
      if (result.success) {
        return res.status(201).json(result);
      }
      return res.status(500).json(result);
    } catch (error) {
      console.error("Create quiz controller error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
  //ADD QUESTION TO QUIZ
  async addQuestionToQuiz(req, res) {
    try {
      const { quiz_id, question_text, answers } = req.body;
      const created_by = req.user.username;

      // Validate input
      if (!quiz_id || !question_text || !answers || answers.length === 0) {
        console.log(req.body);
        return res.status(400).json({
          success: false,
          message: "Quiz ID, question text, answers are required",
        });
      }

      const result = await QuizService.addQuestionToQuiz(
        quiz_id,
        question_text,
        answers,
        created_by
      );
      if (result.success) {
        return res.status(201).json(result);
      }
      return res.status(500).json(result);
    } catch (error) {
      console.error("Add question to quiz controller error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
  //DELETE QUIZ
  async deleteQuiz(req, res) {
    try {
      const { quiz_id } = req.params;
      console.log(req.user);
      const deleted_by = req.user.username;
      // Validate input
      if (!quiz_id || !deleted_by) {
        return res.status(400).json({
          success: false,
          message: "Quiz ID and deleted_by are required",
        });
      }

      const result = await QuizService.deleteQuiz(quiz_id, deleted_by);
      if (result.success) {
        return res.status(200).json(result);
      }
      return res.status(500).json(result);
    } catch (error) {
      console.error("Delete quiz controller error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
  //DELETE QUESTION
  async deleteQuestion(req, res) {
    try {
      const { question_id } = req.params;
      const deleted_by = req.user.username;
      console.log(question_id, deleted_by);
      // Validate input
      if (!question_id || !deleted_by) {
        return res.status(400).json({
          success: false,
          message: "Question ID and deleted_by are required",
        });
      }

      const result = await QuizService.deleteQuestion(question_id, deleted_by);
      if (result.success) {
        return res.status(200).json(result);
      }
      return res.status(500).json(result);
    } catch (error) {
      console.error("Delete question controller error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
  //GET QUIZ
  async getQuiz(req, res) {
    try {
      const { quiz_id } = req.params;
      // Validate input
      if (!quiz_id) {
        return res.status(400).json({
          success: false,
          message: "Quiz ID is required",
        });
      }

      const result = await QuizService.getQuiz(quiz_id);
      if (result.success) {
        return res.status(200).json(result);
      }
      return res.status(500).json(result);
    } catch (error) {
      console.error("Get quiz controller error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
  //SEND QUIZ
  async sendQuiz(req, res) {
    try {
      const { quiz_id, email } = req.body;
      if (!quiz_id || !email) {
        return res.status(400).json({
          success: false,
          message: "Quiz ID and email are required",
        });
      }
      const result = await QuizService.sendQuiz(quiz_id, email);
      if (result.success) {
        return res.status(200).json(result);
      }
      return res.status(500).json(result);
    } catch (error) {
      console.error("Send quiz controller error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

export default new QuizController();
