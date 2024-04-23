import { menuArray } from "/data.js";

const checkoutItems = document.getElementById("inner-checkout-container");
const showTotalPrice = document.getElementById("total-price");
let orderArray = [];
const completeBtn = document.getElementById("completeBtn");
const modal = document.getElementById("modal");
const cardForm = document.getElementById("card-form");
const thanksDiv = document.getElementById("thanks-div");

var acceptedCreditCards = {
  visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
  mastercard:
    /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
  amex: /^3[47][0-9]{13}$/,
  discover:
    /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
  diners_club: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
  jcb: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/,
};

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

  thanksDiv.innerHTML = `<p>Thanks, ${name}! Your order is on its way!</p>`;
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
  // console.log("index",foodItemId)

  // Setting show total price
  let totalPrice = Number(showTotalPrice.innerHTML);

  const targetFoodItemObj = orderArray.filter(function (foodItem, index) {
    return index === Number(foodItemId);
  })[0];

  console.log(targetFoodItemObj);

  totalPrice -= targetFoodItemObj.price;
  showTotalPrice.innerText = totalPrice;

  const modifiedFoodItemObj = orderArray.filter(
    (foodItem, i) => i !== Number(foodItemId)
  );
  orderArray = modifiedFoodItemObj;

  checkoutItems.innerHTML = getOrderHtml();

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

  // Setting show total price
  let totalPrice = Number(showTotalPrice.innerHTML);
  totalPrice += targetFoodItemObj.price;
  showTotalPrice.innerText = totalPrice;

  // adding/removing hidden class
  const classlistCheckoutContainer = document.getElementById(
    `order-checkout-container`
  ).classList;
  if (classlistCheckoutContainer.contains("hidden")) {
    classlistCheckoutContainer.toggle("hidden");
  }
}

function validateCard(value) {
  // remove all non digit characters
  var value = value.replace(/\D/g, "");
  var sum = 0;
  var shouldDouble = false;
  // loop through values starting at the rightmost side
  for (var i = value.length - 1; i >= 0; i--) {
    var digit = parseInt(value.charAt(i));

    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  var valid = sum % 10 == 0;
  var accepted = false;

  // loop through the keys (visa, mastercard, amex, etc.)
  Object.keys(acceptedCreditCards).forEach(function (key) {
    var regex = acceptedCreditCards[key];
    if (regex.test(value)) {
      accepted = true;
    }
  });

  return valid && accepted;
}

document.getElementById("inner-container").innerHTML = menuHtml.join("");
