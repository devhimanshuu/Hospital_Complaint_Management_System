const apiUrl = "http://localhost:3000/complaintTypes";
const departApiUrl = "http://localhost:3000/departments";
const complaintUrl = "http://localhost:3000/complaints";
const statusFilter = document.getElementById("statusFilter");
const departmentFilter = document.getElementById("departmentFilter");
const complaintTypeFilter = document.getElementById("typeFilter");
const complaintList = document.getElementById("allComplaints");

fetch(departApiUrl)
  .then((response) => response.json())
  .then((departments) => {
    departments.forEach((department) => {
      const option = document.createElement("option");
      option.value = department.id;
      option.textContent = department.name;
      departmentFilter.appendChild(option);
    });
  })
  .catch((error) => console.error("Error fetching departments:", error));

fetch(apiUrl)
  .then((response) => response.json())
  .then((complaintTypes) => {
    complaintTypes.forEach((type) => {
      const option = document.createElement("option");
      option.value = type.id;
      option.textContent = type.complaintType;
      complaintTypeFilter.appendChild(option);
    });
  })
  .catch((error) => console.error("Error fetching complaint types:", error));

function fetchComplaints() {
  const status = statusFilter.value;
  const department = departmentFilter.value;
  const complaintType = complaintTypeFilter.value;

  let url = `${complaintUrl}?userId=${sessionStorage.getItem("id")}`;

  if (status !== "All Statuses") {
    url += `&status=${status}`;
  }
  if (department !== "All Departments") {
    url += `&deptId=${department}`;
  }
  if (complaintType !== "All Types") {
    url += `&ctid=${complaintType}`;
  }

  if (status !== "All Statuses" && department !== "All Departments") {
    url += `&status=${status}&deptId=${department}`;
  }
  if (status !== "All Statuses" && complaintType !== "All Types") {
    url += `&status=${status}&ctid=${complaintType}`;
  }
  if (department !== "All Departments" && complaintType !== "All Types") {
    url += `&deptId=${department}&ctid=${complaintType}`;
  }
  if (
    status !== "All Statuses" &&
    department !== "All Departments" &&
    complaintType !== "All Types"
  ) {
    url += `&status=${status}&deptId=${department}&ctid=${complaintType}`;
  }
  console.log(url);

  fetch(url)
    .then((response) => response.json())
    .then((complaints) => {
      displayComplaints(complaints);
    })
    .catch((error) => console.error("Error fetching complaints:", error));
}

statusFilter.addEventListener("change", fetchComplaints);
departmentFilter.addEventListener("change", fetchComplaints);
complaintTypeFilter.addEventListener("change", fetchComplaints);

function displayComplaints(complaints) {
  complaintList.innerHTML = "";

  if (complaints.length === 0) {
    complaintList.innerHTML = "<p>No complaints found.</p>";
    return;
  }

  complaints.forEach((complaint) => {
    const complaintDiv = document.createElement("div");
    complaintDiv.className = "complaint-list";
    complaintDiv.innerHTML = `
      <h3>Complaint ID: ${complaint.id}</h3>
      <p><strong>Department:</strong> ${complaint.deptId}</p>
      <p><strong>Type:</strong> ${complaint.ctid}</p>
      <p><strong>Description:</strong> ${complaint.description}</p>
      <p><strong>Date Filed:</strong> ${new Date(
        complaint.dateFiled
      ).toLocaleDateString()}</p>
      <p><strong>Status:</strong> ${complaint.status}</p>
    `;
    complaintList.appendChild(complaintDiv);
  });
}

fetchComplaints();
