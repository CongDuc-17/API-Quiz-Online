import { Quiz, Question, Answer } from "../../models/index.js";
import sequelize from "../../config/database.js";
import { mailService } from "../../service/mail.service.js";
import { get } from "mongoose";

class QuizService {
  //CREATE QUIZ
  async createQuiz(title, description, questions, created_by) {
    const trans = await sequelize.transaction();
    try {
      const quiz = await Quiz.create(
        { title, description, created_by },
        { transaction: trans }
      );

      const questionsData = questions.map((q) => ({
        question_text: q.question_text,
        created_by: created_by,
      }));

      const createdQuestions = await Question.bulkCreate(questionsData, {
        transaction: trans,
        returning: true,
      });

      const quizQuestionsData = createdQuestions.map((q) => ({
        quiz_id: quiz.id,
        question_id: q.id,
      }));

      await sequelize
        .getQueryInterface()
        .bulkInsert("quiz_questions", quizQuestionsData, {
          transaction: trans,
        });

      let answersData = [];
      questions.forEach((q, idx) => {
        if (Array.isArray(q.answers)) {
          q.answers.forEach((ans) => {
            answersData.push({
              question_id: createdQuestions[idx].id,
              answer_text: ans.answer_text,
              is_correct: ans.is_correct,
            });
          });
        }
      });

      if (answersData.length > 0) {
        await Answer.bulkCreate(answersData, { transaction: trans });
      }

      await trans.commit();
      return { success: true, message: "Quiz created successfully" };
    } catch (error) {
      await trans.rollback();
      console.error("Error creating quiz:", error);
      return { success: false, message: "Internal server error" };
    }
  }

  //ADD QUESTION TO QUIZ
  async addQuestionToQuiz(quiz_id, question_text, answers, created_by) {
    const trans = await sequelize.transaction();
    try {
      // Kiểm tra quiz tồn tại
      const quiz = await Quiz.findByPk(quiz_id, { transaction: trans });
      if (!quiz) {
        await trans.rollback();
        return { success: false, message: "Quiz not found" };
      }
      if (quiz.created_by !== created_by) {
        await trans.rollback();
        return {
          success: false,
          message: "You are not the creator of this quiz",
        };
      }
      // Kiểm tra trùng câu hỏi
      const existingQuestion = await Question.findOne({
        where: { question_text, created_by },
        transaction: trans,
      });
      if (existingQuestion) {
        await trans.rollback();
        return { success: false, message: "Question already exists" };
      }

      const newQuestion = await Question.create(
        { question_text, created_by },
        { transaction: trans }
      );

      // Tạo mối quan hệ quiz-question (bảng trung gian)
      await sequelize
        .getQueryInterface()
        .bulkInsert(
          "quiz_questions",
          [{ quiz_id, question_id: newQuestion.id }],
          { transaction: trans }
        );

      // Gom dữ liệu đáp án và insert 1 lần
      const answersData = (answers || []).map((ans) => ({
        question_id: newQuestion.id,
        answer_text: ans.answer_text,
        is_correct: ans.is_correct,
      }));
      if (answersData.length > 0) {
        await Answer.bulkCreate(answersData, { transaction: trans });
      }

      await trans.commit();
      return {
        success: true,
        message: "Question and answers added successfully",
        questionId: newQuestion.id,
      };
    } catch (error) {
      await trans.rollback();
      console.error("Error adding question to quiz:", error);
      return { success: false, message: "Internal server error" };
    }
  }

  //DELETE QUIZ
  async deleteQuiz(quiz_id, deleted_by) {
    const trans = await sequelize.transaction();
    try {
      const quiz = await Quiz.findByPk(quiz_id, { transaction: trans });
      if (!quiz) {
        await trans.rollback();
        return { success: false, message: "Quiz not found" };
      }
      if (quiz.created_by !== deleted_by) {
        await trans.rollback();
        return {
          success: false,
          message: "You are not the creator of this quiz",
        };
      }
      await quiz.update(
        {
          deleted_by,
          deleted_at: new Date(),
        },
        { transaction: trans }
      );
      await trans.commit();
      return { success: true, message: "Quiz deleted successfully" };
    } catch (error) {
      await trans.rollback();
      console.error("Error deleting quiz:", error);
      return { success: false, message: "Internal server error" };
    }
  }

  //DELETE QUESTION
  async deleteQuestion(question_id, deleted_by) {
    const trans = await sequelize.transaction();
    try {
      const question = await Question.findOne({
        where: {
          id: question_id,
          deleted_at: null,
        },
        transaction: trans,
      });
      if (!question) {
        await trans.rollback();
        return { success: false, message: "Question not found" };
      }
      if (question.created_by !== deleted_by) {
        await trans.rollback();
        return {
          success: false,
          message: "You are not the creator of this quiz",
        };
      }
      await question.update(
        {
          deleted_by: deleted_by,
          deleted_at: new Date(),
        },
        { transaction: trans }
      );
      await trans.commit();
      return { success: true, message: "Question deleted successfully" };
    } catch (error) {
      await trans.rollback();
      console.error("Error deleting question:", error);
      return { success: false, message: "Internal server error" };
    }
  }

  //GET QUIZ
  async getQuiz(quiz_id) {
    try {
      const quiz = await Quiz.findByPk(quiz_id, {
        include: [
          {
            model: Question,
            as: "questions",
            where: { deleted_at: null },
            required: false,
            include: [
              {
                model: Answer,
                as: "answers",
              },
            ],
          },
        ],
      });
      if (!quiz || quiz.deleted_at !== null) {
        return { success: false, message: "Quiz not found" };
      }

      return {
        success: true,
        title: quiz.title,
        description: quiz.description,
        questions: quiz.questions.map((question) => ({
          question_text: question.question_text,
          answers: question.answers.map((answer) => ({
            answer_text: answer.answer_text,
          })),
        })),
      };
    } catch (error) {
      console.error("Error getting quiz:", error);
      return { success: false, message: "Internal server error" };
    }
  }
  async sendQuiz(quiz_id, email) {
    try {
      const quizResult = await this.getQuiz(quiz_id);
      if (!quizResult.success) {
        return { success: false, message: "Quiz not found" };
      }

      await mailService.sendMail(
        email,
        "TAKE THE QUIZ TO GET LOVE FROM J97",
        `http://localhost:3000/api/quiz/${quiz_id}`
      );

      return { success: true, message: "Quiz link sent successfully" };
    } catch (error) {
      console.error("Error sending quiz:", error);
      return { success: false, message: "Internal server error" };
    }
  }
}

export default new QuizService();
