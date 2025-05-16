const apiUrl = "http://localhost:3000/complaintTypes";
const form = document.getElementById("complainForm");
const complaintType = document.getElementById("complaintType");
const complaintSeverity = document.getElementById("complainDetails");
const submitBtn = document.getElementById("submitBtn");
const searchInput = document.createElement("input");
let editId = null;
let allComplaints = [];
let sortDirection = 1;

searchInput.setAttribute("type", "text");
searchInput.setAttribute("placeholder", "Search by Complaint Type...");
searchInput.classList.add("form-control", "mb-3");
document
  .querySelector(".table")
  .parentNode.insertBefore(searchInput, document.querySelector(".table"));

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filtered = allComplaints.filter((cat) =>
    cat.complaintType.toLowerCase().includes(searchTerm)
  );
  renderComplaints(filtered);
});

function fetchAndRenderComplaints() {
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      allComplaints = data;
      renderComplaints(data);
    })
    .catch((error) => console.error("Error fetching complaints:", error));
}

function renderComplaints(complaints) {
  const tbody = document.getElementById("complainTableBody");
  tbody.innerHTML = "";

  complaints.forEach((complaint) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${complaint.id}</td>
      <td>${complaint.complaintType}</td>
      <td>${complaint.complaintSeverity}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-id="${complaint.id}">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${complaint.id}">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      loadComplaintForEdit(id);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      deleteComplaint(id);
    });
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!validateForm()) return;

  const complaints = {
    complaintType: complaintType.value.trim(),
    complaintSeverity: complaintSeverity.value.trim(),
  };

  if (editId) {
    fetch(`${apiUrl}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(complaints),
    })
      .then(() => {
        fetchAndRenderComplaints();
        form.reset();
        editId = null;
        submitBtn.textContent = "Add Complaint";
        clearValidation();
      })
      .catch((error) => console.error("Error updating complaint:", error));
  } else {
    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(complaints),
    })
      .then(() => {
        fetchAndRenderComplaints();
        form.reset();
        clearValidation();
      })
      .catch((error) => console.error("Error adding complaint:", error));
  }
});

function loadComplaintForEdit(id) {
  fetch(`${apiUrl}/${id}`)
    .then((res) => res.json())
    .then((data) => {
      complaintType.value = data.complaintType;
      complaintSeverity.value = data.complaintSeverity;
      editId = id;
      submitBtn.textContent = "Update Complaint";
    })
    .catch((error) =>
      console.error("Error loading complaint for edit:", error)
    );
}

function deleteComplaint(id) {
  if (confirm("Are you sure you want to delete this complaint?")) {
    fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
    })
      .then(() => fetchAndRenderComplaints())
      .catch((error) => console.error("Error deleting complaint:", error));
  }
}

function validateForm() {
  let isValid = true;

  if (complaintType.value.trim().length < 5) {
    complaintType.classList.add("is-invalid");
    isValid = false;
  } else {
    complaintType.classList.remove("is-invalid");
    complaintType.classList.add("is-valid");
  }

  if (!complaintSeverity.value) {
    complaintSeverity.classList.add("is-invalid");
    isValid = false;
  } else {
    complaintSeverity.classList.remove("is-invalid");
    complaintSeverity.classList.add("is-valid");
  }

  return isValid;
}

function clearValidation() {
  complaintType.classList.remove("is-valid", "is-invalid");
  complaintSeverity.classList.remove("is-valid", "is-invalid");
}

document.querySelector("th:nth-child(2)").style.cursor = "pointer";
document.querySelector("th:nth-child(2)").addEventListener("click", () => {
  const sorted = [...allComplaints].sort(
    (a, b) => a.complaintType.localeCompare(b.complaintType) * sortDirection
  );
  sortDirection *= -1;
  renderComplaints(sorted);
});

fetchAndRenderComplaints();
