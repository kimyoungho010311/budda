const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const dbConnect = async () => {
  try {
    await mongoose.coonect(process.env.DB_COOECT, {
      userNewUrlParser: true,
      userUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("Database connection error : ", err);
  }
};
// 서버 시작 전에 데이터베이스 연결
dbConnect();

app.get("/api/data", (req, res) => {
  res.cookie("myCookie", "cookieValue", {
    sameSite: "None",
    secure: true, // HTTP 필요
    httpOnly: true, // 클라이언트에서 접근 불가
  });
  res.json({ message: "Data from server" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

// CORS 설정
app.use(
  cors({
    origin: "http://localhost:3000", //REACT 도메인
    credentials: true,
  })
);

// COOP 및 COEP 설정
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-crop");
  next();
});

//로그아웃 구현
app.post("/logout", (req, res) => {
  res.clearCookie("session"); // 세션쿠키 삭제
  return res, status(200).send("Logged out");
});
