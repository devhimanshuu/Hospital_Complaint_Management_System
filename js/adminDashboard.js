document.addEventListener("DOMContentLoaded", () => {
  const userNameSpan = document.getElementById("userName");

  const storedUser = sessionStorage.getItem("user");

  if (storedUser) {
    const user = JSON.parse(storedUser);
    userNameSpan.innerHTML = user.name || "Admin";
  } else {
    window.location.href = "../pages/login.html";
  }
});

fetch("http://localhost:3000/complaints")
  .then((response) => response.json())
  .then((complaints) => {
    const totalComplaints = complaints.length;
    const resolvedComplaints = complaints.filter(
      (complaint) => complaint.status === "Resolved"
    ).length;
    const pendingComplaints = complaints.filter(
      (complaint) => complaint.status === "Pending"
    ).length;

    const inProgressComplaints = complaints.filter(
      (complaint) => complaint.status === "In Progress"
    ).length;

    const totalComp = document.getElementById("totalComp");
    const resolvedComp = document.getElementById("resolvedComp");
    const pendingComp = document.getElementById("pendingComp");
    const inProgressComp = document.getElementById("inProgComp");

    //now show the data on the cards
    totalComp.innerText = totalComplaints;
    resolvedComp.innerHTML = resolvedComplaints;
    pendingComp.innerHTML = pendingComplaints;
    inProgressComp.innerHTML = inProgressComplaints;
  });

fetch("http://localhost:3000/complaints")
  .then((response) => response.json())
  .then((complaints) => {
    const resolvedComplaints = complaints.filter(
      (complaint) => complaint.status === "Resolved"
    ).length;
    const pendingComplaints = complaints.filter(
      (complaint) => complaint.status === "Pending"
    ).length;
    const inProgressComplaints = complaints.filter(
      (complaint) => complaint.status === "In Progress"
    ).length;

    complaintsChart.data.datasets[0].data = [
      resolvedComplaints,
      pendingComplaints,
      inProgressComplaints,
    ];
    complaintsChart.update();
  });

const complaintsChart = new Chart(
  document.getElementById("complaintTypesChart"),
  {
    type: "pie",
    data: {
      labels: ["Resolved", "Pending", "In Progress"],
      datasets: [
        {
          label: "Complaints by Type",
          data: [0, 0, 0],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(255, 206, 86, 0.6)",
          ],
        },
      ],
    },
  }
);

complaintsChart.options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Complaints by Type",
    },
  },
};
