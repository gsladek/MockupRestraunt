import { localmenu } from "./products.js";
//initializing variables
const localCart = [];

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
  for (let item = 0; item < data.length; item++) {
    localCart.push(data[item]);
    const amount = data[item].price * data[item].qty;
    totalAmount = Math.round((totalAmount + amount) * 1e2) / 1e2;

    if (checkout != null) {
      checkoutTotal.innerHTML = "$" + totalAmount.toFixed(2);
    }
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
      //Edit item in Database
      editData(id, newQty);

      //update the local data
      postCart(cartOpen);
    } else {
      item.qty = qty;
      localCart.push(item);

      //add to database
      postData(newItem);
      //update the local data
      postCart(cartOpen);
    }
  } else {
    //console.log(item.name + " " + "does not exists.");
    item.qty = qty;
    localCart.push(item);
    //add to database
    postData(newItem);
    //update the local data
    postCart(cartOpen);
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
const deleteItem = (id, qty) => {
  localCart.map((item) => {
    if (item.id === id) {
      console.log(item.name + " " + "removed");
      for (let i = 0; i < localCart.length; i++) {
        if (localCart[i].id === item.id) {
          const amount = localCart[i].price * qty;
          totalAmount = Math.round((totalAmount - amount) * 1e2) / 1e2;
          localCart.splice(i, 1);
          checkout.innerHTML = "";
          checkoutTotal.innerHTML = "$" + totalAmount.toFixed(2);
          postCart();
        }
      }
    }
  });
};

//post cart
const postCart = (cartOpen) => {
  const badge = document.querySelector(".badge");
  const cart = document.querySelector(".cart");
  const cartBody = document.querySelector(".cart--body");
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
        <p class = "item--price">$${(
          localCart[i].price * localCart[i].qty
        ).toFixed(2)}</p>
    </div>
      </div>
    `;
    //adding event listeners

    setTimeout(() => {
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

      if (checkout != null) {
        let checkoutBtns = document.querySelectorAll(".checkout--item_delete");
        let addBtns = document.querySelectorAll(".add");
        let removeBtns = document.querySelectorAll(".subtract");
        const currentQty = document.querySelectorAll(".currentQty");
        const Allprices = document.querySelectorAll(".item--price");

        //DELETE BUTTON
        checkoutBtns[i].addEventListener("click", () => {
          deleteData(localCart[i].id);
          console.log(localCart[i].qty);
          deleteItem(localCart[i].id, localCart[i].qty);
        });
        //ADJUSTING QUANTITY
        addBtns[i].addEventListener("click", () => {
          const newQty = parseInt(currentQty[i].innerText) + 1;
          editData(localCart[i], newQty);
          currentQty[i].innerText = newQty;
          let itemTotal = Math.round(localCart[i].price * newQty * 1e2) / 1e2;
          Allprices[i].innerHTML = "$" + itemTotal.toFixed(2);

          //updating cart total
          totalAmount =
            Math.round((totalAmount + parseFloat(itemTotal) / newQty) * 1e2) /
            1e2;
          checkoutTotal.innerHTML = "$" + totalAmount.toFixed(2);
        });

        removeBtns[i].addEventListener("click", () => {
          const newQty = parseInt(currentQty[i].innerText) - 1;
          editData(localCart[i], newQty);
          currentQty[i].innerText = newQty;
          let itemTotal = Math.round(localCart[i].price * newQty * 1e2) / 1e2;
          Allprices[i].innerHTML = "$" + itemTotal.toFixed(2);
          //updateing cart total
          totalAmount =
            Math.round((totalAmount - parseFloat(itemTotal) / newQty) * 1e2) /
            1e2;
          checkoutTotal.innerHTML = "$" + totalAmount.toFixed(2);
        });
      }
    }, 500);
  }
  if (cart !== null) {
    cartBody.innerHTML = cartHtml;
  }

  //adding tooltip id cart is empty
  const cartBtn = document.querySelector(".btn--cart");
  if (localCart.length <= 0) {
    cartBtn.href = "#";
    cartBtn.classList.add("empty");
  } else {
    cartBtn.href = "./cart.html";
    cartBtn.classList.remove("empty");
  }
  if (checkout !== null) {
    checkout.innerHTML = checkoutHtml;
    if (localCart.length <= 0) {
      location.href = "./";
    }
  }

  if (localCart.length > 0) {
    let currentAmount = 0;

    for (let i = 0; i < localCart.length; i++) {
      currentAmount += parseInt(localCart[i].qty);
    }
    if (title !== "Cart") {
      badge.style.display = "flex";
      badge.innerHTML = currentAmount;
    }
  } else badge.style.display = "none";
};
//#endregion -- cart

//#region ---------------- Database Functions --------------------

//post to database
const editData = async (item, qty) => {
  if (qty === 0) {
    deleteData(item.id);
    deleteItem(item.id);
  } else {
    item.qty = qty;
    await fetch(`http://localhost:3000/cart/${item.id}`, {
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
  postCart();
};

//remove from database
const deleteData = async (id) => {
  await fetch(`http://localhost:3000/cart/${id}`, {
    method: "Delete",
  });
};
//#endregion --- database functions

export { loadCart, addToCart, deleteItem, localCart };
