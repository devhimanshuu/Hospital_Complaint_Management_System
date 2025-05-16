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
    Dashboard: "../pages/userDashboard.html",
    "File Complaint": "../pages/fileComplaint.html",
    "My Complaints": "../pages/myComplaints.html",
    "Track Complaint": "../pages/trackComplaints.html",
    "Contact Support": "../pages/userContactSupport.html",
    Settings: "../pages/userSettings.html",
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
          script.src = "../js/userDashboard.js";
          script.type = "module";
          script.defer = true;
          document.body.appendChild(script);
        }
        if (text === "My Complaints") {
          const script = document.createElement("script");
          script.src = "../js/myComplaints.js";
          script.type = "module";
          script.defer = true;
          document.body.appendChild(script);
        }
        if (text === "Track Complaint") {
          const script = document.createElement("script");
          script.src = "../js/trackComplaints.js";
          script.type = "module";
          script.defer = true;
          document.body.appendChild(script);
        }
        if (text === "File Complaint") {
          const script = document.createElement("script");
          script.src = "../js/fileComplaint.js";
          script.type = "module";
          script.defer = true;
          document.body.appendChild(script);
        }
        if (text === "Contact Support") {
          const script = document.createElement("script");
          script.src = "../js/userContactSupport.js";
          script.type = "module";
          script.defer = true;
          document.body.appendChild(script);
        }
        if (text === "Settings") {
          const script = document.createElement("script");
          script.src = "../js/userSettings.js";
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
