import { sortMenu } from "./products.js";
import { sortFAQ } from "./accordian.js";
const menu = document.querySelector("#menu");
const loader = document.querySelector(".loader");
const accordian = document.querySelector(".accordian");
//#region --------------- Setting Up Button Toggle --------------------

const BtnGroup = document.querySelector(".btn-group");
export const toggle = (e) => {
  const btns = BtnGroup.children;
  for (let btn = 0; btn < btns.length; btn++) {
    //filtering out
    btns[btn].classList.remove("active");
  }
  const id = e.srcElement.id;
  const btn = document.getElementById(id);
  btn.classList.add("active");
  console.log(loader);
  if (menu != null) {
    menu.innerHTML = "";
    loader.classList.add("active");
    setTimeout(function () {
      sortMenu(id);
      loader.classList.remove("active");
    }, 1000);
  }
  if (accordian != null) {
    sortFAQ(id);
  }
};

if (BtnGroup !== null) {
  BtnGroup.addEventListener("click", toggle);
}

// #endregion

export { localFaqs } from "./accordian.js";
