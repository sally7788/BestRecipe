import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";

const router = express.Router();
const __dirname = path.resolve();
const RECIPES_DATA = path.join(__dirname, "recipes.json");
const SCRAP_DATA = path.join(__dirname, "scrap.json");

//이미지 디렉터리 설정
const imagesDir = path.join(__dirname, "public", "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}


//multer로 파일 저장 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// recipes.json과 scrap.json을 join 해주는 함수
function getRecipeIdsByUserId(userId, scrapData) {
  return scrapData.reduce((acc, item) => {
    if (parseInt(item.userId) === parseInt(userId)) {
      acc.push(parseInt(item.recipeId));
    }
    return acc;
  }, []);
}

// 레시피 조회 API (메인 페이지, 제한된 수)
router.get("/main", (req, res) => {
  const recipes = JSON.parse(fs.readFileSync(RECIPES_DATA, "utf8"));
  const { userId } = req.query;
  if (userId) {
    const scrapData = JSON.parse(fs.readFileSync(SCRAP_DATA, "utf8"));
    const scrapRecipeIds = getRecipeIdsByUserId(userId, scrapData);
    const recipesWithScrap = recipes.map((recipe) => {
      if (scrapRecipeIds.includes(recipe.id)) {
        recipe.isScrapped = true;
      } else {
        recipe.isScrapped = false;
      }
      return recipe;
    });
    res.json(recipesWithScrap.slice(0, 9));
  } else {
    res.json(recipes.slice(0, 9));
  }
});

// 레시피 조회 API (전체 레시피)
router.get("/", (req, res) => {
  const recipes = JSON.parse(fs.readFileSync(RECIPES_DATA, "utf8"));
  const { userId, q } = req.query;

  let resultRecipes;
  if (q) {
    const query = q.toLowerCase();
    resultRecipes = recipes.filter(
      (recipe) =>
        recipe.food.toLowerCase().includes(query) ||
        recipe.author.toLowerCase().includes(query) ||
        recipe.ingredients.toLowerCase().includes(query)
    );
  } else {
    resultRecipes = recipes;
  }

  if (userId) {
    const scrapData = JSON.parse(fs.readFileSync(SCRAP_DATA, "utf8"));
    const scrapRecipeIds = getRecipeIdsByUserId(userId, scrapData);
    const recipesWithScrap = resultRecipes.map((recipe) => {
      if (scrapRecipeIds.includes(recipe.id)) {
        recipe.isScrapped = true;
      } else {
        recipe.isScrapped = false;
      }
      return recipe;
    });
    res.json(recipesWithScrap);
  } else {
    res.json(resultRecipes);
  }
});

// 레시피 추가 API
router.post("/", upload.single("image"), (req, res) => {
  const { food, subTitle, recipe, ingredients, userId, author, date } =
    req.body;
  const image = req.file ? "/images/" + req.file.filename : null;

  const recipes = JSON.parse(fs.readFileSync(RECIPES_DATA, "utf8"));

  const newRecipe = {
    id: recipes.length + 1,
    food,
    userId,
    author,
    date,
    subTitle,
    recipe,
    image,
    ingredients,
  };

  recipes.push(newRecipe);

  fs.writeFileSync(RECIPES_DATA, JSON.stringify(recipes, null, 2), "utf8");
  res.status(201).json(newRecipe);
});

// 레시피 수정 API
router.put("/:id", upload.single("image"), (req, res) => {
  const recipeId = parseInt(req.params.id); // 수정할 레시피의 ID
  const { food, subTitle, recipe, ingredients, userId, author, date } =
    req.body;

  const image = req.file ? "/images/" + req.file.filename : null;

  let recipes = JSON.parse(fs.readFileSync(RECIPES_DATA, "utf8"));

  // 수정할 레시피를 찾습니다.
  const index = recipes.findIndex((recipe) => recipe.id === recipeId);

  if (index !== -1) {
    // 레시피를 찾았을 때
    recipes[index] = {
      ...recipes[index], // 기존 레시피를 유지하면서
      food,
      subTitle,
      recipe,
      ingredients,
      userId,
      author,
      date,
      image: image || recipes[index].image, // 새로운 데이터로 업데이트합니다.
    };

    fs.writeFileSync(RECIPES_DATA, JSON.stringify(recipes, null, 2), "utf8");
    res.status(200).json(recipes[index]); // 업데이트된 레시피를 반환합니다.
  } else {
    res.status(404).json({ message: "레시피를 찾을 수 없습니다." });
  }
});

// 특정 레시피 가져오기 (상세 페이지)
router.get("/:id", (req, res) => {
  const { userId } = req.query;
  const recipes = JSON.parse(fs.readFileSync(RECIPES_DATA, "utf8"));
  const recipe = recipes.find((r) => r.id === parseInt(req.params.id));

  if (userId) {
    const scrapData = JSON.parse(fs.readFileSync(SCRAP_DATA, "utf8"));
    const isScrapped = scrapData.find(
      (data) =>
        data.userId === parseInt(userId) &&
        data.recipeId === parseInt(recipe.id)
    );

    recipe.isScrapped = isScrapped ? true : false;
  }

  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404).json({ error: "레시피를 찾을 수 없습니다." });
  }
});

// 레시피 삭제 API
router.delete("/:id", (req, res) => {
  const recipes = JSON.parse(fs.readFileSync(RECIPES_DATA, "utf8"));
  const { id } = req.params;

  const recipeIndex = recipes.findIndex((recipe) => recipe.id === parseInt(id));
  if (recipeIndex === -1) {
    return res.status(404).json({ error: "레시피를 찾을 수 없습니다." });
  }

  const deletedRecipe = recipes.splice(recipeIndex, 1)[0];

  fs.writeFileSync(RECIPES_DATA, JSON.stringify(recipes, null, 2), "utf8");
  res
    .status(200)
    .json({ message: "레시피가 삭제되었습니다.", recipe: deletedRecipe });
});

export default router;
