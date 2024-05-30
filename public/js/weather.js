let weather; // 날씨 전역 변수
let weatherError = undefined;


document.addEventListener("DOMContentLoaded", async () => {
  // 현재 위치정보 가능 여부
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  } else {
    console.log("Geolocation is not supported by this browser.");
    document.getElementById("location").textContent =
      "이 브라우저에서는 날씨 정보가 지원이 되지 않아요 :(";
  }
});

// 성공 시 콜백함수
async function successCallback(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  try {
    const response = await fetch(
      `/api/weather?lat=${latitude}&lon=${longitude}`
    );
    weather = await response.json();

    document.getElementById("location").style.display = "none";
    document.getElementById(
      "weather"
    ).textContent = `오늘의 날씨는 "${weather.weather[0].description}"이네요!`;
    document.getElementById(
      "temp_wind"
    ).innerHTML = `온도는 ${weather.main.temp}&deg;, 바람세기는 ${weather.wind.speed}에요!`;
    weatherError = false;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    weatherError = true;
    document.getElementById("location").textContent =
      "날씨 정보를 받아오는데 문제가 발생했어요 :(";
  }
}

// 에러 콜백 함수
function errorCallback(error) {
  document.getElementById("location").style.display = "none";
  document.getElementById(
    "weather"
  ).textContent = `날씨 정보를 받아올수가 없어요 :(`;
  document.getElementById(
    "temp_wind"
  ).innerHTML = `그래도 메뉴 추천은 받아볼까요?`;
  weatherError = true;
  console.log(errorMessage);
}

// 랜덤 음식
const FOOD_BY_WEATHER = {
  Rain: ["김치찌개", "우동", "칼국수", "파전", "순대국", "김치전", "회"],
  Clouds: ["라면", "스프", "참치마요김밥", "샌드위치", "죽", "된장찌개"],
  Clear: [
    "삼겹살",
    "피자",
    "샐러드",
    "스테이크",
    "초밥",
    "참치마요김밥",
    "소고기",
  ],
  Snow: [
    "떡볶이",
    "오뎅",
    "만두",
    "눈꽃치즈돈까스",
    "훈제오리",
    "갈비탕",
    "뼈찜",
  ],
  Else: [
    "쭈꾸미 볶음",
    "잡채",
    "순두부찌개",
    "비빔밥",
    "닭갈비",
    "냉면",
    "짬뽕",
    "회덮밥",
    "족발",
    "감자탕",
  ],
  Error: [
    "김치찌개",
    "우동",
    "샌드위치",
    "잡채",
    "순두부찌개",
    "비빔밥",
    "닭갈비",
    "만두",
    "눈꽃치즈돈까스",
    "훈제오리",
    "냉면",
  ],
};

// 랜덤으로 음식 하나 선택하는 함수
function getRandomFood(foods) {
  const randomIndex = Math.floor(Math.random() * foods.length);
  return foods[randomIndex];
}

// 음식 추천 함수
const recommendMenu = () => {
  const recommendButton = document.querySelector(".recommend_button");
  const recommendedMenuWrapper = document.getElementById(
    "recommended_menu_wrapper"
  );
  if (weatherError === undefined) {
    return;
  }
  let weatherMain;
  let weatherMainKor;

  if (weather) {
    switch (weather.weather[0].main) {
      case "Clear":
        weatherMain = "Clear";
        weatherMainKor = "오늘같이 맑은 날에는";
        break;
      case "Clouds":
        weatherMain = "Clouds";
        weatherMainKor = "구름 낀 하루엔 역시";
        break;
      case "Rain":
        weatherMain = "Rain";
        weatherMainKor = "비오는 날엔 누가 뭐래도";
        break;
      case "Snow":
        weatherMain = "Snow";
        weatherMainKor = "자박자박 눈오는 날에는";
        break;
      default:
        weatherMain = "Else";
        weatherMainKor = "이런 애매한 날씨에는 역시";
        break;
    }
  } else {
    weatherMain = "Error";
    weatherMainKor = "오늘은 뭔가....";
  }

  if (recommendButton.textContent === "싫어 다시 추천받을래!") {
    document.querySelector(".recommended_menu_img").classList.remove("blink");
    document.querySelector(".recommended_menu").classList.remove("blink");
  }

  const foods = FOOD_BY_WEATHER[weatherMain];
  const randomFood = getRandomFood(foods);
  recommendedMenuWrapper.classList.add("show");
  document.querySelector(
    ".recommended_menu"
  ).textContent = `${weatherMainKor} > ${randomFood} < 어떠신가요?`;

  setTimeout(() => {
    document.querySelector(".recommended_menu_img").classList.add("blink");
    document.querySelector(".recommended_menu").classList.add("blink");
  }, 3000);

  // 3초 동안 잠깐 disabled 상태
  recommendButton.disabled = true;
  recommendButton.textContent = "이거 어때?";
  document.querySelector(
    ".recommended_menu_img"
  ).src = `/images/${randomFood}.jpeg`;
  setTimeout(() => {
    recommendButton.disabled = false;
    recommendButton.textContent = "싫어 다시 추천받을래!";
  }, 3000);
};
