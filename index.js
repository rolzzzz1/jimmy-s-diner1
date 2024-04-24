import { menuArray } from "/data.js";

const checkoutItems = document.getElementById("inner-checkout-container");
const showTotalPrice = document.getElementById("total-price");
const showFinalPrice = document.getElementById("final-price");
const showDiscountPrice = document.getElementById("discount-price");
let orderArray = [];
const completeBtn = document.getElementById("completeBtn");
const modal = document.getElementById("modal");
const cardForm = document.getElementById("card-form");
const thanksDiv = document.getElementById("thanks-div");
const discountCont = document.getElementById("discount-container");
const finalCont = document.getElementById("final-container");

// var acceptedCreditCards = {
//   visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
//   mastercard: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
//   amex: /^3[47][0-9]{13}$/,
//   discover: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
//   diners_club: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
//   jcb: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/
// };

// To access the stars
let stars = document.getElementsByClassName("star");
// let output =
//     document.getElementById("output");

// Funtion to update rating
function gfg(n) {
  remove();
  for (let i = 0; i < n; i++) {
    if (n == 1) cls = "one";
    else if (n == 2) cls = "two";
    else if (n == 3) cls = "three";
    else if (n == 4) cls = "four";
    else if (n == 5) cls = "five";
    stars[i].className = "star " + cls;
  }
  // output.innerText = "Rating is: " + n + "/5";
  console.log("Rating - " + n);
}

// To remove the pre-applied styling
function remove() {
  let i = 0;
  while (i < 5) {
    stars[i].className = "star";
    i++;
  }
}

const menuHtml = menuArray.map(function (foodItem) {
  return `<section>
            <div class="food-item">
                <div class="food-item-inner">
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
                    <div class="addBtnDiv">
                        <button class="addBtn inter-extra-light" data-add="${
                          foodItem.id
                        }">+</button>
                    </div>
                </div>
            </div>
        </section>
`;
});

document.addEventListener("click", function (e) {
  if (e.target.dataset.add) {
    handleAddClick(e.target.dataset.add);
  } else if (e.target.dataset.remove) {
    handleRemoveClick(e.target.dataset.remove);
  }
});

completeBtn.addEventListener("click", function () {
  console.log("complete order clicked");
  console.log(modal.classList);
  modal.classList.toggle("hidden");
});

cardForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const cardFormData = new FormData(cardForm);

  const name = cardFormData.get("customerName");
  const cardNo = cardFormData.get("customerCardNumber");
  const cardCvv = cardFormData.get("customerCVV");
  console.log(name, cardNo, cardCvv);

  modal.classList.toggle("hidden");

  const classlistCheckoutContainer = document.getElementById(
    `order-checkout-container`
  ).classList;
  classlistCheckoutContainer.toggle("hidden");

  thanksDiv.innerHTML = `
                            <p>Thanks, ${name}! Your order is on its way!</p>
                            <div class="rating">
                                <i class="rating__star far fa-star"></i>
                                <i class="rating__star far fa-star"></i>
                                <i class="rating__star far fa-star"></i>
                                <i class="rating__star far fa-star"></i>
                                <i class="rating__star far fa-star"></i>
                            </div>
                            `;
  thanksDiv.classList.toggle("hidden");
});

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

function handleRemoveClick(foodItemId) {
  // Setting show total price
  let totalPrice = Number(showTotalPrice.innerHTML);

  const targetFoodItemObj = orderArray.filter(function (foodItem, index) {
    return index === Number(foodItemId);
  })[0];

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
    console.log(discount);
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

function handleAddClick(foodItemId) {
  const targetFoodItemObj = menuArray.filter(function (foodItem) {
    return foodItem.id === Number(foodItemId);
  })[0];

  orderArray.push(targetFoodItemObj);

  checkoutItems.innerHTML = getOrderHtml();

  let totalPrice = Number(showTotalPrice.innerHTML);
  totalPrice += targetFoodItemObj.price;
  showTotalPrice.innerText = totalPrice;

  //Discout
  let discount = checkDealDiscount();
  if (discount !== 0) {
    console.log(discount);
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

  // adding/removing hidden class
  const classlistCheckoutContainer = document.getElementById(
    `order-checkout-container`
  ).classList;
  if (classlistCheckoutContainer.contains("hidden")) {
    classlistCheckoutContainer.toggle("hidden");
  }
}

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

  console.log("Pizza count - " + pizzaCount);
  console.log("Burger count - " + burgerCount);
  console.log("Beer count - " + beerCount);

  if (pizzaCount && burgerCount && beerCount) {
    let count = Math.min(pizzaCount, Math.min(burgerCount, beerCount));
    discount = count * 2;
  }

  if (discount !== 0) {
    return discount;
  } else {
    return 0;
  }
}

// function validateCard(value) {
//   // remove all non digit characters
//   var value = value.replace(/\D/g, '');
//   var sum = 0;
//   var shouldDouble = false;
//   // loop through values starting at the rightmost side
//   for (var i = value.length - 1; i >= 0; i--) {
//     var digit = parseInt(value.charAt(i));

//     if (shouldDouble) {
//       if ((digit *= 2) > 9) digit -= 9;
//     }

//     sum += digit;
//     shouldDouble = !shouldDouble;
//   }

//   var valid = (sum % 10) == 0;
//   var accepted = false;

//   // loop through the keys (visa, mastercard, amex, etc.)
//   Object.keys(acceptedCreditCards).forEach(function(key) {
//     var regex = acceptedCreditCards[key];
//     if (regex.test(value)) {
//       accepted = true;
//     }
//   });

//   return valid && accepted;
// }

document.getElementById("inner-container").innerHTML = menuHtml.join("");
