import Quiz from "./Quiz.js";
import Question from "./Question.js";
import User from "./User.js";
import Answer from "./Answer.js";
//import QuizQuestion from "./QuizQuestion.js";
const models = {
  Quiz,
  Question,
  User,
  Answer,
  //QuizQuestion,
};

// Khởi tạo associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export { Quiz, Question, User, Answer };
