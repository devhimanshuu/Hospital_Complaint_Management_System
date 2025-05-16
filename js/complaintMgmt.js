const complaintUrl = "http://localhost:3000/complaints";

const complaintForm = document.getElementById("complaintForm");
const userId = document.getElementById("userId");
const deptId = document.getElementById("deptId");
const ctid = document.getElementById("ctid");
const description = document.getElementById("description");
const status = document.getElementById("status");
const complaintsTableBody = document.getElementById("complaintsTableBody");

let editComplaintId = null;
let allComplaints = [];
let sortDirection = 1;

function fetchAndRenderComplaints() {
  fetch(complaintUrl)
    .then((res) => res.json())
    .then((data) => {
      allComplaints = data;
      renderComplaints(data);
    })
    .catch((error) => console.error("Error fetching complaints:", error));
}

function renderComplaints(complaints) {
  complaintsTableBody.innerHTML = "";
  complaints.forEach((complaint) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${complaint.id}</td>
        <td>${complaint.userId}</td>
        <td>${complaint.deptId}</td>
        <td>${complaint.ctid}</td>
        <td>${complaint.description}</td>
        <td>${complaint.status}</td>
        <td>${new Date(complaint.dateFiled).toLocaleDateString()}</td>
       <td>
    <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-id="${
      complaint.id
    }">
      Edit
    </button>
    <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${
      complaint.id
    }">
      Delete
    </button>
  </td>
        `;
    complaintsTableBody.appendChild(row);
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
complaintForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!validateForm()) return;

  const data = {
    userId: userId.value.trim(),
    deptId: deptId.value.trim(),
    ctid: ctid.value.trim(),
    description: description.value.trim(),
    dateFiled: new Date().toISOString(),
    status: status.value,
  };

  const url = editComplaintId
    ? `${complaintUrl}/${editComplaintId}`
    : complaintUrl;
  const method = editComplaintId ? "PUT" : "POST";

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(() => {
      fetchAndRenderComplaints();
      complaintForm.reset();
      complaintForm.classList.remove("was-validated");
      editComplaintId = null;
      clearValidation();
    })
    .catch((err) => console.error("Error saving complaint:", err));
});

function loadComplaintForEdit(id) {
  fetch(`${complaintUrl}/${id}`)
    .then((res) => res.json())
    .then((data) => {
      userId.value = data.userId;
      deptId.value = data.deptId;
      ctid.value = data.ctid;
      description.value = data.description;
      status.value = data.status;
      editComplaintId = id;
    })
    .catch((error) =>
      console.error("Error loading complaint for edit:", error)
    );
}
function deleteComplaint(id) {
  if (confirm("Are you sure you want to delete this complaint?")) {
    fetch(`${complaintUrl}/${id}`, { method: "DELETE" })
      .then(() => fetchAndRenderComplaints())
      .catch((err) => console.error("Error deleting complaint:", err));
  }
}
function sortComplaints(column) {
  sortDirection *= -1;
  allComplaints.sort((a, b) => {
    if (a[column] < b[column]) return -1 * sortDirection;
    if (a[column] > b[column]) return 1 * sortDirection;
    return 0;
  });
  renderComplaints(allComplaints);
}
document.querySelector("th:nth-child(2)").style.cursor = "pointer";
document.querySelector("th:nth-child(2)").addEventListener("click", () => {
  sortComplaints("userId");
});

document.querySelector("th:nth-child(3)").style.cursor = "pointer";
document.querySelector("th:nth-child(3)").addEventListener("click", () => {
  sortComplaints("deptId");
});

document.querySelector("th:nth-child(4)").style.cursor = "pointer";
document.querySelector("th:nth-child(4)").addEventListener("click", () => {
  sortComplaints("ctid");
});

document.querySelector("th:nth-child(5)").style.cursor = "pointer";
document.querySelector("th:nth-child(5)").addEventListener("click", () => {
  sortComplaints("description");
});

document.querySelector("th:nth-child(6)").style.cursor = "pointer";
document.querySelector("th:nth-child(6)").addEventListener("click", () => {
  sortComplaints("status");
});

document.querySelector("th:nth-child(7)").style.cursor = "pointer";
document.querySelector("th:nth-child(7)").addEventListener("click", () => {
  sortComplaints("dateFiled");
});

document.querySelectorAll(".form-control").forEach((input) => {
  input.addEventListener("input", () => {
    if (input.checkValidity()) {
      input.classList.remove("is-invalid");
    } else {
      input.classList.add("is-invalid");
    }
  });
});

function validateUserId() {
  if (userId.value.trim().length < 1) {
    userId.classList.add("is-invalid");
    userId.classList.remove("is-valid");
    return false;
  } else {
    userId.classList.remove("is-invalid");
    userId.classList.add("is-valid");
    return true;
  }
}
function validateDeptId() {
  if (deptId.value.trim().length < 3) {
    deptId.classList.add("is-invalid");
    deptId.classList.remove("is-valid");
    return false;
  } else {
    deptId.classList.remove("is-invalid");
    deptId.classList.add("is-valid");
    return true;
  }
}
function validateCtid() {
  if (ctid.value.trim().length < 3) {
    ctid.classList.add("is-invalid");
    ctid.classList.remove("is-valid");
    return false;
  } else {
    ctid.classList.remove("is-invalid");
    ctid.classList.add("is-valid");
    return true;
  }
}
function validateDescription() {
  if (description.value.trim().length < 5) {
    description.classList.add("is-invalid");
    description.classList.remove("is-valid");
    return false;
  } else {
    description.classList.remove("is-invalid");
    description.classList.add("is-valid");
    return true;
  }
}
function validateStatus() {
  if (!status.value) {
    status.classList.add("is-invalid");
    status.classList.remove("is-valid");
    return false;
  } else {
    status.classList.remove("is-invalid");
    status.classList.add("is-valid");
    return true;
  }
}
function validateForm() {
  let isValid = true;
  if (!validateUserId()) isValid = false;
  if (!validateDeptId()) isValid = false;
  if (!validateCtid()) isValid = false;
  if (!validateDescription()) isValid = false;
  if (!validateStatus()) isValid = false;
  return isValid;
}
function clearValidation() {
  userId.classList.remove("is-valid", "is-invalid");
  deptId.classList.remove("is-valid", "is-invalid");
  ctid.classList.remove("is-valid", "is-invalid");
  description.classList.remove("is-valid", "is-invalid");
  status.classList.remove("is-valid", "is-invalid");
}

fetchAndRenderComplaints();
