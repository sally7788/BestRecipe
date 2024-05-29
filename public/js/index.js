document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");
  const nickname = localStorage.getItem("nickname");
  if (userId && nickname) {
    document.querySelector(".login").style.display = "none";
    document.querySelector(".logout_wrapper").style.display = "block";
    document.querySelector(
      ".welcome"
    ).textContent = `${nickname}님 안녕하세요😆`;
  }
});

function toast(type, options) {
  const defaultOptions = {
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "bottom",
    position: "right",
    style: {
      background:
        type === "success"
          ? "linear-gradient(to right, #00b09b, #96c93d)"
          : "linear-gradient(to right, #ff6b6b, #ff9999)",
    },
    onClick: function () {},
  };

  const mergedOptions = Object.assign({}, defaultOptions, options);
  Toastify({ ...mergedOptions }).showToast();
}

toast.success = function (text) {
  toast("success", { text });
};

toast.failure = function (text) {
  toast("error", { text });
};

function isLogin(link) {
  if (localStorage.getItem("userId")) {
    if (link) {
      location.href = link;
      return;
    }
    return;
  } else {
    openDialog();
  }
}

// 로그인 필요 다이얼로그 열기
function openDialog() {
  const dialog = document.getElementById("isLogin_dialog");
  dialog.showModal();
  document.body.style.overflow = "hidden";
}

// 스크랩 다이얼로그 열기
function openScrapDialog() {
  const dialog = document.getElementById("delete_scrap_dialog");
  dialog.showModal();
  document.body.style.overflow = "hidden";
}

// 로그인 필요 다이얼로그 닫기
function closeDialog() {
  const dialog = document.getElementById("isLogin_dialog");
  dialog.close();
  document.body.style.overflow = "";
}

// 스크랩 다이얼로그 닫기
function closeScrapDialog() {
  const dialog = document.getElementById("delete_scrap_dialog");
  dialog.close();
  document.body.style.overflow = "";
}

// 토스트 메시지 관리
document.addEventListener("DOMContentLoaded", () => {
  const [
    LOGIN,
    LOGOUT,
    POST_RECIPE,
    UPDATE_RECIPE,
    DELETE_RECIPE,
    DELETE_ALL_SCRAP,
  ] = [
    "login",
    "logout",
    "postRecipe",
    "updateRecipe",
    "deleteRecipe",
    "deleteAllScrap",
  ];
  if (localStorage.getItem(LOGIN)) {
    toast.success("성공적으로 로그인 되었습니다!");
    localStorage.removeItem(LOGIN);
  }
  if (localStorage.getItem(LOGOUT)) {
    toast.success("성공적으로 로그아웃 되었습니다!");
    localStorage.removeItem(LOGOUT);
  }
  if (localStorage.getItem(POST_RECIPE)) {
    toast.success("성공적으로 레시피를 생성했습니다!");
    localStorage.removeItem(POST_RECIPE);
  }
  if (localStorage.getItem(UPDATE_RECIPE)) {
    toast.success("성공적으로 레시피를 수정했습니다!");
    localStorage.removeItem(UPDATE_RECIPE);
  }
  if (localStorage.getItem(DELETE_RECIPE)) {
    toast.success("성공적으로 레시피를 삭제했습니다!");
    localStorage.removeItem(DELETE_RECIPE);
  }
  if (localStorage.getItem(DELETE_ALL_SCRAP)) {
    toast.success("성공적으로 모든 스크랩을 삭제했습니다!");
    localStorage.removeItem(DELETE_ALL_SCRAP);
  }
});

// 페이지 로드 시 이전 페이지 URL을 localStorage에 저장
window.addEventListener("load", () => {
  const currentURL = location.pathname;
  const previousURL = localStorage.getItem("currentURL");
  localStorage.setItem("currentURL", currentURL);
  localStorage.setItem("previousURL", previousURL);
});
