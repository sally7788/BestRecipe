import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// 레시피 조회 API (메인 페이지, 제한된 수)
router.get("/", async (req, res) => {
  const { lat, lon } = req.query;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric&lang=kr`
    );

    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;

