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



app.post('/api/shoes/add', async (req, res, next) => {
    let shoe = req.body;

    res.json({
        status: await shoeApi.addShoe(shoe)
    });
});

app.post('/api/shoes/update/:id', async (req, res, next) => {
    let shoe = req.body;
    shoe.shoe_id = req.params.id;
    res.json({
        status: await shoeApi.addShoe(shoe)
    });
});

app.get('/api/shoes/all', async (req, res, next) => {
    res.json({
        data: await shoeApi.getShoes()
    });
});


app.listen(PORT, () => {
    console.log('App running on port', PORT)
});