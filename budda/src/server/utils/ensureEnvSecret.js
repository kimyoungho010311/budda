const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// .env 파일 경로
const envPath = path.resolve(__dirname, "../.env");

// JWT 비밀 키 확인 및 생성
function ensureJwtSecret() {
  // 환경 변수에서 JWT_SECRET 가져오기
  require("dotenv").config({ path: envPath });
  const currentSecret = process.env.JWT_SECRET;

  if (currentSecret) {
    console.log("JWT_SECRET already exists in .env");
    return currentSecret;
  }

  // 새로운 비밀 키 생성
  const newSecret = crypto.randomBytes(32).toString("hex");
  console.log("Generated new JWT_SECRET:", newSecret);

  // .env 파일 업데이트
  if (fs.existsSync(envPath)) {
    fs.appendFileSync(envPath, `\nJWT_SECRET=${newSecret}\n`);
  } else {
    fs.writeFileSync(envPath, `JWT_SECRET=${newSecret}\n`);
  }

  console.log("JWT_SECRET added to .env");
  return newSecret;
}

module.exports = ensureJwtSecret;
