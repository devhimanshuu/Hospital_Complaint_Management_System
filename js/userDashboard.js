document.addEventListener("DOMContentLoaded", () => {
  const userNameSpan = document.getElementById("userName");
  const storedUser = sessionStorage.getItem(userName);

  if (storedUser) {
    userNameSpan.innerHTML = userName || "user";
  } else {
    window.location.href = "../pages/login.html";
  }
});
