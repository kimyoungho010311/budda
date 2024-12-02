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
  .connect(process.env.DB_CONNECT)
  .then(() => console.log(c.green("MongoDB connected")))
  .catch((err) => {
    console.error(c.red("MongoDB connection error:", err));
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
    console.error(c.red("Authorization header is missing or invalid."));
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // JWT에서 디코딩한 사용자 정보 설정
    console.log(
      c.green("JWT decoded: ") + c.yellow(JSON.stringify(decoded, null, 2))
    ); // 디코딩된 정보 출력
    next();
  } catch (error) {
    console.error(c.red(`JWT verification failed: ${error.message}`));
    res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "토큰이 필요합니다." });
  }

  const token = authHeader?.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // JWT 검증
    req.user = decoded; // 사용자 정보 저장
    next();
  } catch (error) {
    console.error("Invalid token:", error.message);
    res.status(403).json({ message: "유효하지 않은 토큰입니다." });
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
    console.error(c.red(`Error during Google Auth: ${error.message}`));
    res.status(400).json({ success: false, message: "Invalid token" });
  }
});

// 좋아요가 많은 레시피 API
app.get("/recipes/popular", async (req, res) => {
  try {
    const popularRecipes = await Recipe.aggregate([
      {
        $addFields: { likeCount: { $size: "$likes" } }, // 배열 길이 계산
      },
      {
        $sort: { likeCount: -1 }, // 배열 길이를 기준으로 정렬
      },
      {
        $limit: 5, // 상위 5개만 반환
      },
    ]);
    res.status(200).json(popularRecipes);
  } catch (error) {
    console.error(c.red(`Error fetching recent recipes: ${error.message}`));
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent recipes",
      error: error.message,
    });
  }
});

// 최근 생성된 레시피 API
app.get("/recipes/recent", async (req, res) => {
  try {
    const recentRecipes = await Recipe.find({})
      .sort({ uploadTime: -1 }) // 최신순 정렬
      .limit(5); // 최근 5개의 레시피만 반환

    res.status(200).json(recentRecipes);
  } catch (error) {
    console.error(c.red(`Error fetching recent recipes: ${error.message}`));
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent recipes",
      error: error.message,
    });
  }
});

// 최근 조회한 레시피 API
app.post("/recipes/viewed", async (req, res) => {
  try {
    const { recipeIds } = req.body;
    const recipes = await Recipe.find({ _id: { $in: recipeIds } }).sort({});
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching viewed recipes:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch viewed recipes" });
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
    console.error(c.red(`Error saving recipe: ${error.message}`));
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
    console.error(c.red(`Error updating recipe: ${error.message}`));
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
    console.error(c.red(`Error deleting recipe: ${error.message}`));
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
    console.error(c.red(`Error during search: ${error.message}`));
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
    res.json({
      ...recipe._doc, // Spread the recipe document
      likes: recipe.likes || [], // Ensure likes is an array
    });
  } catch (error) {
    console.error(c.red(`Error fetching recipe: ${error.message}`));
    res.status(500).json({ message: "Failed to fetch recipe" });
  }
});

