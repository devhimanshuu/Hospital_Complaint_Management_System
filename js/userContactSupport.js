document.addEventListener("DOMContentLoaded", function () {
  const faqHeaders = document.querySelectorAll(".faq-header");

  faqHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      const faqBody = this.nextElementSibling;
      const icon = this.querySelector("i");

      faqBody.classList.toggle("show");

      if (faqBody.classList.contains("show")) {
        faqBody.style.display = "block";
        icon.classList.remove("fa-chevron-down");
        icon.classList.add("fa-chevron-up");
      } else {
        faqBody.style.display = "none";
        icon.classList.remove("fa-chevron-up");
        icon.classList.add("fa-chevron-down");
      }
    });
  });
});
