import { menuArray } from "/data.js";

const checkoutItems = document.getElementById("inner-checkout-container");
const showTotalPrice = document.getElementById("total-price");
const showFinalPrice = document.getElementById("final-price");
const showDiscountPrice = document.getElementById("discount-price");
let orderArray = [];
// const completeBtn = document.getElementById("completeBtn");
const modal = document.getElementById("modal");
const cardForm = document.getElementById("card-form");
const thanksDiv = document.getElementById("thanks-div");
const discountCont = document.getElementById("discount-container");
const finalCont = document.getElementById("final-container");
let msg = "";

// FEEDBACK RATING

// To access the stars
let stars = document.getElementsByClassName("star");
let starclass = "";

// Funtion to update rating
function claculateRating(n) {
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
  // console.log('Rating - '+n+ '. Thank you for your feedback.')
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
const menuHtml = menuArray.map(function (foodItem) {
  return `<section>
            <div class="food-item">
                    <div class="food-item-info">
                        <div class="food-item-img">
                            <p>${foodItem.emoji}</p>
                        </div>
                        <div class="food-item-text">
                            <p class="size28">${foodItem.name}</p>
                            <p class="size16 descColor">${foodItem.ingredients.join(
                              ", "
                            )}</p>
                            <p class="size20">$${foodItem.price}</p>
                        </div>
                    </div>
                    <div>
                        <button class="addBtn inter-extra-light" data-add="${
                          foodItem.id
                        }">+</button>
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
    modal.classList.toggle("hidden");
  }

  switch (e.target.id) {
    case "star1":
      claculateRating(1);
      break;
    case "star2":
      claculateRating(2);
      break;
    case "star3":
      claculateRating(3);
      break;
    case "star4":
      claculateRating(4);
      break;
    case "star5":
      claculateRating(5);
      break;
  }
});

// form event listener
cardForm.addEventListener("submit", function (e) {
  e.preventDefault();

  orderArray = [];
  showTotalPrice.innerText = 0;

  const cardFormData = new FormData(cardForm);

  const name = cardFormData.get("customerName");
  const cardNo = cardFormData.get("customerCardNumber");
  const cardCvv = cardFormData.get("customerCVV");

  modal.classList.toggle("hidden");

  const classlistCheckoutContainer = document.getElementById(
    `order-checkout-container`
  ).classList;
  classlistCheckoutContainer.toggle("hidden");

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
  let orderHtml = "";
  orderArray.forEach(function (order, index) {
    orderHtml += `
                        <div class="checkout-item">
                            <div class="checkout-item-info">
                                <p class="size28 padding0 margin0">${order.name}</p>
                                <button class="removeBtn" data-remove="${index}">remove</button>
                            </div>
                            <div class="priceDiv">
                                <p class="padding0 margin0">$${order.price}</p>
                            </div>
                        </div>
                    `;
  });

  return orderHtml;
}

// Removing food item
function handleRemoveClick(foodItemId) {
  // Setting show total price
  let totalPrice = Number(showTotalPrice.innerHTML);

  // getting object using index of orderarray
  const targetFoodItemObj = orderArray.filter(function (foodItem, index) {
    return index === Number(foodItemId);
  })[0];

  // removing this specific object from orderarray
  const modifiedFoodItemObj = orderArray.filter(
    (foodItem, i) => i !== Number(foodItemId)
  );
  orderArray = modifiedFoodItemObj;

  checkoutItems.innerHTML = getOrderHtml();

  totalPrice -= targetFoodItemObj.price;
  showTotalPrice.innerText = totalPrice;

  // Checking for discount
  let discount = checkDealDiscount();
  if (discount !== 0) {
    showDiscountPrice.innerText = discount;
    showFinalPrice.innerText = totalPrice - discount;
  } else {
    showDiscountPrice.innerText = discount;
    showFinalPrice.innerText = totalPrice;

    if (!discountCont.classList.contains("hidden")) {
      discountCont.classList.toggle("hidden");
      finalCont.classList.toggle("hidden");
    }
  }

  const classlistCheckoutContainer = document.getElementById(
    `order-checkout-container`
  ).classList;
  if (orderArray.length === 0) {
    classlistCheckoutContainer.toggle("hidden");
  }
}

// Adding food item
function handleAddClick(foodItemId) {
  // getting food object from data using food item id
  const targetFoodItemObj = menuArray.filter(function (foodItem) {
    return foodItem.id === Number(foodItemId);
  })[0];

  orderArray.push(targetFoodItemObj);

  // creating and showing order html
  checkoutItems.innerHTML = getOrderHtml();

  let totalPrice = Number(showTotalPrice.innerHTML);
  totalPrice += targetFoodItemObj.price;
  showTotalPrice.innerText = totalPrice;

  //Discount
  let discount = checkDealDiscount();

  // Applying discount
  if (discount !== 0) {
    showDiscountPrice.innerText = discount;
    showFinalPrice.innerText = totalPrice - discount;

    if (discountCont.classList.contains("hidden")) {
      discountCont.classList.toggle("hidden");
      finalCont.classList.toggle("hidden");
    }
  } else {
    // Setting show final price
    showFinalPrice.innerText = totalPrice;
  }

  // adding/removing hidden class (For showing and hiding container divs)
  const classlistCheckoutContainer = document.getElementById(
    `order-checkout-container`
  ).classList;
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
      pizzaCount++;
    } else if (item.id === 1) {
      burgerCount++;
    } else if (item.id === 2) {
      beerCount++;
    }
  });

  if (pizzaCount && burgerCount && beerCount) {
    let count = Math.min(pizzaCount, Math.min(burgerCount, beerCount));
    discount = count * 2;
  }

  return discount;
}

document.getElementById("inner-container").innerHTML = menuHtml.join("");
