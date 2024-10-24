import { menuArray } from "/data.js";

const checkoutItems = document.getElementById("inner-checkout-container");
const totalPriceElement = document.getElementById("total-price");
const finalPriceElement = document.getElementById("final-price");
const discountPriceElement = document.getElementById("discount-price");
let orderArray = [];
// const completeBtn = document.getElementById("completeBtn");
const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");
const cardForm = document.getElementById("card-form");
const thanksDiv = document.getElementById("thanks-div");
const discountContainer = document.getElementById("discount-container");
const finalContainer = document.getElementById("final-container");
const classlistCheckoutContainer = document.getElementById(
  `order-checkout-container`
).classList;
let msg = "";

// FEEDBACK RATING

// To access the stars
let stars = document.getElementsByClassName("star");
let starclass = "";

// Funtion to update rating
function calculateRating(n) {
  remove();
  for (let i = 0; i < n; i++) {
    if (n == 1) {
      starclass = "one";
    } else if (n == 2) {
      starclass = "two";
    } else if (n == 3) {
      starclass = "three";
    } else if (n == 4) {
      starclass = "four";
    } else if (n == 5) {
      starclass = "five";
    }
    stars[i].className = "star " + starclass;
  }

  msg.innerHTML = `<small>Thank you for your feedback.</small>`;
}

// To remove the pre-applied styling
function remove() {
  let i = 0;
  while (i < 5) {
    stars[i].className = "star";
    i++;
  }
}

// creating and showing menu html
const menuHtml = menuArray.map(function ({
  emoji,
  name,
  ingredients,
  price,
  id,
}) {
  return `<section>
            <div class="food-item">
                    <div class="food-item-info">
                        <div class="food-item-img">
                            <p>${emoji}</p>
                        </div>
                        <div class="food-item-text">
                            <h3 class="size28">${name}</h3>
                            <p class="size16 descColor">${ingredients.join(
                              ", "
                            )}</p>
                            <p class="size20">$${price}</p>
                        </div>
                    </div>
                    <div>
                        <button class="addBtn inter-extra-light" data-add="${id}">+</button>
                    </div>
            </div>
        </section>
`;
});

// event listener for add, remove, complete, star buttons
document.addEventListener("click", function (e) {
  if (e.target.dataset.add) {
    handleAddClick(e.target.dataset.add);
  } else if (e.target.dataset.remove) {
    handleRemoveClick(e.target.dataset.remove);
  } else if (e.target.id === "completeBtn") {
    console.log("Complete button clicked");
    overlay.style.display = "block";
    modal.classList.toggle("hidden");
    console.log(modal.classList);
  }

  switch (e.target.id) {
    case "star1":
      calculateRating(1);
      break;
    case "star2":
      calculateRating(2);
      break;
    case "star3":
      calculateRating(3);
      break;
    case "star4":
      calculateRating(4);
      break;
    case "star5":
      calculateRating(5);
      break;
  }
});

// form event listener
cardForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Clearing previous order info
  orderArray = [];
  totalPriceElement.innerText = 0;
  finalPriceElement.innerText = 0;
  discountPriceElement.innerText = 0;

  if (!discountContainer.classList.contains("hidden")) {
    discountContainer.classList.toggle("hidden");
    finalContainer.classList.toggle("hidden");
  }

  // pay Submit code
  const cardFormData = new FormData(cardForm);

  const name = cardFormData.get("customerName");
  const cardNo = cardFormData.get("customerCardNumber");
  const cardCvv = cardFormData.get("customerCVV");

  modal.classList.toggle("hidden");
  classlistCheckoutContainer.toggle("hidden");
  overlay.style.display = "none";

  thanksDiv.innerHTML = `
                            <p>Thanks, ${name}! Your order is on its way!</p>
                                <div class="card">
                                    <br />
                                    <span id="star1"
                                        class="star">★
                                    </span>
                                    <span id="star2"
                                        class="star">★
                                    </span>
                                    <span id="star3"
                                        class="star">★
                                    </span>
                                    <span id="star4"
                                        class="star">★
                                    </span>
                                    <span id="star5"
                                        class="star">★
                                    </span>
                                </div>
                                <p id="msg"><small>Please rate your feedback!<small></p>
                  `;
  msg = document.getElementById("msg");
  thanksDiv.classList.toggle("hidden");
});

