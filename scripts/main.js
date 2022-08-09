import { header } from "./header.js";
import { footer } from "./footer.js";
import { toggle } from "./btnGroups.js";
import { menu, loadCart } from "./products.js";
window.addEventListener("DOMContentLoaded", () => {
  loadCart();
});

//#region --------------------------- Read More Toggle --------------------------

const readmore = document.getElementById("read-more");
const copy = document.getElementById("copy");

if (readmore != null) {
  readmore.addEventListener("click", () => {
    copy.classList.toggle("active");
    readmore.classList.toggle("active");
  });
}

//#endregion

//#region --------------------------- Scrolling Animations -----------------------

const fadeIn = Array.from(document.querySelectorAll(".fade-in"));
const popIn = Array.from(document.querySelectorAll(".pop-in"));
const popInDelay = Array.from(document.querySelectorAll(".pop-in_delay"));
const slideInRight = Array.from(document.querySelectorAll(".slide-in-right"));
const slideInLeft = Array.from(document.querySelectorAll(".slide-in-left"));
const slideInLeftDelay = Array.from(
  document.querySelectorAll(".slide-in-left_delay")
);

const parseElement = (array) => {
  array.forEach((element) => {
    if (isVisable(element)) {
      element.classList.add("active");
    } else {
      element.classList.remove("active");
    }
  });
};

const scanElements = () => {
  parseElement(fadeIn);
  parseElement(slideInLeft);
  setTimeout(function () {
    parseElement(slideInLeftDelay);
  }, 500);
  setTimeout(function () {
    parseElement(slideInRight);
  }, 1000);

  parseElement(popIn);

  setTimeout(function () {
    parseElement(popInDelay);
  }, 500);
};

const isVisable = (element) => {
  const animation = element.getBoundingClientRect();
  let distanceFromTop = -100;
  return animation.top - window.innerHeight < distanceFromTop ? true : false;
};

const throttle = (fn, delay) => {
  let lastCall = 0;
  return (...args) => {
    let context = this;
    let current = new Date().getTime();

    if (current - lastCall < delay) {
      return;
    }
    lastCall = current;
    return fn.apply(context, ...args);
  };
};

window.addEventListener("scroll", throttle(scanElements, 50));
//#endregion --------------------------- Scrolling Animations END -----------------------

//#region ------------------------------ Contact Form ----------------------------

const btnSubmit = document.getElementById("btn-submit");
const form = document.getElementById("contact-form");

if (btnSubmit !== null) {
  btnSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("submitted");
    document.querySelector(".form--thank_you").style.display = "block";
    form.style.display = "none";
  });
}

//#endregion ------------------------------ Contact Form END ----------------------------
