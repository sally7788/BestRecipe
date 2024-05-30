import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// 유튜브 조회 API (메인화면, 9개 제한)
router.get("/main", async (req, res) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=18&q=집밥레시피&key=${process.env.YOUTUBE_API_KEY}`
    );

    const data = await response.json();

    // 재생 불가 유튜브 걸러내는 로직
    const filteredData = data.items
      .filter((item) => item.id.videoId)
      .slice(0, 9);

    res.send(filteredData);
  } catch (error) {
    console.error("Error fetching youtube data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// 유튜브 조회 API (유튜-바 레시피화면)
router.get("/keyword", async (req, res) => {
  const keyword = req.query.q || "집밥레시피"; // 기본 키워드 설정
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(
        keyword
      )}&key=${process.env.YOUTUBE_API_KEY}`
    );

    const data = await response.json();

    // 재생 불가 유튜브 걸러내는 로직
    const filteredData = data.items.filter((item) => item.id.videoId);
    res.send(filteredData);
  } catch (error) {
    console.error("Error fetching youtube data:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;

