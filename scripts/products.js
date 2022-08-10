import { loadCart, addToCart, deleteItem } from "./cart.js";

const title = document.querySelector("title").textContent;
const localmenu = [];
const menu = document.querySelector("#menu");
const cart = document.querySelector(".cart");

let filteredmenu = [];
let html = "";
let start = 0;
let end = 6;

//#region ---------------------- Menu ----------------------------
// Sorting Menu
async function sortMenu(type) {
  filteredmenu = localmenu.filter((item) => {
    if (type !== "all") {
      if (item.type === type) {
        return item;
      }
    } else {
      return item;
    }
  });
  start = 0;
  end = 6;
  postMenu(start, end);
}

// Appending Menu to html
const postMenu = (start, end) => {
  let page = filteredmenu.slice(start, end);
  html = "";

  for (let item = 0; item < page.length; item++) {
    html += `<div class="card">
        <img
          src=${page[item].img}
        />
        <div class="card--inner">
          <div class="container">
            <h6 class="card--title">${page[item].name}</h6>
            <span> $${page[item].price.toFixed(2)} USD </span>
          </div>
          <div class="card--text">
          ${page[item].desc}
          </div>
          <div class="card--footer">
            <input type="number" min="0" placeholder="1" id = ${
              "item" + page[item].id
            }
            } />
            <button class = "add-to-cart">Add To Cart</button>
          </div>
        </div>
      </div>`;

    // Adding Event Listener to the buttons
    setTimeout(function () {
      let addBtns = document.querySelectorAll(".add-to-cart");
      addBtns[item].addEventListener("click", () => {
        if (cart != null) {
          cart.classList.add("active");
        }

        addToCart(page[item].id);
      });
    }, 500);
  }

  const next = document.querySelector("#next");
  if (page.length < filteredmenu.length) {
    const nextPage = () => {
      start = start + 6;
      end = start + 6;
      if (start > filteredmenu.length) {
        start = 0;
        end = 6;
      }
      postMenu(start, end);
    };
    next.style.display = "block";
    next.addEventListener("click", () => {
      nextPage();
    });
  } else {
    if (next != null) {
      next.style.display = "none";
    }
  }

  if (menu != "undefined") {
    menu.innerHTML = html;
  }
};

// Loading Menu to page
const loadMenu = async (type) => {
  let url = "http://localhost:3000/menu";
  const res = await fetch(url);
  const menuList = await res.json();
  for (let food = 0; food < menuList.length; food++) {
    localmenu.push(menuList[food]);
  }
  sortMenu(type);
};

if (title === "Home") {
  loadMenu("burgers");
}
if (title === "Order") {
  loadMenu("all");
}
//#endregion

export { menu, filteredmenu, sortMenu, loadCart, localmenu };
