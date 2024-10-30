const scrollUpBtn = document.getElementById("scrollUp");

// Show the button when scrolling down 100px from the top
window.addEventListener("scroll", () => {
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    scrollUpBtn.classList.add("show"); // Add class to show button
  } else {
    scrollUpBtn.classList.remove("show"); // Remove class to hide button
  }
});

// Scroll to top when the button is clicked
scrollUpBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Smooth scroll to the top
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const chatIcon = document.getElementById("chat-icon");
  const chatPopup = document.getElementById("chat-popup");
  const closeBtn = document.getElementById("closeBtns");

  chatIcon.addEventListener("click", () => {
    console.log("hello");

    chatPopup.classList.toggle("show");
  });

  closeBtn.addEventListener("click", () => {
    chatPopup.classList.remove("show");
  });
});