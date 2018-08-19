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
            
            price: 899.90,
            qty: 1
        };

        assert.equal(await shoeApi.updateShoe(shoe), 'update successful');
    });

    after(async () => await shoeApi.end());
});