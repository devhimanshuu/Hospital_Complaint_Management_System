const apiUrl = "http://localhost:3000/complaintTypes";
const departApiUrl = "http://localhost:3000/departments";
const complaintUrl = "http://localhost:3000/complaints";

const departmentSelect = document.getElementById("departmentSelect");
const complaintTypeSelect = document.getElementById("complaintTypeSelect");
const complaintForm = document.getElementById("complaintForm");
const complaintDescription = document.getElementById("description");
const submitButton = document.getElementById("submitBtn");
const resetButton = document.getElementById("resetBtn");
const successMessage = document.getElementById("successMessage");
const dateFiled = document.getElementById("dateFiled");

function setDefaultDateToday() {
  const today = new Date();
  const formatted = today.toISOString().split("T")[0];
  dateFiled.value = formatted;
}
setDefaultDateToday();

fetch(departApiUrl)
  .then((response) => response.json())
  .then((departments) => {
    departments.forEach((department) => {
      const option = document.createElement("option");
      option.value = department.id;
      option.textContent = department.name;
      departmentSelect.appendChild(option);
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
      complaintTypeSelect.appendChild(option);
    });
  })
  .catch((error) => console.error("Error fetching complaint types:", error));

complaintForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const isValid =
    departmentSelect.value !== "Select Department" &&
    complaintTypeSelect.value !== "Select Type" &&
    complaintDescription.value.trim().length > 5 &&
    dateFiled.value !== "";

  if (!isValid) {
    successMessage.textContent = "Please fill all required fields correctly.";
    successMessage.style.display = "block";
    successMessage.style.color = "red";
    return;
  }

  const complaintData = {
    userId: 1,
    deptId: departmentSelect.value,
    ctid: complaintTypeSelect.value,
    description: complaintDescription.value.trim(),
    dateFiled: new Date(dateFiled.value).toISOString(),
    status: "Filed",
  };
  console.log(complaintData);

  fetch(complaintUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(complaintData),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to submit complaint.");
      return response.json();
    })
    .then((data) => {
      console.log("Complaint submitted successfully:", data);
      successMessage.textContent = "Complaint submitted successfully!";
      successMessage.style.color = "green";
      successMessage.style.display = "block";
      complaintForm.reset();
      setDefaultDateToday();
    })
    .catch((error) => {
      console.error("Error submitting complaint:", error);
      successMessage.textContent = "Failed to submit complaint.";
      successMessage.style.color = "red";
      successMessage.style.display = "block";
    });
});

resetButton.addEventListener("click", () => {
  complaintForm.reset();
  successMessage.style.display = "none";
  setDefaultDateToday();
});
