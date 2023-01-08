const hamburger = document.querySelector(".hamburger-menu");
const navMenu = document.querySelector(".nav-menu")

// Event listener when the menu is clicked
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}) 

// Event listener for disappering nav-menu when link is clicked
document.querySelectorAll(".nav-link").forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}))