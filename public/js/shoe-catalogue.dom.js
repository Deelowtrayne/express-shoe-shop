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
var shoes = ShoeCatalogue();

function filterEvent() {
    let params = {};

    if (brandSelect.value !== '') {
        params.brand = brandSelect.value;
    }

    if (colourSelect.value !== '') {
        params.colour = colourSelect.value.toLowerCase();
    }

    if (sizeSelect.value !== '') {
        params.size = Number(sizeSelect.value);
    }
    let filteredShoes = shoes.filterBy(params)
        .then(res => {
            displayElem.innerHTML = SHOE_TEMPLATE({ shoeList: res })
        });
}

function toggleCart() {
    cartDisplay.classList.toggle('show');
}

function toggleAddNew() {
    shoeAdd.classList.toggle('show');
}

function toggleAlert(msg) {
    if (msg) {
        addAlert.innerHTML = msg;
    }
    addAlert.classList.toggle('show');

    setTimeout(() => addAlert.classList.toggle('show'), 5000);
}

function refreshCart() {
    shoes.cart()
        .then(cart => {
            cartWrapper.innerHTML = CART_TEMPLATE({
                cartItems: cart.data.items,
                total: cart.data.total
            })
        });
}

function refreshShoes() {
    shoes.map()
        .then(res => {
            displayElem.innerHTML = SHOE_TEMPLATE({
                shoeList: res.data.items
            })
        });
}

function searchString(elem) {
    let item = {
        id: elem.id,
        qty: 1
    }
    shoes.toCart(item).then(res => {
        refreshCart();
        refreshShoes();
        toggleAlert(res.data.message);
    })
}

function clearCart() {
    shoes.cancel()
        .then(res => {
            refreshShoes();
            refreshCart();
            toggleAlert(res.data.message);
        });
}

window.addEventListener('DOMContentLoaded', function () {
    refreshShoes();
    refreshCart();
})

btnAddItem.addEventListener('click', function () {
    let shoe = {
        brand: brandElem.value,
        colour: colourElem.value,
        size: sizeElem.value,
        price: priceElem.value,
        qty: qtyElem.value
    };
    shoes.new(shoe).then(res => {
        toggleAlert(res.data.message);
        refreshShoes();
        toggleAddNew();
    })

});

brandSelect.addEventListener('change', filterEvent);
colourSelect.addEventListener('change', filterEvent);
sizeSelect.addEventListener('change', filterEvent);