// 댓글 목록 API
app.get("/recipes/:id/comments", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // 댓글을 생성 시간순으로 정렬
    const sortedComments = recipe.comments.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    // 댓글 작성자의 정보를 동적으로 가져오기
    const commentsWithUserInfo = await Promise.all(
      recipe.comments.map(async (comment) => {
        const user = await User.findOne({ googleId: comment.userId }); // 사용자 정보 조회
        return {
          ...comment.toObject(), // 댓글 데이터
          name: user?.name || "Unknown", // 사용자 이름
          picture: user?.picture || "https://via.placeholder.com/30", // 사용자 프로필 사진
        };
      })
    );

    res.status(200).json(sortedComments);
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

// 댓글 추가 API
app.post("/recipes/:id/comments", verifyToken, async (req, res) => {
  const { content } = req.body; // 요청 바디에서 사용자 ID와 댓글 내용 추출
  const { id } = req.params; // 게시글 ID
  const userId = req.user.userId;

  console.log(c.red(`-----------------------------------------`));
  console.log(c.green("댓글 추가 요청 수신:"));
  console.log(c.green(`레시피 ID : `) + c.yellow(`${id}`));
  console.log(c.green(`UserID : `) + c.yellow(`${userId}`));
  console.log(c.green(`추가된 내용 : `) + c.yellow(`${content}`));
  console.log(c.red(`-----------------------------------------`));

  if (!content || !content.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Comment content is required" });
  }

  try {
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }

    // comments 필드가 배열인지 확인 및 초기화
    if (!Array.isArray(recipe.comments)) {
      recipe.comments = [];
    }

    // 데이터베이스에서 사용자 정보 조회
    const user = await User.findOne({ googleId: userId });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { name, picture } = user;

    // 새로운 댓글 객체 생성
    const newComment = {
      userId,
      content,
      name,
      picture,
      createdAt: new Date(),
    };

    // 댓글 추가
    recipe.comments.push(newComment);

    await recipe.save();

    const addedComment = recipe.comments[recipe.comments.length - 1];

    res.status(201).json({
      success: true,
      comment: addedComment, // 추가된 댓글 반환
      comments: recipe.comments.length, // 전체 댓글 수 반환
    });
  } catch (error) {
    console.error("Error adding comment:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to add comment",
      error: error.message,
    });
  }
});

// 댓글 수정
app.put("/recipes/:id/comments/:commentId", verifyToken, async (req, res) => {
  const { content } = req.body; // 요청 바디에서 content 추출
  const { id, commentId } = req.params; // 레시피 및 댓글 ID
  const userId = req.user.userId; // verifyToken에서 저장된 사용자 ID 사용

  console.log(c.red(`-----------------------------------------`));
  console.log(c.green("[Back] 댓글 수정 요청 수신:"));
  console.log(c.green(`[Back] 레시피 ID : `) + c.yellow(`${id}`));
  console.log(c.green(`[Back] 댓글 ID : `) + c.yellow(`${commentId}`));
  console.log(c.green(`[Back] UserID : `) + c.yellow(`${userId}`));
  console.log(c.green(`[Back] 수정된 내용 : `) + c.yellow(` ${content}`));
  console.log(c.red(`-----------------------------------------`));

  if (!content || !content.trim()) {
    return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
  }

  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "레시피를 찾을 수 없습니다." });
    }

    const comment = recipe.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    if (comment.userId !== userId) {
      return res
        .status(403)
        .json({ message: "이 댓글을 수정할 권한이 없습니다." });
    }

    comment.content = content; // 댓글 내용 수정
    await recipe.save();

    res
      .status(200)
      .json({ message: "댓글이 성공적으로 수정되었습니다.", comment });
  } catch (error) {
    console.error("댓글 수정 중 오류:", error.message);
    res.status(500).json({ message: "댓글 수정에 실패했습니다." });
  }
});

// 댓글 삭제
app.delete(
  "/recipes/:id/comments/:commentId",
  verifyToken,
  async (req, res) => {
    const { id, commentId } = req.params; // 레시피 ID와 댓글 ID
    const userId = req.user.userId; // 인증된 사용자 ID

    console.log(c.red(`-----------------------------------------`));
    console.log(c.green("댓글 삭제 요청 수신:"));
    console.log(c.green(`레시피 ID : `) + c.yellow(`${id}`));
    console.log(c.green(`댓글 ID : `) + c.yellow(`${commentId}`));
    console.log(c.green(`UserID : `) + c.yellow(`${userId}`));
    console.log(c.red(`-----------------------------------------`));

    try {
      const recipe = await Recipe.findById(id);

      if (!recipe) {
        return res
          .status(404)
          .json({ success: false, message: "Recipe not found" });
      }

      const comment = recipe.comments.id(commentId);

      if (!comment) {
        return res
          .status(404)
          .json({ success: false, message: "Comment not found" });
      }

      if (comment.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to delete this comment",
        });
      }

      // 댓글 배열에서 제거
      recipe.comments = recipe.comments.filter(
        (c) => c._id.toString() !== commentId
      );
      await recipe.save();

      res
        .status(200)
        .json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to delete comment",
        error: error.message,
      });
    }
  }
);

