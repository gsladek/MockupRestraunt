export const header = document.querySelector(".pageheader");

header.innerHTML = `
      <div class="alert">
        <div class="alert--inner">
          <span>We're open and available for takeaway & delivery.</span>
          <a href="order.html">&#xa0;Order Now</a>
        </div>
        </div>
    
        <nav class="navbar">
        <a href="index.html" class="nav-brand">
          <img src="../img/logo.svg" alt="logo" class="nav-logo" />
        </a>
        <ul class="nav-menu">
          <li class="nav-item">
            <a href="index.html" class="nav-link">Home</a>
          </li>
          <li class="nav-item">
            <a href="order.html" class="nav-link">Order</a>
          </li>
          <li class="nav-item">
            <a href="company.html" class="nav-link">Company</a>
          </li>
          <li class="nav-item">
            <a href="faq.html" class="nav-link">FAQ</a>
          </li>
          <li class="nav-item">
            <a href="contact.html" class="nav-link">Contact</a>
          </li>
        </ul>
        <div class="container--flex">
          <div class="nav-item">
          <div class = "badge"></div>
            <a href="cart.html" class="btn--cart">
              <svg
                class="cart-icon"
                width="17px"
                height="17px"
                viewBox="0 0 17 17"
              >
                <g
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  <path
                    d="M2.60592789,2 L0,2 L0,0 L4.39407211,0 L4.84288393,4 L16,4 L16,9.93844589 L3.76940945,12.3694378 L2.60592789,2 Z M15.5,17 C14.6715729,17 14,16.3284271 14,15.5 C14,14.6715729 14.6715729,14 15.5,14 C16.3284271,14 17,14.6715729 17,15.5 C17,16.3284271 16.3284271,17 15.5,17 Z M5.5,17 C4.67157288,17 4,16.3284271 4,15.5 C4,14.6715729 4.67157288,14 5.5,14 C6.32842712,14 7,14.6715729 7,15.5 C7,16.3284271 6.32842712,17 5.5,17 Z"
                    fill="currentColor"
                    fill-rule="nonzero"
                  ></path>
                </g>
              </svg>
            </a>
          </div>
          <div class="nav-item hamburger-nav">
            <span class="hamburger-bar"></span>
            <span class="hamburger-bar"></span>
            <span class="hamburger-bar"></span>
          </div>
        </div>
        </nav>
        <div class="menu-mobile">
        <ul class="nav-menu">
          <li class="nav-item">
            <a href="index.html" class="nav-link">Home</a>
          </li>
          <li class="nav-item">
            <a href="order.html" class="nav-link">Order</a>
          </li>
          <li class="nav-item">
            <a href="company.html" class="nav-link">Company</a>
          </li>
          <li class="nav-item">
            <a href="faq.html" class="nav-link">FAQ</a>
          </li>
          <li class="nav-item">
            <a href="contact.html" class="nav-link">Contact</a>
          </li>
        </ul>
      </div>
      <div class = "cart">
        <div class = "cart--header">
        <h4>Your Order</h4>
        <button class = "cart--close">X</button>
        </div>
        <div class = "cart--body">
        </div>
      </div>`;

const hamburger = document.querySelector(".hamburger-nav");
const mobileMenu = document.querySelector(".menu-mobile");
const navBar = document.querySelector(".navbar");
const overlay = document.querySelector(".menu--overlay");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  mobileMenu.classList.toggle("active");
  navBar.classList.toggle("active");
  overlay.classList.toggle("active");
});

// ------------------------ Navigation Link Toggle------------------------
window.onload = function () {
  const navLinks = header.getElementsByTagName("a");
  const currentUrl = location.href.split("#")[0]; //Ignore hashes
  // Loop through each link.
  for (let i = 0; i < navLinks.length; i++) {
    if (navLinks[i].href.split("#")[0] == currentUrl) {
      navLinks[i].className += " active";
    }
  }
};

const title = document.querySelector("title").textContent;
