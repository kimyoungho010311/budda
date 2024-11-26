const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ensureJwtSecret = require("./utils/ensureEnvSecret");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("./models/User");
const Recipe = require("./models/Recipe");
const multer = require("multer");

ensureJwtSecret();
require("dotenv").config();

const app = express();
const PORT = 5000;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// multer 설정
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB 제한 (선택 사항)
  },
});

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// MongoDB 연결
mongoose
  .connect(process.env.DB_CONNECT, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// 기본 경로
app.get("/", (req, res) => {
  res.status(200).send("Server is running!");
});

// Google OAuth 엔드포인트
app.post("/auth/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("Google Payload:", payload);

    // 사용자 정보
    const user = {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };

    // 데이터베이스에 저장
    let existingUser = await User.findOne({ googleId: payload.sub });
    if (!existingUser) {
      console.log("Creating new user:", user);
      existingUser = new User(user);
      await existingUser.save();
      console.log("User saved to database:", existingUser);
    } else {
      console.log("User already exists in database:", existingUser);
    }

    const jwtToken = jwt.sign(
      {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        family_name: payload.family_name,
        given_name: payload.given_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      accessToken: jwtToken,
      message: "Google Auth received",
    });
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(400).json({ success: false, message: "Invalid token" });
  }
});

// 레시피 저장 엔드포인트
app.post("/recipes", upload.single("image"), async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);
    const {
      recipeName,
      recipeIntroduction,
      categories,
      info,
      ingredients,
      steps,
    } = req.body;

    const parsedInfo = JSON.parse(info);
    const parsedCategories = JSON.parse(categories);
    const parsedIngredients = JSON.parse(ingredients);

    console.log("Parsed info:", parsedInfo);

    if (!parsedInfo.count || isNaN(parseInt(parsedInfo.count, 10))) {
      return res.status(400).json({
        success: false,
        message: "Invalid value for 'info.count'. Must be a number.",
      });
    }

    const recipe = new Recipe({
      recipeName,
      recipeIntroduction,
      categories: parsedCategories,
      info: {
        count: parsedInfo.count,
        time: parsedInfo.time,
        difficulty: parsedInfo.difficulty,
      },
      ingredients: parsedIngredients,
      steps,
      image: req.file ? req.file.path : null,
    });

    await recipe.save();
    res
      .status(201)
      .json({ success: true, message: "Recipe created successfully" });
  } catch (error) {
    console.error("Error creating recipe:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create recipe",
      error: error.message,
    });
  }
});

// 검색 엔드포인트
app.post("/search", async (req, res) => {
  try {
    const { categories, situation, ingredient, count, time, difficulty } =
      req.body;

    // MongoDB 쿼리 작성
    const query = {};

    if (categories) query["categories.type"] = categories;
    if (situation) query["categories.situation"] = situation;
    if (ingredient) query["categories.ingredient"] = ingredient;

    // 유효한 숫자로 변환
    if (count && !isNaN(parseInt(count, 10))) {
      query["info.count"] = parseInt(count, 10);
    }

    if (time) query["info.time"] = time;
    if (difficulty) query["info.difficulty"] = difficulty;

    console.log("Search Query:", query);

    const results = await Recipe.find(query); // MongoDB에서 검색
    if (results.length === 0) {
      console.log("No results found");
    }
    res.status(200).json(results);
  } catch (error) {
    console.error("Error during search:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch recipes" });
  }
});

// 서버 시작
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
// 레시피 상세 API
app.get("/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error.message);
    res.status(500).json({ message: "Failed to fetch recipe" });
  }
});
