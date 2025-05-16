const apiUrl = "http://localhost:3000/complaints";

document.addEventListener("DOMContentLoaded", function () {
  const trackBtn = document.getElementById("trackBtn");
  const complaintIdInput = document.getElementById("complaintIdInput");
  const trackingResults = document.getElementById("trackingResults");
  const noResults = document.getElementById("noResults");

  const complaintInfo = document.querySelector(".complaint-info");
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const userId = storedUser?.id;

  trackBtn.addEventListener("click", async function () {
    const complaintId = complaintIdInput.value.trim();

    if (!complaintId || isNaN(complaintId)) {
      alert("Please enter a valid numeric Complaint ID.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/${complaintId}`);
      if (!response.ok) throw new Error("Complaint not found");

      const complaint = await response.json();

      if (complaint.userId == userId) {
        trackingResults.style.display = "block";
        noResults.style.display = "none";

        // Dynamically inject data (expand this for real data)
        complaintInfo.querySelector(
          "h5"
        ).textContent = `Complaint #${complaint.id}`;
        complaintInfo.querySelector(
          "strong:nth-of-type(1)"
        ).nextSibling.textContent = ` ${complaint.description}`;
        complaintInfo.querySelector(
          "strong:nth-of-type(2)"
        ).nextSibling.textContent = ` ${new Date(
          complaint.dateFiled
        ).toLocaleDateString()}`;
        // Add more fields as needed (department, type, status, etc.)
      } else {
        trackingResults.style.display = "none";
        noResults.style.display = "block";
      }
    } catch (err) {
      trackingResults.style.display = "none";
      noResults.style.display = "block";
      console.error("Error fetching complaint:", err);
    }
  });

  // Allow Enter key
  complaintIdInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      trackBtn.click();
    }
  });
});
