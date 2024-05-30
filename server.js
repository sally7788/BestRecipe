import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import recipesRouter from "./routes/recipes.js";
import scrapRouter from "./routes/scrap.js";
import weatherRouter from "./routes/weather.js";
import youtubeRouter from "./routes/youtube.js";

dotenv.config();

const app = express();
app.use(bodyParser.json()); // POST 요청의 본문을 JSON으로 파싱
const PORT = 3000;

// 현재 모듈의 경로를 얻기 위한 코드
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//기본 미들웨어 설정
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

//모든 도메인 접근, CRUD 허용, api 클라이언트 권한 제어
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// *************** GET API KEY *************** //
// API 키 넘겨주기
app.get("/api/keys", (req, res) => {
  const { type } = req.query;
  let apiKey;

  switch (type) {
    case "kakao":
      apiKey = process.env.KAKAO_API_KEY;
      break;
    default:
      return res.status(400).json({ error: "API Key Type 설정 오류" });
  }

  res.json({ apiKey });
});

// API 설정
app.use("/api/weather", weatherRouter);
app.use("/api/youtube", youtubeRouter);
app.use("/api/recipes", recipesRouter);
app.use("/api/scrap", scrapRouter);

// 페이지 설정
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "home.html"));
});
app.get("/cyberRecipe", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "cyberRecipe.html"));
});
app.get("/recipe/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "recipeDetail.html"));
});
app.get("/writeRecipe", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "writeRecipe.html"));
});
app.get("/updateRecipe/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "writeRecipe.html"));
});
app.get("/youtubeRecipe", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "youtubeRecipe.html"));
});
app.get("/scrap", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "scrap.html"));
});

//서버시작
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});