// Socket.IO 이벤트 처리
io.on("connection", (socket) => {
  console.log(c.blue("사용자가 연결되었습니다."));

  socket.on("message", (msg) => {
    console.log(c.blue(`서버에서 받은 메시지: ${msg.text}`));
    socket.broadcast.emit("message", msg); // 메시지를 다른 클라이언트에게 전달
  });

  socket.on("disconnect", () => {
    console.log(c.blue("사용자가 연결을 종료했습니다."));
  });
});

// 프로필 수정 API
app.put("/profile/:googleId", jwtAuthMiddleware, async (req, res) => {
  const { googleId } = req.params;
  const { name, picture } = req.body;

  if (req.user.userId !== googleId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const updateData = {};
    if (name) updateData.name = name;
    if (picture) updateData.picture = picture;

  try {
    const updatedUser = await User.findOneAndUpdate({ googleId }, { $set: updateData }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
});

// 프로필 삭제 API
app.delete("/profile/:googleId", jwtAuthMiddleware, async (req, res) => {
  const { googleId } = req.params;

  if (req.user.userId !== googleId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const user = await User.findOneAndDelete({ googleId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Recipe.deleteMany({ userId: googleId });

    // 사용자가 작성한 댓글 삭제
    await Recipe.updateMany(
      { "comments.userId": googleId }, // 조건: 해당 사용자의 댓글
      { $pull: { comments: { userId: googleId } } } // 해당 댓글 삭제
    );

    // 사용자가 좋아요를 누른 데이터에서 사용자 제거
    await Recipe.updateMany(
      { likes: googleId }, // 조건: 해당 사용자가 좋아요를 누른 레시피
      { $pull: { likes: googleId } } // 좋아요 목록에서 사용자 ID 제거
    );

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete profile", error: error.message });
  }
});

// 사용자 정보 조회 API
app.get("/profile/:googleId", async (req, res) => {
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
    console.error(c.red(`Error fetching user: ${error.message}`));
    res.status(500).json({
      success: false,
      message: "Failed to fetch user information",
      error: error.message,
    });
  }
});

// 사용자가 업로드한 레시피 API
app.get("/recipes/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const userRecipes = await Recipe.find({ userId }); // 사용자 ID로 레시피 검색
    res.status(200).json(userRecipes);
  } catch (error) {
    console.error("Error fetching user recipes:", error.message);
    res.status(500).json({ message: "Failed to fetch user recipes" });
  }
});

// 서버 시작
server.listen(PORT, () => {
  console.log();
  console.log(
    c.black.bgRed(
      `=============================================================`
    )
  );
  console.log(
    c.red(`-------------------------------------------------------------`)
  );
  console.log(c.green(`JWT_SECRET:`) + c.yellow(` ${process.env.JWT_SECRET}`));
  console.log(c.bold.magenta(`Server running at http://localhost:${PORT}`));
});

// 좋아요 기능 API
app.post("/recipes/:id/like", verifyToken, async (req, res) => {
  const { userId } = req.body; // 요청 바디에서 사용자 ID를 가져옴
  const { id } = req.params; // 게시글 ID
  console.log(
    c.magenta.bold(`-------------------------------------------------`)
  );
  console.log(c.green("좋아요 요청 수신:"));
  console.log(c.green(`레시피 ID : ` + c.yellow(`${id}`)));
  console.log(c.green(`UserID : ` + c.yellow(`${userId}`)));
  console.log(
    c.magenta.bold(`-------------------------------------------------`)
  );
  try {
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }

    // likes 필드가 배열인지 확인 및 초기화
    if (!Array.isArray(recipe.likes)) {
      recipe.likes = [];
    }

    // 사용자가 이미 좋아요를 눌렀는지 확인
    const alreadyLiked = recipe.likes.includes(userId);
    if (alreadyLiked) {
      recipe.likes = recipe.likes.filter((like) => like !== userId); // 좋아요 취소
    } else {
      recipe.likes.push(userId); // 좋아요 추가
    }

    await recipe.save();

    res.status(200).json({
      likes: recipe.likes.length,
      hasLiked: recipe.likes.includes(userId),
    });
  } catch (error) {
    console.error(c.red("Error toggling like:", error.message));
    res.status(500).json({ success: false, message: "Failed to toggle like" });
    console.error("Error updating likes:", error.message);
    res.status(500).json({ success: false, message: "Failed to update likes" });
  }
});
