const express = require("express");
const mongoose = require("mongoose");
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
  res.json({ message: "Data from server" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
