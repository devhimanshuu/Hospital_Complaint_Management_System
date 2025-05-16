const apiUrl = "http://localhost:3000/users";
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const loginBtn = document.getElementById("loginBtn");

function validateLoginForm() {
  let isValid = true;

  if (
    !emailInput.value.trim() ||
    !/\S+@\S+\.\S+/.test(emailInput.value.trim())
  ) {
    emailError.style.display = "block";
    emailInput.classList.add("is-invalid");
    isValid = false;
  } else {
    emailError.style.display = "none";
    emailInput.classList.remove("is-invalid");
  }

  if (!passwordInput.value.trim()) {
    passwordError.style.display = "block";
    passwordInput.classList.add("is-invalid");
    isValid = false;
  } else {
    passwordError.style.display = "none";
    passwordInput.classList.remove("is-invalid");
  }

  return isValid;
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateLoginForm()) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  try {
    const response = await fetch(`${apiUrl}?email=${email}`);
    const users = await response.json();

    if (users.length === 0) {
      alert("No account found with this email.");
      return;
    }

    const user = users[0];
    if (user.password === password) {
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("userName", user.name);
      sessionStorage.setItem("userEmail", user.email);
      sessionStorage.setItem("userType", user.userType);
      sessionStorage.setItem("isLoggedIn", "true");
      alert(`Welcome, ${user.name}!`);
      if (user.userType === "admin") {
        window.location.href = "../admin.html";
      } else {
        window.location.href = "../user.html";
      }
    } else {
      alert("Incorrect password. Please try again.");
    }
  } catch (error) {
    console.error("Login error:", error);
  }
});

emailInput.addEventListener("focus", () => {
  emailError.style.display = "none";
  emailInput.classList.remove("is-invalid");
});

passwordInput.addEventListener("focus", () => {
  passwordError.style.display = "none";
  passwordInput.classList.remove("is-invalid");
});
