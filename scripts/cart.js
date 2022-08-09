import { localmenu } from "./products.js";
//initializing variables
const cartBody = document.querySelector(".cart--body");
const cart = document.querySelector(".cart");
const localCart = [];
const badge = document.querySelector(".badge");

const checkout = document.querySelector(".checkout--body");
const checkoutTotal = document.querySelector(".checkout--total");
const title = document.querySelector("title").textContent;

let totalAmount = 0;
let cartOpen = true;
let cartHtml = "";
let checkoutHtml = "";

//#region ---------------------- Cart ----------------------------

const loadCart = async () => {
  /* LOADING CART FROM DATABASE*/
  let url = "http://localhost:3000/cart";
  const res = await fetch(url);
  const data = await res.json();
  let currentAmount = 0;
  for (let item = 0; item < data.length; item++) {
    localCart.push(data[item]);
    const amount = data[item].price * data[item].qty;
    totalAmount = Math.round((totalAmount + amount) * 1e2) / 1e2;

    if (checkout != null) {
      checkoutTotal.innerHTML = "$" + totalAmount.toFixed(2);
    }
    //adding badge wuth qty
    if (localCart.length > 0) {
      if (title !== "Cart") {
        currentAmount += parseInt(localCart[item].qty);
        badge.style.display = "flex";
        badge.innerHTML = currentAmount;
      } else badge.style.display = "none";
    } else badge.style.display = "none";
  }
  postCart();
};

//parsing image url
const getLastItem = (thePath) => {
  const name = thePath.substring(thePath.lastIndexOf("/") + 1);
  const split = thePath.split("/");
  const category = split[split.length - 2];
  return category + "/" + name;
};

//Adding to cart
const addToCart = async (id) => {
  let qty = document.getElementById("item" + id).value;
  if (qty < 1) {
    qty = 1;
  }
  const food = localmenu.filter((item) => item.id === id);
  const item = food[0];

  const newItem = {
    id: item.id,
    img: item.img,
    name: item.name,
    price: item.price,
    qty,
    desc: item.desc,
  };
  let exists = localCart.filter(async (obj) => obj === item);
  console.log(exists);
  let index = localCart.findIndex((x) => x.id === item.id);
  if (exists.length > 0) {
    console.log(index);
    if (index >= 0) {
      const newQty = parseInt(localCart[index].qty) + parseInt(qty);
      localCart[index].qty = newQty;
      console.log(item.name + " " + "exists!");
      postCart(cartOpen);
      //Edit item in Database
      editData(id, newQty);
    } else {
      console.log(item.name + " " + "does not exists.");
      item.qty = qty;
      localCart.push(item);
      postCart(cartOpen);

      //add to database
      postData(newItem);
    }
  } else {
    //console.log(item.name + " " + "does not exists.");
    item.qty = qty;
    localCart.push(item);
    postCart();
    //add to database
    postData(newItem);
  }
  const amount = item.price * qty;
  totalAmount = Math.round((totalAmount + amount) * 1e2) / 1e2;
  if (checkout != null) {
    checkoutTotal.innerHTML = "$" + totalAmount.toFixed(2);
  }
  console.log(totalAmount);
  document.getElementById("item" + id).value = 1;
};

//removing Item from cart
const deleteItem = (id, e) => {
  localCart.map((item) => {
    if (item.id === id) {
      console.log(item.name + " " + "removed");
      for (let i = 0; i < localCart.length; i++) {
        if (localCart[i].id === item.id) {
          const amount = localCart[i].price * localCart[i].qty;
          totalAmount = Math.round((totalAmount - amount) * 1e2) / 1e2;
          localCart.splice(i, 1);
          cartBody.innerHTML = "";
          checkoutTotal.innerHTML = "$" + totalAmount.toFixed(2);
          postCart();
        }
      }
    }
  });
};

//post cart
const postCart = (cartOpen) => {
  cartHtml = "";
  checkoutHtml = "";
  for (let i = 0; i < localCart.length; i++) {
    let img = getLastItem(localCart[i].img);
    cartHtml += `
  <div class = "cart--item">
    <img src="./img/products/${img}"/>
    <div>
        <div class = "cart--item_header">
        <h5>${localCart[i].name}</h5>
        </div>
        <p class = "cart--qty"> Quantity: ${localCart[i].qty}</p>
        <p class = "cart--price">$${(
          localCart[i].price * localCart[i].qty
        ).toFixed(2)}</p>
    </div>

  </div>
 `;
    checkoutHtml += `
    <div class = "checkout--item">
        <div class = "checkout--item_body">
            <img src="./img/products/${img}"/>
            <div class = "checkout--item_header">
                <h5>${localCart[i].name}</h5>
           
                <p>${localCart[i].desc}</p>
                <button class = "checkout--item_delete" type = "button">Remove</button>
               
            </div>
        </div>
        <div class = "checkout--qty">
            <button class = "add">+</button><p class = "currentQty"> ${
              localCart[i].qty
            }</p><button class = "subtract">-</button>
        </div>
        <div class = "checkout--item_total">
        <p>$${(localCart[i].price * localCart[i].qty).toFixed(2)}</p>
    </div>
      </div>
    `;
    //adding event listeners
    setTimeout(() => {
      if (checkout != null) {
        let checkoutBtns = document.querySelectorAll(".checkout--item_delete");
        let addBtns = document.querySelectorAll(".add");
        let removeBtns = document.querySelectorAll(".subtract");
        const currentQty = document.querySelectorAll(".currentQty");
        checkoutBtns[i].addEventListener("click", () => {
          deleteData(localCart[i].id);
        });
        addBtns[i].addEventListener("click", () => {
          editData(localCart[i].id, parseInt(localCart[i].qty) + 1);
          currentQty[i].innerText = parseInt(currentQty[i].innerText) + 1;
        });
        removeBtns[i].addEventListener("click", () => {
          editData(localCart[i].id, parseInt(localCart[i].qty) - 1);
          currentQty[i].innerText = parseInt(currentQty[i].innerText) - 1;
        });
      }
    }, 500);

    if (cartOpen) {
      //showing the cart
      cart.classList.add("active");
      setTimeout(() => {
        cart.classList.add("closing");
        setTimeout(() => {
          cart.classList.remove("active");
          cart.classList.remove("closing");
        }, 500);
      }, 1000);
    }
  }

  cartBody.innerHTML = cartHtml;
  if (checkout !== null) {
    checkout.innerHTML = checkoutHtml;
  }
};
//#endregion -- cart

//#region ---------------- Database Functions --------------------

//post to database
const editData = async (id, qty) => {
  if (qty <= 0) {
    deleteData(id);
  } else {
    await fetch(`http://localhost:3000/cart/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ qty: qty }),
    });
  }
};

//post to database
const postData = async (data) => {
  await fetch("http://localhost:3000/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

//remove from database
const deleteData = async (id) => {
  await fetch(`http://localhost:3000/cart/${id}`, {
    method: "Delete",
  });
  deleteItem(id);
};
//#endregion --- database functions

export { cart, loadCart, addToCart, deleteItem };
