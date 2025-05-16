const apiUrl = "http://localhost:3000/users";
const profileForm = document.getElementById("profileForm");
const securityForm = document.getElementById("securityForm");

const storedUser = sessionStorage.getItem("user");
if (!storedUser) {
  alert("No user is logged in.");
  window.location.href = "../pages/login.html";
}

const user = JSON.parse(storedUser);
const userId = user.id;

document.getElementById("fullName").value = user.name || "";
document.getElementById("email").value = user.email || "";
document.getElementById("phone").value = user.phone || "";

profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateProfileForm()) return;

  const updatedUser = {
    id: userId,
    name: document.getElementById("fullName").value.trim(),
    email: document.getElementById("email").value.trim(),
    password: user.password,
    phone: document.getElementById("phone").value.trim(),
    userType: user.userType,
  };

  try {
    const response = await fetch(`${apiUrl}/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    });

    const updatedData = await response.json();
    sessionStorage.setItem("user", JSON.stringify(updatedData));
    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("An error occurred while updating your profile. Please try again.");
  }
});

securityForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const currentPassword = document
    .getElementById("currentPassword")
    .value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();

  if (!currentPassword || !newPassword || !confirmPassword) {
    alert("All fields are required.");
    return;
  }
  if (newPassword !== confirmPassword) {
    alert("New password and confirm password do not match.");
    return;
  }

  if (!validatePassword(newPassword)) {
    alert(
      "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters."
    );
    return;
  }

  const updatedUser = { ...user, password: newPassword };

  try {
    const response = await fetch(`${apiUrl}/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    });

    if (!response.ok) {
      throw new Error("Failed to update password.");
    }

    const updatedData = await response.json();
    sessionStorage.setItem("user", JSON.stringify(updatedData));
    alert("Password updated successfully!");
    securityForm.reset();
  } catch (error) {
    console.error("Error updating password:", error);
    alert("An error occurred while updating your password. Please try again.");
  }
});

function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

function validateProfileForm() {
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!fullName || !email || !phone) {
    alert("All fields are required.");
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return false;
  }

  const phonePattern = /^\d{10,15}$/;
  if (!phonePattern.test(phone)) {
    alert("Please enter a valid phone number.");
    return false;
  }

  return true;
}
