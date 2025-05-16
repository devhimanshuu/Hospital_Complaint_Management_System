const complaintsApiUrl = "http://localhost:3000/complaints";
const departmentsApiUrl = "http://localhost:3000/departments";
const complaintTypesApiUrl = "http://localhost:3000/complaintTypes";
const usersApiUrl = "http://localhost:3000/users";

const statusFilter = document.getElementById("status-filter");
const departmentFilter = document.getElementById("department-filter");
const complaintTypeFilter = document.getElementById("complaint-type-filter");
const monthFilter = document.getElementById("month-filter");
const applyFiltersBtn = document.getElementById("apply-filters");
const resetFiltersBtn = document.getElementById("reset-filters");
const exportPdfBtn = document.getElementById("export-pdf");
const complaintsData = document.getElementById("complaints-data");

let allComplaints = [];
let filteredComplaints = [];
let departments = [];
let complaintTypes = [];
let users = [];
let sortDirection = 1;
let currentSortField = null;

// Function to fetch departments from the API to populate the department filter
async function fetchDepartments() {
  try {
    const response = await fetch(departmentsApiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch departments");
    }
    departments = await response.json();
    populateDepartmentFilter();
  } catch (error) {
    console.error("Error fetching departments:", error);
  }
}
// Function to fetch complaint types from the API to populate the complaint type filter
async function fetchComplaintTypes() {
  try {
    const response = await fetch(complaintTypesApiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch complaint types");
    }
    complaintTypes = await response.json();
    populateComplaintTypeFilter();
  } catch (error) {
    console.error("Error fetching complaint types:", error);
  }
}

//function to render the department filter options
function populateDepartmentFilter() {
  departmentFilter.innerHTML = '<option value="">All Departments</option>';
  departments.forEach((department) => {
    const option = document.createElement("option");
    option.value = department.id;
    option.textContent = department.name;
    departmentFilter.appendChild(option);
  });
}
//function to render the complaint type filter options
function populateComplaintTypeFilter() {
  complaintTypeFilter.innerHTML =
    '<option value="">All Complaint Types</option>';
  complaintTypes.forEach((complaintType) => {
    const option = document.createElement("option");
    option.value = complaintType.id;
    option.textContent = complaintType.name;
    complaintTypeFilter.appendChild(option);
  });
}