// creating order html
function getOrderHtml() {
  console.log(orderArray);
  let orderHtml = "";
  orderArray.forEach(function (order) {
    orderHtml += `
                        <div class="checkout-item">
                            <div class="checkout-item-info">
                                <p class="size28 padding0 margin0">${
                                  order.name
                                }<span class="quantity"> ${
      order.quantity > 1 ? `x ${order.quantity}` : ""
    } </span></p>
                                <button class="removeBtn" data-remove="${
                                  order.id
                                }">remove</button>
                            </div>
                            <div class="priceDiv">
                                <p class="padding0 margin0">$${
                                  order.price * order.quantity
                                }</p> 
                            </div>
                        </div>
                    `;
  });

  return orderHtml;
}

// Removing food item
function handleRemoveClick(foodItemId) {
  // Setting show total price
  let totalPrice = Number(totalPriceElement.innerHTML);

  // getting object using index of orderarray
  const targetFoodItemObj = orderArray.filter(function (foodItem, index) {
    if (foodItem.id === Number(foodItemId)) {
      totalPrice -= foodItem.price * foodItem.quantity;
      totalPriceElement.innerText = totalPrice;

      foodItem.quantity = 0;
    }

    return foodItem.id === Number(foodItemId);
  })[0];

  // removing this specific object from orderarray
  const modifiedFoodItemObj = orderArray.filter(
    (foodItem) => foodItem.id !== Number(foodItemId)
  );
  orderArray = modifiedFoodItemObj;

  checkoutItems.innerHTML = getOrderHtml(); // some problem here

  // Checking for discount
  let discount = checkDealDiscount();

  if (discount !== 0) {
    discountPriceElement.innerText = discount;
    finalPriceElement.innerText = totalPrice - discount;
  } else {
    discountPriceElement.innerText = discount;
    finalPriceElement.innerText = totalPrice;

    if (!discountContainer.classList.contains("hidden")) {
      discountContainer.classList.toggle("hidden");
      finalContainer.classList.toggle("hidden");
    }
  }

  if (orderArray.length === 0) {
    classlistCheckoutContainer.toggle("hidden");
  }
}

// Adding food item
function handleAddClick(foodItemId) {
  // Clearing rating section
  if (!thanksDiv.classList.contains("hidden")) {
    thanksDiv.classList.add("hidden");
  }

  console.log(checkoutItems.classList);
  console.log(classlistCheckoutContainer);

  if (checkoutItems.classList.contains("hidden")) {
    checkoutItems.classList.remove("hidden");
  }

  if (classlistCheckoutContainer.contains("hidden")) {
    classlistCheckoutContainer.toggle("hidden");
  }

  console.log(menuArray);

  // getting food object from data using food item id
  const targetFoodItemObj = menuArray.filter(function (foodItem) {
    if (foodItem.id === Number(foodItemId)) {
      if (foodItem.quantity === 0) {
        orderArray.push(foodItem);
      }
      foodItem.quantity += 1;
    }
    return foodItem.id === Number(foodItemId);
  })[0];

  // orderArray.push(targetFoodItemObj);

  // creating and showing order html
  checkoutItems.innerHTML = getOrderHtml();

  let totalPrice = Number(totalPriceElement.innerHTML);
  totalPrice += targetFoodItemObj.price;
  totalPriceElement.innerText = totalPrice;

  //Discount
  let discount = checkDealDiscount();

  // Applying discount
  if (discount !== 0) {
    discountPriceElement.innerText = discount;
    finalPriceElement.innerText = totalPrice - discount;

    if (discountContainer.classList.contains("hidden")) {
      discountContainer.classList.toggle("hidden");
      finalContainer.classList.toggle("hidden");
    }
  } else {
    // Setting show final price
    finalPriceElement.innerText = totalPrice;
  }

  // adding/removing hidden class (For showing and hiding container divs)

  if (classlistCheckoutContainer.contains("hidden")) {
    classlistCheckoutContainer.toggle("hidden");
  }
}

// Checking if customer eligible for mealdeal discount
function checkDealDiscount() {
  let pizzaCount = 0;
  let burgerCount = 0;
  let beerCount = 0;
  let discount = 0;

  orderArray.forEach(function (item) {
    if (item.id === 0) {
      pizzaCount = item.quantity;
    } else if (item.id === 1) {
      burgerCount = item.quantity;
    } else if (item.id === 2) {
      beerCount = item.quantity;
    }
  });

  if (pizzaCount && burgerCount && beerCount) {
    let count = Math.min(pizzaCount, Math.min(burgerCount, beerCount));
    discount = count * 2;
  }

  return discount;
}

document.getElementById("inner-container").innerHTML = menuHtml.join("");
