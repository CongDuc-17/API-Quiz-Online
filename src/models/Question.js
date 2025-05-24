import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
const Question = sequelize.define(
  "Question",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    question_text: { type: DataTypes.TEXT, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    created_by: { type: DataTypes.STRING(255), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
    deleted_by: { type: DataTypes.STRING(255), allowNull: true },
  },
  {
    tableName: "questions",
    timestamps: false,
    paranoid: true, // soft delete
    deletedAt: "deleted_at",
  }
);

Question.associate = function (models) {
  Question.belongsToMany(models.Quiz, {
    through: "quiz_questions",
    timestamps: false,
    foreignKey: "question_id",
    otherKey: "quiz_id",
    as: "quizzes",
  });

  Question.belongsTo(models.User, { foreignKey: "created_by", as: "creator" });
  Question.belongsTo(models.User, { foreignKey: "deleted_by", as: "deleter" });
  Question.hasMany(models.Answer, { foreignKey: "question_id", as: "answers" });
};
export default Question;
