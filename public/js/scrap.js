if (location.pathname === "/scrap") {
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`/api/scrap/${userId}`);
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

      if (data.length === 0) {
        document.getElementById("no_result").style.display = "flex";
      }

      // dummy data 만들어서 grid 채워넣는 로직
      const dummyLength = 3 - (data.length % 3);
      if (dummyLength < 3) {
        for (let i = 0; i < dummyLength; i++) {
          const card = document.createElement("div");
          card.classList.add("recipe-card");
          card.classList.add("dummy");
          recipes.appendChild(card);
        }
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  });
}

async function onClickScrap(iconElement, float = false) {
  event.stopPropagation(); // 이벤트 버블링 방지
  const userId = parseInt(localStorage.getItem("userId"));
  const recipeId = parseInt(iconElement.dataset.id);

  if (!userId) {
    isLogin();
    return;
  }

  try {
    const response = await fetch("/api/scrap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, recipeId }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("스크랩 추가 성공:", result);
      toast.success("성공적으로 스크랩하였습니다!");

      // 아이콘을 채워진 북마크로 변경
      // 클릭 이벤트 변경
      if (float) {
        iconElement.classList.add("scrapped");
        iconElement.onclick = () => onClickDeleteScrap(iconElement, true);
      } else {
        iconElement.classList.remove("far");
        iconElement.classList.add("fas");
        iconElement.onclick = () => onClickDeleteScrap(iconElement);
      }
    } else {
      const error = await response.json();
      console.error("스크랩 추가 실패:", error);
    }
  } catch (error) {
    console.error("스크랩 추가 중 오류 발생:", error);
  }
}

async function onClickDeleteScrap(iconElement, float = false) {
  event.stopPropagation(); // 이벤트 버블링 방지
  const userId = parseInt(localStorage.getItem("userId"));
  const recipeId = parseInt(iconElement.dataset.id);

  if (!userId) {
    isLogin();
    return;
  }

  try {
    const response = await fetch("/api/scrap", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, recipeId }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("스크랩 삭제 성공:", result);
      toast.success("성공적으로 스크랩이 해제되었습니다!");

      // 아이콘을 빈 북마크로 변경
      // 클릭 이벤트 변경
      if (float) {
        iconElement.classList.remove("scrapped");
        iconElement.onclick = () => onClickScrap(iconElement, true);
      } else {
        iconElement.classList.remove("fas");
        iconElement.classList.add("far");
        iconElement.onclick = () => onClickScrap(iconElement);
      }
    } else {
      const error = await response.json();
      console.error("스크랩 삭제 실패:", error);
    }
  } catch (error) {
    console.error("스크랩 삭제 중 오류 발생:", error);
  }
}

async function onClickDeleteAllScrap() {
  try {
    const userId = parseInt(localStorage.getItem("userId"));
    const response = await fetch("/api/scrap/all", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("스크랩 비우기 성공:", result);

      closeScrapDialog();
      localStorage.setItem("deleteAllScrap", 1);
      location.reload();
    } else {
      const error = await response.json();
      console.error("스크랩 비우기 실패:", error);
    }
  } catch (error) {
    console.error("스크랩 비우기 중 오류 발생:", error);
  }
}
