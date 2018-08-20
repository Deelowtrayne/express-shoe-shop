
// Buttons
var shoeAdd = document.querySelector('.add-shoe');
var btnBuy = document.querySelector('.buy-btn');
var btnAddItem = document.querySelector('.add-button');
var btnAddSection = document.querySelector('.open-add-section');
var cartBtn = document.querySelector('.cart-btn');
var cartDisplay = document.querySelector('.cart-container');
var cartClose = document.querySelector('.cart-close');

// New shoe inputs
var brandElem = document.querySelector('.shoe-brand');
var colourElem = document.querySelector('.shoe-colour');
var sizeElem = document.querySelector('.shoe-size');
var priceElem = document.querySelector('.shoe-price');
var qtyElem = document.querySelector('.shoe-qty');

// selects / filter
var brandSelect = document.querySelector('.brand-select');
var colourSelect = document.querySelector('.colour-select');
var sizeSelect = document.querySelector('.size-select');

// template setup
let shoeTemplate = document.querySelector('.shoes-template').innerHTML;
let cartTemplate = document.querySelector('.cart-template').innerHTML;
const SHOE_TEMPLATE = Handlebars.compile(shoeTemplate);
const CART_TEMPLATE = Handlebars.compile(cartTemplate);

var displayElem = document.querySelector('.list-display');
var cartWrapper = document.querySelector('.cart-wrapper');
var addAlert = document.querySelector('.alert');


// factory function instance
var shoes = ShoeCatalogue(storedShoes, storedCart);

function filterEvent() {
    let params = {};

    if (brandSelect.value !== '') {
        params.brand = brandSelect.value;
    }

    if (colourSelect.value !== '') {    
        params.colour = colourSelect.value;
    }

    if (sizeSelect.value !== '') {
        params.size = sizeSelect.value;
    }
    let filteredShoes = shoes.filterBy(params);
    displayElem.innerHTML = SHOE_TEMPLATE({shoeList:filteredShoes});
}

function toggleCart() {
    cartDisplay.classList.toggle('show');
}

function toggleAddNew(){
    shoeAdd.classList.toggle('show');
}

function toggleAlert() {
    addAlert.classList.toggle('show');
}

function updateCartDisplay() {
    cartWrapper.innerHTML = CART_TEMPLATE({
        cartItems: shoes.cart(),
        total: shoes.cartTotal()
    });
}

function searchString(elem) {
    if (shoes.toCart(elem.id)) {
        updateCartDisplay();
        // force reload to update
        location.reload();
        return;
    }
    elem.disabled = true;
}

function clearCart() {
    shoes.cancel();
    // force reload to update
    location.reload();
}

window.addEventListener('DOMContentLoaded', function(){
    displayElem.innerHTML = SHOE_TEMPLATE({shoeList:shoes.map()});
    cartWrapper.innerHTML = CART_TEMPLATE({
        cartItems: shoes.cart(),
        total: shoes.cartTotal()
    });
})

btnAddItem.addEventListener('click', function() {
    shoes.new({
        brand:  brandElem.value,
        colour: colourElem.value,
        size:   sizeElem.value,
        price:  priceElem.value,
        qty:    qtyElem.value
    });
    toggleAlert();
    toggleAddNew();
});

brandSelect.addEventListener('change', filterEvent);
colourSelect.addEventListener('change', filterEvent); 
sizeSelect.addEventListener('change', filterEvent);
