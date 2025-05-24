import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Answer = sequelize.define(
  "Answer",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    question_id: { type: DataTypes.INTEGER, allowNull: true },
    answer_text: { type: DataTypes.TEXT, allowNull: false },
    is_correct: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    created_by: { type: DataTypes.STRING(255), allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
    deleted_by: { type: DataTypes.STRING(255), allowNull: true },
  },
  {
    tableName: "answers",
    timestamps: false,
  }
);

Answer.associate = function (models) {
  Answer.belongsTo(models.Question, {
    foreignKey: "question_id",
    as: "question",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Answer.belongsTo(models.User, { foreignKey: "created_by", as: "creator" });
  Answer.belongsTo(models.User, { foreignKey: "deleted_by", as: "deleter" });
};
export default Answer;
