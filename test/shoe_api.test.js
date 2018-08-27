'use strict';
// DEPENDANCY IMPORTS
const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');

const knex = require('knex')({
    client: 'pg',
    version: '7.2',
    connection: process.env.DATABASE_URL || {
        host: '127.0.0.1',
        password: 'coder123',
        database: 'shoe_api'
    }
});
// MODULE IMPORTS
const Connection = require('../config/dbconnection');
const ShoeService = require('../services/ShoeService');
const CartService = require('../services/CartService');

// INSTANCES
const pool = Connection();
const shoes = ShoeService(pool, knex);
const cart = CartService(pool);

/* ------------------------------------------------------------------------- 
    TESTS START HERE...
   ------------------------------------------------------------------------- */
describe('tests the add shoe function', () => {
    
    beforeEach(async () => await reset_db());

    it('Should return (\'no shoe provided\')', async () => {
        assert.deepEqual(await shoes.addShoe(), 
            { status: 'error', message: 'no shoe provided' }
        );
    });

    it('Should return (\'shoe added successfully\')', async () => {
        let shoe = {
            brand: 'Adidas',
            colour: 'White',
            size: 7,
            price: 799.90,
            qty: 12
        }
        assert.deepEqual(await shoes.addShoe(shoe), { status: 'success', message: 'shoe added successfully' });
    });

    it('Should return (\'shoe already exists\')', async () => {
        let shoe = {
            brand: 'Adidas',
            colour: 'White',
            size: 7,
            price: 799.90,
            qty: 12
        }
        await shoes.addShoe(shoe);
        assert.deepEqual(await shoes.addShoe(shoe), 
            { status: 'error', message: 'shoe already exists' }
        );
    });
});

describe('tests the update shoe function', () => {
    
    beforeEach(async () => await reset_db());

    it('Should return (\'shoe updated successfully\')', async () => {
        // add shoe first
        await shoes.addShoe({
            brand: 'Adidas',
            colour: 'White',
            size: 7,
            price: 799.90,
            qty: 12
        });

        let shoe = {
            brand: 'Adidas',
            colour: 'White',
            size: 7,
            price: 899.90,
            qty: 15
        };

        assert.deepEqual(await shoes.updateShoe(shoe),
            { status: 'success', message: 'update successful' }
        );
    });

    it('Should return (\'unknown shoe\')', async () => {
        let shoe = {
            brand: 'Nike',
            colour: 'White',
            size: 7,
            price: 899.90,
            qty: 15
        };

        assert.deepEqual(await shoes.updateShoe(shoe),
            { status: 'error', error: 'unknown shoe' }
        );
    });

    
});

describe('tests the get shoes function', () => {

    beforeEach(async () => await reset_db());

    it('Should return all stored shoes', async () => {
        // add shoe first
        await shoes.addShoe({
            brand: 'Adidas',
            colour: 'White',
            size: 7,
            price: 799.90,
            qty: 12
        });

        assert.deepEqual(await shoes.getShoes(),
            {
                status: 'success',
                items: [{
                    id: 1,
                    brand: 'Adidas',
                    colour: 'White',
                    size: 7,
                    price: '799.90',
                    qty: 12
                }]
            }
        );
    });

    
});

describe('tests the add to cart function', () => {

    beforeEach(async () => await reset_db());

    it('Should return (\'shoe added to cart\')', async () => {
        // add shoe first
        await shoes.addShoe({
            brand: 'Adidas',
            colour: 'White',
            size: 7,
            price: 799.90,
            qty: 12
        });

        let shoe = {
            shoe_id: 1,
            qty: 4
        };

        assert.deepEqual(await cart.addToCart(shoe),
            { status: 'success', message: 'added to cart' }
        );
    });

    it('Should return (\'cart updated\')', async () => {
        // add shoe first
        await shoes.addShoe({
            brand: 'Adidas',
            colour: 'White',
            size: 7,
            price: 799.90,
            qty: 12
        });

        await cart.addToCart({
            shoe_id: 1,
            qty: 2
        });

        let shoe = {
            shoe_id: 1,
            qty: 4
        };
        assert.deepEqual(await cart.addToCart(shoe),
            { status: 'success', message: 'cart updated' }
        );
    });

    
});

describe('tests the get cart function', () => {
    

    beforeEach(async () => {
        await reset_db()
    });

    it('Should return an empty array and 0 for total', async () => {
        assert.deepEqual(await cart.getCart(), { total: 0, items: [] });
    });

    it('Should return cart items', async () => {
        // add shoe 1
        await shoes.addShoe({
            brand: 'Adidas',
            colour: 'White',
            size: 7,
            price: 799.90,
            qty: 12
        });
        // add shoe 2
        await shoes.addShoe({
            brand: 'Nike',
            colour: 'White',
            size: 7,
            price: 799.90,
            qty: 12
        });
        // add to cart
        await cart.addToCart({
            shoe_id: 1,
            qty: 4
        });
        await cart.addToCart({
            shoe_id: 2,
            qty: 4
        });
        // get cart
        assert.deepEqual(await cart.getCart(),
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
});

describe('tests the shoe filter functionality', async () => {

    beforeEach(async () => {
        await reset_db();
    });

    it('Should return one matching shoe', async () => {
        // add shoe 1
        await shoes.addShoe({
            brand: 'Adidas',
            colour: 'White',
            size: 7,
            price: 799.90,
            qty: 12
        });
        // add shoe 2
        await shoes.addShoe({
            brand: 'Nike',
            colour: 'White',
            size: 7,
            price: 799.90,
            qty: 12
        });
        assert.deepEqual(await shoes.getShoes({brand: 'Adidas', colour: 'White'}),
            {
                status: 'success',
                items: [{
                    id: 1,
                    brand: 'Adidas',
                    colour: 'White',
                    size: 7,
                    price: 799.9,
                    qty: 12
                }]
            }
        );
    });

    after(async () => {
        await knex.destroy();
        await pool.end();
    }); 
});

//========================================================================

// beforeEach handler
async function reset_db() {
    try {
        let sql = fs.readFileSync('./shoe_api.sql').toString();
        await pool.query(sql);
        console.log(
            chalk.bgGreen.white('DB RESET SUCCESSFUL')
        );
    } catch (err) {
        console.log(
            chalk.bgRed.white('RESET ERROR'), err);
    }
}
