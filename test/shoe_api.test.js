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

        assert.equal(await shoeApi.updateShoe(shoe), 'update successful');
    });
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

        assert.equal(await shoeApi.updateShoe(shoe), 'update successful');
    });

    it('Should return (\'unknown shoe\')', async () => {
        let shoe = {
            brand: 'Nike',
            colour: 'white',
            size: 7,
            price: 899.90,
            qty: 15
        };

        assert.equal(await shoeApi.updateShoe(shoe), 'unknown shoe');
    });

    after(async () => await shoeApi.end());
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

        assert.equal(await shoeApi.addToCart(shoe), 'added to cart');
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
        assert.equal(await shoeApi.addToCart(shoe), 'cart updated');
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
            [{
                id: 1,
                brand: 'Adidas',
                colour: 'white',
                size: 7,
                price: 'R799.90',
                qty: 12
            }]
        );
    });
});