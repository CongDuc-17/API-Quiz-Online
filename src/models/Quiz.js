import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Quiz = sequelize.define(
  "Quiz",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    created_by: { type: DataTypes.STRING(255), allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
    deleted_by: { type: DataTypes.STRING(255), allowNull: true },
  },
  {
    tableName: "quizzes",
    timestamps: false,
    paranoid: true, // soft delete
    deletedAt: "deleted_at",
  }
);

Quiz.associate = function (models) {
  Quiz.belongsTo(models.User, { foreignKey: "created_by", as: "creator" });
  Quiz.belongsTo(models.User, { foreignKey: "deleted_by", as: "deleter" });
  Quiz.belongsToMany(models.Question, {
    through: "quiz_questions",
    timestamps: false,
    foreignKey: "quiz_id",
    otherKey: "question_id",
    as: "questions",
  });
};

export default Quiz;
