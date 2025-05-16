const usersApiUrl = "http://localhost:3000/users";

const userForm = document.getElementById("userForm");
const userIdField = document.getElementById("userId");
const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const phone = document.getElementById("phone");
const userType = document.getElementById("userType");
const userTableBody = document.getElementById("userTableBody");

let editUserId = null;
let allUsers = [];
let sortDirection = 1;

function fetchAndRenderUsers() {
  fetch(usersApiUrl)
    .then((res) => res.json())
    .then((data) => {
      allUsers = data;
      renderUsers(data);
    })
    .catch((error) => console.error("Error fetching users:", error));
}

function renderUsers() {
  userTableBody.innerHTML = "";
  allUsers.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.userType}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-id="${user.id}">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${user.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
    userTableBody.appendChild(row);
  });

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      loadUserForEdit(id);
    });
  });
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      deleteUser(id);
    });
  });
}
userForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!validateForm()) return;

  const user = {
    name: name.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
    password: password.value.trim(),
    userType: userType.value.trim(),
  };

  if (editUserId) {
    updateUser(editUserId, user);
  } else {
    createUser(user);
  }
});

userForm.addEventListener("reset", function () {
  editUserId = null;
  userIdField.value = "";
  name.value = "";
  email.value = "";
  password.value = "";
  phone.value = "";
  userType.value = "Select User Type";
});

function validateForm() {
  const errorElements = document.querySelectorAll(".error-message");
  errorElements.forEach((element) => {
    element.style.display = "none";
  });

  let isValid = true;

  if (name.value.trim().length < 3) {
    document.getElementById("name-error").style.display = "block";
    isValid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value)) {
    document.getElementById("email-error").style.display = "block";
    isValid = false;
  }

  if (password.value.length < 8) {
    document.getElementById("password-error").style.display = "block";
    isValid = false;
  }

  const phonePattern = /^\d{10,15}$/;
  if (!phonePattern.test(phone.value.replace(/\D/g, ""))) {
    document.getElementById("phone-error").style.display = "block";
    isValid = false;
  }

  if (userType.value === "") {
    document.getElementById("user-type-error").style.display = "block";
    isValid = false;
  }

  return isValid;
}

function createUser(user) {
  fetch(usersApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then(() => {
      fetchAndRenderUsers();
      userForm.reset();
    })
    .catch((error) => console.error("Error creating user:", error));
}
function updateUser(id, user) {
  fetch(`${usersApiUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then(() => {
      fetchAndRenderUsers();
      userForm.reset();
      editUserId = null;
    })
    .catch((error) => console.error("Error updating user:", error));
}
function loadUserForEdit(id) {
  const user = allUsers.find((user) => user.id == id);
  if (user) {
    userIdField.value = user.id;
    name.value = user.name;
    email.value = user.email;
    password.value = user.password;
    phone.value = user.phone;
    userType.value = user.userType;
    editUserId = id;
  }
}
function deleteUser(id) {
  if (confirm("Are you sure you want to delete this user?")) {
    fetch(`${usersApiUrl}/${id}`, { method: "DELETE" })
      .then(() => fetchAndRenderUsers())
      .catch((error) => console.error("Error deleting user:", error));
  }
}
function sortUsersByName() {
  allUsers.sort((a, b) => {
    if (a.name < b.name) return -1 * sortDirection;
    if (a.name > b.name) return 1 * sortDirection;
    return 0;
  });
  sortDirection *= -1;
  renderUsers(allUsers);
}
function sortUsersByEmail() {
  allUsers.sort((a, b) => {
    if (a.email < b.email) return -1 * sortDirection;
    if (a.email > b.email) return 1 * sortDirection;
    return 0;
  });
  sortDirection *= -1;
  renderUsers(allUsers);
}
function sortUsersByPhone() {
  allUsers.sort((a, b) => {
    if (a.phone < b.phone) return -1 * sortDirection;
    if (a.phone > b.phone) return 1 * sortDirection;
    return 0;
  });
  sortDirection *= -1;
  renderUsers(allUsers);
}
function sortUsersByUserType() {
  allUsers.sort((a, b) => {
    if (a.userType < b.userType) return -1 * sortDirection;
    if (a.userType > b.userType) return 1 * sortDirection;
    return 0;
  });
  sortDirection *= -1;
  renderUsers(allUsers);
}
function clearValidation() {
  const errorElements = document.querySelectorAll(".error-message");
  errorElements.forEach((element) => {
    element.style.display = "none";
  });
}
document.querySelectorAll(".form-control").forEach((input) => {
  input.addEventListener("input", () => {
    if (input.checkValidity()) {
      input.classList.remove("is-invalid");
    } else {
      input.classList.add("is-invalid");
    }
  });
});
document.querySelector("th:nth-child(2)").style.cursor = "pointer";
document.querySelector("th:nth-child(2)").addEventListener("click", () => {
  sortUsersByName();
});
document.querySelector("th:nth-child(3)").style.cursor = "pointer";
document.querySelector("th:nth-child(3)").addEventListener("click", () => {
  sortUsersByEmail();
});
document.querySelector("th:nth-child(4)").style.cursor = "pointer";
document.querySelector("th:nth-child(4)").addEventListener("click", () => {
  sortUsersByPhone();
});
document.querySelector("th:nth-child(5)").style.cursor = "pointer";
document.querySelector("th:nth-child(5)").addEventListener("click", () => {
  sortUsersByUserType();
});
fetchAndRenderUsers();
