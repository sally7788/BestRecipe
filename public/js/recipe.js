if (location.pathname === "/") {
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `/api/recipes/main?${userId ? `userId=${userId}` : ""}`
      );
      const data = await response.json();
      const recipeCards = document.querySelectorAll("#recipes .recipe-card");
      data.forEach((item, index) => {
        const card = recipeCards[index];
        card.onclick = () => {
          location.href = `/recipe/${item.id}`;
        };
        card.innerHTML = `
          <div class="food_image_wrapper">
            <img src="${item.image}" alt="${item.food}">
            <i data-id="${item.id}" class="${
          item.isScrapped ? "fas" : "far"
        } fa-bookmark scrap_icon" onclick="${
          item.isScrapped ? "onClickDeleteScrap" : "onClickScrap"
        }(this)"></i>
          </div>
          <div class="content">
            <h3>${item.food}</h3>
            <p>${item.subTitle}</p>
          </div>
        `;
      });

      // Slider functionality
      const sliderTrack = document.querySelector("#recipes.slider-track");
      let currentIndex = 0;
      const totalCards = recipeCards.length;
      const visibleCards = 3;

      window.nextSlide = function () {
        if (currentIndex < totalCards - visibleCards) {
          currentIndex += 3;
          updateSliderPosition();
        }
      };

      window.prevSlide = function () {
        if (currentIndex > 0) {
          currentIndex -= 3;
          updateSliderPosition();
        }
      };

      function updateSliderPosition() {
        const newPosition = -(currentIndex * (100 / visibleCards));
        sliderTrack.style.transform = `translateX(${newPosition}%)`;
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  if (location.pathname === "/cyberRecipe") {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `/api/recipes?${userId ? `userId=${userId}` : ""}`
      );
      const data = await response.json();
      const recipes = document.getElementById("recipes");
      data.forEach((item, index) => {
        const card = document.createElement("div");
        card.classList.add("recipe-card");
        card.onclick = () => {
          location.href = `/recipe/${item.id}`;
        };
        card.innerHTML = `
          <div class="food_image_wrapper">
            <img src="${item.image}" alt="${item.food}">
            <i data-id="${item.id}" class="${
          item.isScrapped ? "fas" : "far"
        } fa-bookmark scrap_icon" onclick="${
          item.isScrapped ? "onClickDeleteScrap" : "onClickScrap"
        }(this)"></i>
          </div>
          <div class="content">
            <h3>${item.food}</h3>
            <p>${item.subTitle}</p>
          </div>
        `;
        recipes.appendChild(card);
      });

      // dummy data 만들어서 grid 채워넣는 로직
      const dummyLength = 3 - (data.length % 3);
      for (let i = 0; i < dummyLength; i++) {
        const card = document.createElement("div");
        card.classList.add("recipe-card");
        card.classList.add("dummy");
        recipes.appendChild(card);
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  }
});

function addFocusClass(id) {
  document.getElementById(id).classList.add("focused");
}

function removeFocusClass(id) {
  document.getElementById(id).classList.remove("focused");
}

function attachImage() {
  document.getElementById("image").click();
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

if (location.pathname === "/writeRecipe") {
  document.addEventListener("DOMContentLoaded", () => {
    document
      .querySelector("form")
      .addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("food", document.getElementById("food").value);
        formData.append("subTitle", document.getElementById("sub_title").value);
        formData.append("recipe", document.getElementById("recipe").value);
        formData.append("image", document.getElementById("image").files[0]);
        formData.append(
          "ingredient",
          document.getElementById("ingredient").value
        );

        formData.append("userId", localStorage.getItem("userId"));
        formData.append("author", localStorage.getItem("nickname"));
        formData.append("date", formatDate(new Date()));

        try {
          const response = await fetch("/api/recipes", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const result = await response.json();
            console.log("New recipe added:", result);
            localStorage.setItem("postRecipe", 1);
            location.href = "/cyberRecipe";
          } else {
            console.error("Failed to add recipe");
          }
        } catch (error) {
          console.error("Error:", error);
          toast.failure("레시피 생성에 실패했습니다 :(");
        }
      });
  });
}

function parseIngredients(ingredientsString) {
  // 콤마로 구분된 문자열을 분리하여 배열로 만듭니다.
  const ingredientsArray = ingredientsString.split(",");

  // 각 항목의 양 끝의 공백을 제거하고 새로운 배열을 만듭니다.
  const parsedIngredients = ingredientsArray.map((ingredient) =>
    ingredient.trim()
  );

  // 최종적으로 조리 재료 목록을 반환합니다.
  return parsedIngredients;
}

function parseRecipes(recipesString) {
  // 콤마로 구분된 문자열을 분리하여 배열로 만듭니다.
  const recipesArray = recipesString.split("\n");

  // 각 항목의 양 끝의 공백을 제거하고 새로운 배열을 만듭니다.
  const parsedRecipes = recipesArray.map((recipe) => recipe.trim());

  // 최종적으로 조리 재료 목록을 반환합니다.
  return parsedRecipes;
}

// 레시피 상세페이지
if (location.pathname.startsWith("/recipe/")) {
  document.addEventListener("DOMContentLoaded", async () => {
    const recipeId = location.pathname.split("/")[2];
    const response = await fetch(`/api/recipes/${recipeId}`);
    const data = await response.json();
    console.log(data);

    const food = document.getElementById("food");
    const date = document.getElementById("date");
    const author = document.getElementById("author");
    const subTitle = document.getElementById("sub_title");
    const recipeImg = document.getElementById("recipe_img");
    const ingredientsList = document.getElementById("ingredients_list");
    const recipeDescription = document.getElementById("recipe_description");

    food.textContent = data.food;
    date.textContent = data.date;
    author.textContent = `작성자: ${data.author}`;
    subTitle.textContent = data.subTitle;
    recipeImg.src = `/${data.image}`;
    recipeImg.alt = data.food;

    parseIngredients(data.ingredients).forEach((ingredient) => {
      const li = document.createElement("li");
      li.textContent = ingredient;
      ingredientsList.appendChild(li);
    });

    parseRecipes(data.recipe).forEach((recipe) => {
      const span = document.createElement("span");
      span.textContent = recipe;
      recipeDescription.appendChild(span);
    });
  });
}
