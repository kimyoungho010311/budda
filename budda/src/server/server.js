const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const multer = require("multer");
const http = require("http");
const { Server } = require("socket.io");
const User = require("./models/User");
const Recipe = require("./models/Recipe");

require("dotenv").config();
const ensureJwtSecret = require("./utils/ensureEnvSecret");
ensureJwtSecret();

// ansi-colors
const c = require("ansi-colors");

const app = express();
const server = http.createServer(app); // HTTP 서버 생성
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // 프론트엔드 URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const PORT = 5000;

// MongoDB 연결
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json({ limit: "10mb" })); // JSON 데이터 크기 제한
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" })); // URL-encoded 데이터 크기 제한
// JWT 인증
const jwtAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Authorization header is missing or invalid.");
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // JWT에서 디코딩한 사용자 정보 설정
    console.log("JWT decoded:", decoded); // 디코딩된 정보 출력
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

// Google OAuth2 Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Multer 설정
const upload = multer();

// 기본 경로
app.get("/", (req, res) => {
  res.send("Server is running!");
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
    const user = {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
    console.log(c.green(JSON.stringify(payload, null, 2))); // JSON 형식으로 payload 출력
    console.log(c.cyan("Google ID (googleId):"), payload.sub); // googleId 출력

    let existingUser = await User.findOne({ googleId: payload.sub });
    if (!existingUser) {
      existingUser = new User(user);
      await existingUser.save();
    }

    const jwtToken = jwt.sign(
      {
        userId: user.googleId, // googleId를 userId로 설정
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      accessToken: jwtToken,
      googleId: payload.sub, // 응답에 googleId 포함
    });
  } catch (error) {
    console.error("Error during Google Auth:", error.message);
    res.status(400).json({ success: false, message: "Invalid token" });
  }
});

// 최근 생성된 레시피 API
app.get("/recipes/recent", async (req, res) => {
  try {
    const recipes = await Recipe.find({})
      .sort({ uploadTime: -1 }) // 최신순 정렬
      .limit(5); // 최근 5개의 레시피만 반환

    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recent recipes:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent recipes",
      error: error.message,
    });
  }
});

// 레시피 저장 API
app.post("/recipes", jwtAuthMiddleware, async (req, res) => {
  try {
    const {
      recipeName,
      recipeIntroduction,
      categories,
      info,
      ingredients,
      steps,
      image,
    } = req.body;

    if (!req.user || !req.user.userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required." });
    }

    const googleId = req.user.userId; // JWT에서 googleId 가져오기

    const parsedInfo = JSON.parse(info || "{}");
    const parsedCategories = JSON.parse(categories || "{}");
    const parsedIngredients = JSON.parse(ingredients || "{}");

    const recipe = new Recipe({
      recipeName,
      recipeIntroduction,
      categories: parsedCategories,
      info: parsedInfo,
      ingredients: parsedIngredients,
      steps,
      image,
      userId: googleId, // Google ID를 userId로 저장
    });

    await recipe.save();
    res
      .status(201)
      .json({ success: true, message: "Recipe created successfully" });
  } catch (error) {
    console.error("Error saving recipe:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to save recipe",
      error: error.message,
    });
  }
});

// 레시피 수정 API
app.put("/recipes/:id", async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error("Error updating recipe:", error.message);
    res.status(500).json({ message: "Failed to update recipe" });
  }
});

// 레시피 삭제 API
app.delete("/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error.message);
    res.status(500).json({ message: "Failed to delete recipe" });
  }
});

// 레시피 검색 API
app.post("/search", async (req, res) => {
  try {
    const { categories, situation, ingredient, count, time, difficulty } =
      req.body;
    const query = {};

    if (categories) query["categories.type"] = categories;
    if (situation) query["categories.situation"] = situation;
    if (ingredient) query["categories.ingredient"] = ingredient;
    if (count) query["info.count"] = count;
    if (time) query["info.time"] = time;
    if (difficulty) query["info.difficulty"] = difficulty;

    const results = await Recipe.find(query);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error during search:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch recipes" });
  }
});

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

// Socket.IO 이벤트 처리
io.on("connection", (socket) => {
  console.log("사용자가 연결되었습니다.");

  socket.on("message", (msg) => {
    console.log("서버에서 받은 메시지:", msg);
    socket.broadcast.emit("message", msg); // 메시지를 다른 클라이언트에게 전달
  });

  socket.on("disconnect", () => {
    console.log("사용자가 연결을 종료했습니다.");
  });
});

// 사용자 정보 조회 API
app.get("/user/:googleId", async (req, res) => {
  const { googleId } = req.params;

  try {
    const user = await User.findOne({ googleId }); // googleId로 사용자 검색
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user information",
      error: error.message,
    });
  }
});

// 서버 시작
server.listen(PORT, () => {
  console.log();
  console.log(
    c.red(`=============================================================`)
  );
  console.log(
    c.red(`=============================================================`)
  );
  console.log(`JWT_SECRET :`, process.env.JWT_SECRET);
  console.log(c.bold.magenta(`Server running at http://localhost:${PORT}`));
});

// 좋아요 토클 API
app.post("/recipes/:id/like", jwtAuthMiddleware, async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user.userId; // JWT에서 가져온 사용자 ID

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // 이미 좋아요를 눌렀는지 확인
    const userIndex = recipe.likedBy.indexOf(userId);

    if (userIndex === -1) {
      // 좋아요 추가
      recipe.likedBy.push(userId);
      recipe.likes += 1;
    } else {
      // 좋아요 제거
      recipe.likedBy.splice(userIndex, 1);
      recipe.likes -= 1;
    }

    await recipe.save();
    res.status(200).json({
      success: true,
      likes: recipe.likes,
      likedBy: recipe.likedBy,
    });
  } catch (error) {
    console.error("Error toggling like:", error.message);
    res.status(500).json({ success: false, message: "Failed to toggle like" });
  }
});

// 좋아요 순으로 레시피 정렬
app.get("/recipes/popular", async (req, res) => {
  try {
    const popularRecipes = await Recipe.find()
      .sort({ likes: -1 }) // 좋아요 수 내림차순 정렬
      .limit(10); // 최대 10개 레시피 반환
    res.status(200).json(popularRecipes);
  } catch (error) {
    console.error("Error fetching popular recipes:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular recipes",
    });
  }
});
