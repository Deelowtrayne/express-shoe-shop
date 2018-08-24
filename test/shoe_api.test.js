'use strict';
const assert = require('assert');
const ShoeApi = require('../shoe_api');

describe('tests the add shoe function', () => {
    let shoeApi = ShoeApi();

    beforeEach(async () => await shoeApi.reset_db());

    it('Should return (\'no shoe provided\')', async () => {
        assert.equal(await shoeApi.addShoe(), 'no shoe provided');
    });

    it('Should return (\'shoe added successfully\')', async () => {
        let shoe = {
            brand: 'Adidas',
            colour: 'white',
            size: 7,
            price: 799.90,
            qty: 12
        }
        assert.equal(await shoeApi.addShoe(shoe), 'shoe added successfully');
    });

    it('Should return (\'shoe already exists\')', async () => {
        let shoe = {
            brand: 'Adidas',
            colour: 'white',
            size: 7,
            price: 799.90,
            qty: 12
        }
        await shoeApi.addShoe(shoe);
        assert.equal(await shoeApi.addShoe(shoe), 'shoe already exists');
    });

    after(async () => await shoeApi.end());
});

describe('tests the update shoe function', () => {
    let shoeApi = ShoeApi();

    beforeEach(async () => await shoeApi.reset_db());

    it('Should return (\'shoe updated successfully\')', async () => {
        // add shoe first
        await shoeApi.addShoe({
            brand: 'Adidas',
            colour: 'white',
            size: 7,
            price: 799.90,
            qty: 12
        });

        let shoe = {
            brand: 'Adidas',
            colour: 'white',
            size: 7,
            price: 899.90,
            qty: 15
        };

        assert.deepEqual(await shoeApi.updateShoe(shoe),
            { status: 'success', message: 'update successful' }
        );
    });

    it('Should return (\'unknown shoe\')', async () => {
        let shoe = {
            brand: 'Nike',
            colour: 'white',
            size: 7,
            price: 899.90,
            qty: 15
        };

        assert.deepEqual(await shoeApi.updateShoe(shoe),
            { status: 'error', error: 'unknown shoe' }
        );
    });

    after(async () => await shoeApi.end());
});

describe('tests the get shoes function', () => {
    let shoeApi = ShoeApi();

    beforeEach(async () => await shoeApi.reset_db());

    it('Should return all stored shoes', async () => {
        // add shoe first
        await shoeApi.addShoe({
            brand: 'Adidas',
            colour: 'white',
            size: 7,
            price: 799.90,
            qty: 12
        });

        assert.deepEqual(await shoeApi.getShoes(),
            {
                status: 'success',
                items: [{
                    id: 1,
                    brand: 'Adidas',
                    colour: 'white',
                    size: 7,
                    price: '799.90',
                    qty: 12
                }]
            }
        );
    });
});

describe('tests the add to cart function', () => {
    let shoeApi = ShoeApi();

    beforeEach(async () => await shoeApi.reset_db());

    it('Should return (\'shoe added to cart\')', async () => {
        // add shoe first
        await shoeApi.addShoe({
            brand: 'Adidas',
            colour: 'white',
            size: 7,
            price: 799.90,
            qty: 12
        });

        let shoe = {
            shoe_id: 1,
            qty: 4
        };

        assert.deepEqual(await shoeApi.addToCart(shoe),
            { status: 'success', message: 'added to cart' }
        );
    });

    it('Should return (\'cart updated\')', async () => {
        // add shoe first
        await shoeApi.addShoe({
            brand: 'Adidas',
            colour: 'white',
            size: 7,
            price: 799.90,
            qty: 12
        });

        await shoeApi.addToCart({
            shoe_id: 1,
            qty: 2
        });

        let shoe = {
            shoe_id: 1,
            qty: 4
        };
        assert.deepEqual(await shoeApi.addToCart(shoe),
            { status: 'success', message: 'cart updated' }
        );
    });

    after(async () => await shoeApi.end());
});

describe('tests the get cart function', () => {
    let shoeApi = ShoeApi();

    beforeEach(async () => await shoeApi.reset_db());

    it('Should return an empty array and 0 for total', async () => {
        assert.deepEqual(await shoeApi.getCart(), { total: 0, items: [] });
    });

    it('Should return cart items', async () => {
        // add shoe 1
        await shoeApi.addShoe({
            brand: 'Adidas',
            colour: 'white',
            size: 7,
            price: 799.90,
            qty: 12
        });
        // add shoe 2
        await shoeApi.addShoe({
            brand: 'Nike',
            colour: 'white',
            size: 7,
            price: 799.90,
            qty: 12
        });
        // add to cart
        await shoeApi.addToCart({
            shoe_id: 1,
            qty: 4
        });
        await shoeApi.addToCart({
            shoe_id: 2,
            qty: 4
        });
        // get cart
        assert.deepEqual(await shoeApi.getCart(),
            {
                total: 6399.2,
                items: [
                    {
                        shoe_id: 1,
                        brand: 'Adidas',
                        size: 7,
                        qty: 4,
                        subtotal: 3199.6
                    },
                    {
                        brand: "Nike",
                        qty: 4,
                        shoe_id: 2,
                        size: 7,
                        subtotal: 3199.6
                    }
                ]
            }
        );
    });

    after(async () => await shoeApi.end());
});

describe('tests the shoe filter functionality', async () => {
    let shoeApi = ShoeApi();

    beforeEach(async () => await shoeApi.reset_db());

    it('Should return one matching shoe', async () => {
        // add shoe 1
        await shoeApi.addShoe({
            brand: 'Adidas',
            colour: 'white',
            size: 7,
            price: 799.90,
            qty: 12
        });
        // add shoe 2
        await shoeApi.addShoe({
            brand: 'Nike',
            colour: 'white',
            size: 7,
            price: 799.90,
            qty: 12
        });
        assert.deepEqual(await shoeApi.getShoes({brand: 'Adidas', colour: 'white'}),
            {
                status: 'success',
                items: [{
                    id: 1,
                    brand: 'Adidas',
                    colour: 'white',
                    size: 7,
                    price: 799.9,
                    qty: 12
                }]
            }
        );
    });

    after(async () => await shoeApi.end());
});