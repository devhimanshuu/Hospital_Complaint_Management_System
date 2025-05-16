document.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  if (!isLoggedIn || isLoggedIn !== "true") {
    window.location.href = "../pages/login.html";
    return;
  }

  const userName = sessionStorage.getItem("userName");
  const userNameElement = document.querySelector(".dropdown-toggle span");
  if (userNameElement && userName) {
    userNameElement.textContent = userName;
  }

  const logoutButton = document.querySelector(".logoutLink");
  if (logoutButton) {
    logoutButton.addEventListener("click", function (e) {
      e.preventDefault();
      sessionStorage.clear();
      window.location.href = "../pages/login.html";
    });
  }

  const sidebar = document.querySelector("#sidebar");
  const contentArea = document.querySelector("#page-content");

  const pageMap = {
    Dashboard: "../pages/adminDashboard.html",
    "Department Management": "../pages/departmentMgmt.html",
    "Complaints Management": "../pages/complaintMgmt.html",
    "User Management": "../pages/userMgmt.html",
    "Complaint Types": "../pages/complaint.html",
    Reports: "../pages/Reports.html",
    Settings: "../pages/adminSettings.html",
  };

  sidebar.addEventListener("click", function (e) {
    const target = e.target.closest("a");
    if (!target) return;

    const text = target.querySelector(".menu-text")?.textContent?.trim();
    if (!text || !(text in pageMap)) return;

    e.preventDefault();

    document.querySelectorAll("#sidebar a").forEach((link) => {
      link.classList.remove("active");
    });
    target.classList.add("active");

    fetch(pageMap[text])
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load content.");
        return response.text();
      })
      .then((html) => {
        contentArea.innerHTML = html;

        if (text === "Dashboard") {
          const script = document.createElement("script");
          script.src = "../js/adminDashboard.js";
          script.type = "module";
          script.defer = true;
          document.body.appendChild(script);
        } else if (text === "Complaint Types") {
          const script = document.createElement("script");
          script.src = "../js/complaints.js";
          script.type = "module";
          script.defer = true;
          document.body.appendChild(script);
        } else if (text === "Department Management") {
          const script = document.createElement("script");
          script.src = "../js/departmentMgmt.js";
          script.type = "module";
          script.defer = true;
          document.body.appendChild(script);
        } else if (text === "Complaints Management") {
          const script = document.createElement("script");
          script.src = "../js/complaintMgmt.js";
          script.type = "module";
          script.defer = true;
          document.body.appendChild(script);
        } else if (text === "User Management") {
          const script = document.createElement("script");
          script.src = "../js/userMgmt.js";
          script.type = "module";
          script.defer = true;
          document.body.appendChild(script);
        } else if (text === "Reports") {
          const script = document.createElement("script");
          script.src = "../js/Reports.js";
          script.type = "module";
          script.defer = true;
          document.body.appendChild(script);
        } else if (text === "Settings") {
          const script = document.createElement("script");
          script.src = "../js/adminSettings.js";
          script.type = "module";
          script.defer = true;
          document.body.appendChild(script);
        }
      })
      .catch((error) => {
        contentArea.innerHTML = `<div class="alert alert-danger mt-3">Error: ${error.message}</div>`;
      });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("sidebarCollapse");
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("sidebar-collapsed");
  });
  const defaultDashboardLink = Array.from(
    document.querySelectorAll("#sidebar a")
  ).find((a) => a.textContent.includes("Dashboard"));
  if (defaultDashboardLink) defaultDashboardLink.click();
});
