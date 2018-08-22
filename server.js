const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ShoeApi = require('./shoe_api');

const app = express();
const shoeApi = ShoeApi();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// gets all sheos
app.get('/api/shoes/all', async (req, res, next) => {
    res.json(await shoeApi.getShoes());
});

// adds a shoe
app.post('/api/shoes/add', async (req, res, next) => {
    let shoe = req.body;
    res.json(await shoeApi.addShoe(shoe));
});

// updates a shoe
app.post('/api/shoes/update/:id', async (req, res, next) => {
    let shoe = req.body;
    shoe.shoe_id = Number(req.params.id);

    res.json(await shoeApi.updateShoe(shoe));
});

// gets the cart
app.get('/api/cart/all', async (req, res, next) => {
    res.json(await shoeApi.getCart());
});

// adds to the cart
app.post('/api/cart/add/:id', async (req, res, next) => {
    let shoe = req.body;
    shoe.shoe_id = Number(req.params.id);

    res.json(await shoeApi.addToCart(shoe));
});

// checkout a cart?

app.listen(PORT, () => console.log('App running on port', PORT));