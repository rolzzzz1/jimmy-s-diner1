import { menuArray } from '/data.js'

const checkoutItems = document.getElementById('inner-checkout-container')
const showTotalPrice = document.getElementById('total-price')
let orderArray = []

const menuHtml = menuArray.map(function(foodItem) {
return `<section>
            <div class="food-item">
                <div class="food-item-inner">
                    <div class="food-item-info">
                        <div class="food-item-img">
                            <p>${foodItem.emoji}</p>
                        </div>
                        <div class="food-item-text">
                            <p class="size28">${foodItem.name}</p>
                            <p class="size16 descColor">${foodItem.ingredients.join(', ')}</p>
                            <p class="size20">$${foodItem.price}</p>
                        </div>
                    </div>
                    <div class="addBtnDiv">
                        <button class="addBtn inter-extra-light" data-add="${foodItem.id}">+</button>
                    </div>
                </div>
            </div>
        </section>
`
})

document.addEventListener('click', function(e) {
    if(e.target.dataset.add){
        handleAddClick(e.target.dataset.add)
    } else if(e.target.dataset.remove){
        handleRemoveClick(e.target.dataset.remove)
    }
})

function getOrderHtml() {
    let orderHtml = ''
    orderArray.forEach(function(order, index) {
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
                    `
    })
    
    return orderHtml
}

function handleRemoveClick(foodItemId) {
    
        // console.log("index",foodItemId)
        
        // Setting show total price
        let totalPrice = Number(showTotalPrice.innerHTML)   
        
        const targetFoodItemObj = orderArray.filter(function(foodItem, index){
            return index === Number(foodItemId)
        })[0]
        
        console.log(targetFoodItemObj)
                     
        totalPrice -= targetFoodItemObj.price
        showTotalPrice.innerText = totalPrice
        
        const modifiedFoodItemObj = orderArray.filter((foodItem, i) => i !== Number(foodItemId))
        orderArray =  modifiedFoodItemObj

        checkoutItems.innerHTML = getOrderHtml()
        
        const classlistCheckoutContainer = document.getElementById(`order-checkout-container`).classList
        if(orderArray.length === 0){
            classlistCheckoutContainer.toggle('hidden')
        }

}

function handleAddClick(foodItemId) {
    
        const targetFoodItemObj = menuArray.filter(function(foodItem){
            return foodItem.id === Number(foodItemId)
        })[0]
        
        orderArray.push(targetFoodItemObj)

        checkoutItems.innerHTML = getOrderHtml()
                      
        // Setting show total price
        let totalPrice = Number(showTotalPrice.innerHTML)                
        totalPrice += targetFoodItemObj.price
        showTotalPrice.innerText = totalPrice

        // adding/removing hidden class
        const classlistCheckoutContainer = document.getElementById(`order-checkout-container`).classList
        if(classlistCheckoutContainer.contains('hidden')){
            classlistCheckoutContainer.toggle('hidden')
        }
}



document.getElementById('inner-container').innerHTML = menuHtml.join('')