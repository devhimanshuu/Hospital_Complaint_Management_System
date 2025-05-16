const departmentsApiUrl = "http://localhost:3000/departments";

const departmentForm = document.getElementById("departmentForm");
const deptName = document.getElementById("deptName");
const contact = document.getElementById("contact");
const departmentTableBody = document.getElementById("departmentTableBody");

let editDeptId = null;
let allDepartments = [];

function fetchAndRenderDepartments() {
  fetch(departmentsApiUrl)
    .then((res) => res.json())
    .then((data) => {
      allDepartments = data;
      renderDepartments(data);
    })
    .catch((error) => console.error("Error fetching departments:", error));
}
function renderDepartments() {
  departmentTableBody.innerHTML = "";
  allDepartments.forEach((department) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${department.id}</td>
            <td>${department.name}</td>
            <td>${department.contact}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-id="${department.id}">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${department.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
    departmentTableBody.appendChild(row);
  });

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      loadDepartmentForEdit(id);
    });
  });
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      deleteDepartment(id);
    });
  });
}
departmentForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!validateForm()) return;

  const department = {
    name: deptName.value.trim(),
    contact: contact.value.trim(),
  };

  const url = editDeptId
    ? `${departmentsApiUrl}/${editDeptId}`
    : departmentsApiUrl;
  const method = editDeptId ? "PUT" : "POST";

  fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(department),
  })
    .then(() => {
      fetchAndRenderDepartments();
      departmentForm.reset();
      departmentForm.classList.remove("was-validated");
      editDeptId = null;
      clearValidation();
    })
    .catch((err) => {
      console.error("Error:", err);
      alert("Error saving department.");
    });
});
function loadDepartmentForEdit(id) {
  const department = allDepartments.find((dept) => dept.id == id);
  if (department) {
    deptName.value = department.name;
    contact.value = department.contact;
    editDeptId = id;
  }
}
function deleteDepartment(id) {
  if (confirm("Are you sure you want to delete this department?")) {
    fetch(`${departmentsApiUrl}/${id}`, { method: "DELETE" })
      .then(() => fetchAndRenderDepartments())
      .catch((err) => {
        console.error("Error deleting department:", err);
      });
  }
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

function validateDeptName() {
  if (deptName.value.trim().length < 3) {
    deptName.classList.add("is-invalid");
    deptName.classList.remove("is-valid");
    return false;
  } else {
    deptName.classList.remove("is-invalid");
    deptName.classList.add("is-valid");
    return true;
  }
}
function validateContact() {
  const phonePattern = /^\d{10,15}$/;
  if (!phonePattern.test(contact.value.replace(/\D/g, ""))) {
    contact.classList.add("is-invalid");
    contact.classList.remove("is-valid");
    return false;
  } else {
    contact.classList.remove("is-invalid");
    contact.classList.add("is-valid");
    return true;
  }
}
function validateForm() {
  let isValid = true;
  if (!validateDeptName()) isValid = false;
  if (!validateContact()) isValid = false;
  return isValid;
}
function clearValidation() {
  deptName.classList.remove("is-valid", "is-invalid");
  contact.classList.remove("is-valid", "is-invalid");
}

fetchAndRenderDepartments();
