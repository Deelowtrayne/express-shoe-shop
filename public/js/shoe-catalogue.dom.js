// buttons
const shoeAdd = document.querySelector('.add-shoe');
const btnBuy = document.querySelector('.buy-btn');
const btnAddItem = document.querySelector('.add-button');
const btnAddSection = document.querySelector('.open-add-section');
const cartBtn = document.querySelector('.cart-btn');
const cartDisplay = document.querySelector('.cart-container');
const cartClose = document.querySelector('.cart-close');
// new shoe inputs
const brandElem = document.querySelector('.shoe-brand');
const colourElem = document.querySelector('.shoe-colour');
const sizeElem = document.querySelector('.shoe-size');
const priceElem = document.querySelector('.shoe-price');
const qtyElem = document.querySelector('.shoe-qty');
// selects / filter
const brandSelect = document.querySelector('.brand-select');
const colourSelect = document.querySelector('.colour-select');
const sizeSelect = document.querySelector('.size-select');
// template setup
let shoeTemplate = document.querySelector('.shoes-template').innerHTML;
let cartTemplate = document.querySelector('.cart-template').innerHTML;
const SHOE_TEMPLATE = Handlebars.compile(shoeTemplate);
const CART_TEMPLATE = Handlebars.compile(cartTemplate);
// display elements
const displayElem = document.querySelector('.list-display');
const cartWrapper = document.querySelector('.cart-wrapper');
const addAlert = document.querySelector('.alert');

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

    shoes.filterBy(params)
        .then(res => {
            displayElem.innerHTML = SHOE_TEMPLATE({
                shoeList: res.data.items
            })
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
        size: Number(sizeElem.value),
        price: parseFloat(priceElem.value),
        qty: Number(qtyElem.value)
    };
    shoes.new(shoe).then(res => {
        if (res.data.status === 'success') {
            refreshShoes();
            toggleAddNew();
        }
        toggleAlert(res.data.message);
    })
});

brandSelect.addEventListener('change', filterEvent);
colourSelect.addEventListener('change', filterEvent);
sizeSelect.addEventListener('change', filterEvent);
