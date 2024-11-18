const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ensureJwtSecret = require("./utils/ensureEnvSecret");

ensureJwtSecret();

require("dotenv").config();

const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose
  .connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
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
app.post("/auth/google", async(req, res) => {
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
        { sub: payload.sub, email: payload.email, name: payload.name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      
      res.status(200).json({ success: true, accessToken: jwtToken, message: "Google Auth received" });
    } catch (error) {
        console.error("Error verifying Google token:", error);
    res.status(400).json({ success: false, message: "Invalid token" });
    }
});

// 서버 시작
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
