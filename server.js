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
    const { data, status, message } = await shoeApi.getShoes();
    res.json({ data, status, message });
});

// adds a shoe
app.post('/api/shoes/add', async (req, res, next) => {
    console.log(req.body);
    
    let shoe = req.body;
    const result = await shoeApi.addShoe(shoe);
    res.json(result);
});

// updates a shoe
app.post('/api/shoes/update/:id', async (req, res, next) => {
    let shoe = {
        qty: req.body.qty,
        shoe_id : Number(req.params.id)
    };

    res.json({
        status: await shoeApi.updateShoe(shoe)
    });
});

// gets the cart
app.get('/api/cart/all', async (req, res, next) => {
    let shoe = req.body;
    shoe.shoe_id = req.params.id;
    
    res.json(await shoeApi.getCart());
});

// adds to the cart
app.post('/api/cart/add/:id', async (req, res, next) => {
    let shoe = req.body;
    shoe.shoe_id = req.params.id;
    
    res.json(await shoeApi.addToCart(shoe));
});

// checkout a cart?

app.listen(PORT, () => {
    console.log('App running on port', PORT)
});