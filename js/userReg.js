const apiUrl = "http://localhost:3000/users";

const form = document.querySelector(".registration-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const phoneInput = document.getElementById("phone");
const userTypeInput = document.getElementById("userType");
// Form validation
document
  .querySelector(".registration-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const errorElements = document.querySelectorAll(".error-message");
    errorElements.forEach((element) => {
      element.style.display = "none";
    });

    let isValid = true;

    if (nameInput.value.trim().length < 3) {
      document.getElementById("name-error").style.display = "block";
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value)) {
      document.getElementById("email-error").style.display = "block";
      isValid = false;
    }

    if (passwordInput.value.length < 8) {
      document.getElementById("password-error").style.display = "block";
      isValid = false;
    }

    if (passwordInput.value !== confirmPasswordInput.value) {
      document.getElementById("confirm-password-error").style.display = "block";
      isValid = false;
    }

    const phonePattern = /^\d{10,15}$/;
    if (!phonePattern.test(phoneInput.value.replace(/\D/g, ""))) {
      document.getElementById("phone-error").style.display = "block";
      isValid = false;
    }

    if (userTypeInput.value === "") {
      document.getElementById("user-type-error").style.display = "block";
      isValid = false;
    }
    const user = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      password: passwordInput.value.trim(),
      userType: userTypeInput.value.trim(),
    };

    if (isValid) {
      fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })
        .then(() => {
          alert("You are registered successfully!");

          window.location.href = "../pages/login.html";
          form.reset();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      alert("Please, Enter all the details accurately. ");
    }
  });
