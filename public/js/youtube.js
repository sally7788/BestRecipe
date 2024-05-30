if (location.pathname === "/") {
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch("/api/youtube/main");
      const data = await response.json();

      const recipeCards = document.querySelectorAll(
        "#youtube_recipes .recipe-card"
      );


      data.forEach((item, index) => {
        const recipeCard = recipeCards[index];

        const videoId = item.id.videoId;
        const title = item.snippet.title;

        const videoElement = `
                    <iframe width="100%" height="225" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
                    <div class="content">
                      <h3>${title}</h3>
                    </div>
                `;
        recipeCard.innerHTML = videoElement;
      });

      // Slider functionality
      const sliderTrack = document.querySelector(
        "#youtube_recipes.slider-track"
      );
      let currentIndex = 0;
      const totalCards = recipeCards.length;
      const visibleCards = 3;

      window.nextSlideYoutube = function () {
        if (currentIndex < totalCards - visibleCards) {
          currentIndex += 3;
          updateSliderPositionYoutube();
        }
      };

      window.prevSlideYoutube = function () {
        if (currentIndex > 0) {
          currentIndex -= 3;
          updateSliderPositionYoutube();
        }
      };

      function updateSliderPositionYoutube() {
        const newPosition = -(currentIndex * (100 / visibleCards));
        sliderTrack.style.transform = `translateX(${newPosition}%)`;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });
}

if (location.pathname === "/youtubeRecipe") {
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const param = new URLSearchParams(location.search).get("q");

      const searchYoutubeInput = document.getElementById(
        "search_youtube_input"
      );
      if (param) {
        searchYoutubeInput.value = param;
      }

      const response = await fetch(
        `/api/youtube/keyword?q=${param ? param : ""}`
      );
      const data = await response.json();
      const youtubeRecipes = document.getElementById("youtube_recipes");

      data.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("recipe-card");

        const videoId = item.id.videoId;
        const title = item.snippet.title;

        const videoElement = `
            <iframe width="100%" height="225" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
            <div class="content">
              <h3>${title}</h3>
            </div>
        `;

        card.innerHTML = videoElement;
        youtubeRecipes.appendChild(card);
      });

      // dummy data 만들어서 grid 채워넣는 로직
      const dummyLength = 3 - (data.length % 3);
      if (dummyLength < 3) {
        for (let i = 0; i < dummyLength; i++) {
          const card = document.createElement("div");
          card.classList.add("recipe-card");
          card.classList.add("dummy");
          youtubeRecipes.appendChild(card);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });
}

async function onClickSearchYoutube() {
  // 입력 필드에서 검색어를 가져옵니다.
  const keyword = document.getElementById("search_youtube_input").value;
  
  // 검색어 뒤에 "레시피"를 추가합니다.
  const keywordWithRecipe = `${keyword}레시피`;

  // 수정된 링크로 이동합니다.
  location.href = `/youtubeRecipe?q=${encodeURIComponent(keywordWithRecipe)}`;
}

function onKeyDownEnterYoutube(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    onClickSearchYoutube();
  }
}
