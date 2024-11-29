const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  recipeName: { type: String, required: true },
  recipeIntroduction: { type: String },
  categories: {
    type: { type: String },
    situation: { type: String },
    ingredient: { type: String },
  },
  info: {
    count: { type: Number }, // 기본값 1
    time: { type: String },
    difficulty: { type: String },
  },
  ingredients: [
    {
      name: { type: String },
      quantity: { type: String },
      unit: { type: String },
      note: { type: String },
    },
  ],
  steps: { type: String },
  image: { type: String }, // 이미지 URL 또는 경로
  userId: { type: String, required: true }, // 사용자 ID 필드 추가
});

module.exports = mongoose.model("Recipe", recipeSchema);
