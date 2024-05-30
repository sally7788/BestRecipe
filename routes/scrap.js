import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const __dirname = path.resolve();
const SCRAP_DATA = path.join(__dirname, "scrap.json");
const RECIPES_DATA = path.join(__dirname, "recipes.json");

// 스크랩 조회 API
router.get("/:userId", (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const scrapData = JSON.parse(fs.readFileSync(SCRAP_DATA, "utf8"));
  const userScrapData = scrapData.filter((scrap) => scrap.userId === userId);

  if (userScrapData.length > 0) {
    const recipeIdArray = userScrapData.map((scrap) => scrap.recipeId);
    const recipes = JSON.parse(fs.readFileSync(RECIPES_DATA, "utf8"));
    const recipeData = recipes.filter((recipe) => {
      recipe.isScrapped = true;
      return recipeIdArray.includes(recipe.id);
    });
    res.json(recipeData);
  } else {
    res.json([]);
  }
});

// 스크랩 추가 API
router.post("/", (req, res) => {
  const { userId, recipeId } = req.body;

  if (!userId || !recipeId) {
    return res
      .status(400)
      .json({ error: "userId와 recipeId를 모두 제공해야 합니다." });
  }

  const scrapData = JSON.parse(fs.readFileSync(SCRAP_DATA, "utf8"));

  const existingScrap = scrapData.find(
    (scrap) => scrap.userId === userId && scrap.recipeId === recipeId
  );
  if (existingScrap) {
    return res.status(400).json({ error: "이미 스크랩한 레시피입니다." });
  }

  scrapData.push({ userId, recipeId });
  fs.writeFileSync(SCRAP_DATA, JSON.stringify(scrapData, null, 2));

  res.status(201).json({ message: "스크랩이 추가되었습니다." });
});

// 스크랩 삭제 API
router.delete("/", (req, res) => {
  const { userId, recipeId } = req.body;

  if (!userId || !recipeId) {
    return res
      .status(400)
      .json({ error: "userId와 recipeId를 모두 제공해야 합니다." });
  }

  const scrapData = JSON.parse(fs.readFileSync(SCRAP_DATA, "utf8"));

  const index = scrapData.findIndex(
    (scrap) => scrap.userId === userId && scrap.recipeId === recipeId
  );

  if (index === -1) {
    return res.status(404).json({ error: "해당 스크랩을 찾을 수 없습니다." });
  }

  scrapData.splice(index, 1);
  fs.writeFileSync(SCRAP_DATA, JSON.stringify(scrapData, null, 2));

  res.json({ message: "스크랩이 성공적으로 삭제되었습니다." });
});

// 스크랩 전체 삭제 API
router.delete("/all", (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId를 제공해야 합니다." });
  }

  const scrapData = JSON.parse(fs.readFileSync(SCRAP_DATA, "utf8"));

  // userId에 해당하는 모든 스크랩 항목 제거
  const newScrapData = scrapData.filter((item) => item.userId !== userId);

  fs.writeFileSync(SCRAP_DATA, JSON.stringify(newScrapData, null, 2));

  res.json({ message: "스크랩이 성공적으로 삭제되었습니다." });
});

export default router;

