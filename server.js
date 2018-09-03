"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const Connection = require('./config/dbconnection');
const ShoeService = require('./services/ShoeService');
const CartService = require('./services/CartService');

const app = express();
const PORT = process.env.PORT || 3000;

const knex = require('knex')({
    client: 'pg',
    version: '7.2',
    connection: process.env.DATABASE_URL || {
        host: '127.0.0.1',
        password: 'coder123',
        database: 'shoe_api'
    }
});

const pool = Connection();
const shoes = ShoeService(pool, knex);
const cart = CartService(pool);

// middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// gets all sheos
app.get('/api/shoes/all', async (req, res, next) => {
    res.json(await shoes.getShoes());
});
// gets filtered sheos
app.post('/api/shoes/filter', async (req, res, next) => {
    res.json(await shoes.getShoes(req.body));
});

// adds a shoe
app.post('/api/shoes/add', async (req, res, next) => {
    let shoe = req.body;
    console.log('sent shoe:', shoe);
    
    res.json(await shoes.addShoe(shoe));
});

// updates a shoe
app.post('/api/shoes/update/:id', async (req, res, next) => {
    let shoe = req.body;
    shoe.shoe_id = Number(req.params.id);

    res.json(await shoes.updateShoe(shoe));
});

// gets the cart
app.get('/api/cart/all', async (req, res, next) => {
    res.json(await cart.getCart());
});

// adds to the cart
app.post('/api/cart/add/:id', async (req, res, next) => {
    let shoe = req.body;
    shoe.shoe_id = Number(req.params.id);

    res.json(await cart.addToCart(shoe));
});

// clear the cart
app.get('/api/cart/clear', async (req, res, next) => {
    res.json(await cart.clearCart());
});

// checkout a cart?

app.listen(PORT, () => console.log('App running on port', PORT));