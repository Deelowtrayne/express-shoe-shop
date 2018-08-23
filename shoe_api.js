const db_conx = require('./config/dbconnection');
const chalk = require('chalk');
const fs = require('fs');

const knex = require('knex')({
    client: 'pg',
    version: '7.2',
    connection: {
        host: '127.0.0.1',
        user: 'coder',
        password: 'coder123',
        database: 'shoe_api'
    }
});

module.exports = function () {

    const pool = db_conx();

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
    // SHOE VALIDATION
    // function isShoe(shoe) {
    //     if (Object.values(shoe).includes(undefined) || Object.entries(shoe).length < 5) {
    //         return false;
    //     } 
    //     return true;
    // }

    async function addShoe(shoe) {
        if (!shoe) {
            console.log(chalk.bgRed.white('no shoe provided'));
            return 'no shoe provided';
        }

        var found = await findShoe(shoe);
        if (found) {
            console.log(chalk.bgRed.white('shoe already exists'));
            return 'shoe already exists';
        }

        try {
            await pool.query('insert into shoes (brand, colour, size, price, qty) \
                values ($1, $2, $3, $4, $5)',
                [shoe.brand, shoe.colour, shoe.size, shoe.price, shoe.qty]
            );
            console.log(chalk.bgGreen.white('shoe added successfully'));
            return 'shoe added successfully';
        } catch (err) {
            console.log(chalk.bgRed.white(err));
            return 'could not process the request';
        }
    }

    async function updateShoe(shoe) {
        var found = await findShoe(shoe);
        if (!found) {
            return {
                status: 'error',
                error: 'unknown shoe'
            };
        }

        try {
            await pool.query('update shoes set brand=$1, colour=$2, \
                size=$3, price=$4, qty=$5 where id=$6',
                [shoe.brand, shoe.colour, shoe.size, shoe.price, shoe.qty, found.id]
            )
            console.log(chalk.bgGreen.white('update successful'))
            return {
                status: 'success',
                message: 'update successful'
            }
        }
        catch (err) {
            return {
                status: 'error',
                error: err.stack
            }
        }
    }

    async function getShoes(params) {
        if (params) {
            await knex.select('*').from('users').where({
                params
            })
        }

        try {
            const result = await pool.query('select * from shoes order by brand');
            return {
                status: 'success',
                items: result.rows
            };
        } catch (err) {
            return {
                status: 'error',
                error: err.stack
            }
        }
    }

    async function findShoe(shoe) {
        var results = {};

        if (shoe.shoe_id) {
            results = await pool.query('select * from shoes where id=$1', [shoe.shoe_id]);
            console.log(chalk.bgBlue.white(results));
            return results.rows[0];
        }

        results = await pool.query('select * from shoes \
            where brand=$1 and colour=$2 and size=$3',
            [shoe.brand, shoe.colour, shoe.size]
        );
        return results.rows[0];
    }

    async function addToCart(shoe) {
        // find in shoes
        const found = await findShoe(shoe);
        console.log(chalk.bgBlue.white(found));
        // clean-up crew
        if (!found) {
            return {
                status: 'error',
                message: 'unknown shoe'
            };
        }
        if (found.qty < 1) {
            return {
                status: 'error',
                message: 'out of stock'
            };
        }
        if ((found.qty - shoe.qty) < 0) {
            return {
                status: 'error',
                message: `there are only ${found.qty} shoes left in stock`
            };
        }

        try {
            // find in cart
            let cartMatch = await pool.query('select * from cart where shoe_id=$1',
                [found.id]
            );
            // reformat price
            let shoePrice = found.price;
            if (cartMatch.rowCount < 1) {
                // add to cart
                await pool.query('insert into cart (shoe_id, qty, subtotal) \
                    values ($1, $2, $3)',
                    [shoe.shoe_id, shoe.qty, (shoePrice * shoe.qty)]
                );
                // update shoes - deduct the quantity
                await pool.query('update shoes set qty=qty-$1 where id=$2',
                    [shoe.qty, shoe.shoe_id]
                );
                return {
                    status: 'success',
                    message: 'added to cart'
                };
            }
            // update entry
            await pool.query('update cart set qty=qty+$1, subtotal=subtotal+$2 where id=$3',
                [shoe.qty, (shoePrice * shoe.qty), cartMatch.rows[0].id]
            );
            // update shoes - deduct the quantity
            await pool.query('update shoes set qty=qty-$1 where id=$2',
                [shoe.qty, found.id]
            );
            return {
                status: 'success',
                message: 'cart updated'
            };

        } catch (err) {
            return {
                status: 'error',
                error: err.stack
            }
        }
    }

    async function getCart() {
        let cart = {
            total: 0,
            items: []
        };

        const cartItems = await pool.query('select * from cart');
        if (cartItems.rowCount > 0) {
            // calculate the sum of cart items
            cart.total = cartItems.rows.reduce((total, current) => {
                return total + parseFloat(current.subtotal);
            }, 0);
            cart.total = (cart.total).toFixed(2);
            // get shoe info
            let items = await pool.query('select shoe_id, brand, size, cart.qty, subtotal \
                from cart join shoes on cart.shoe_id=shoes.id'
            );
            cart.items = items.rows;
        }
        return cart;
    }
    async function clearCart() {
        let found = await pool.query('select * from cart');

        let qtyReplacePromises = found.rows.map(item => {
            return pool.query('update shoes set qty=qty+$1 where id=$2',
                [item.qty, item.shoe_id]
            );
        });
        await Promise.all(qtyReplacePromises);
        await pool.query('delete from cart');

        return {
            status: 'success',
            message: 'cart cleared'
        }
    }

    async function end() {
        await pool.end();
    }

    return {
        reset_db,
        addShoe,
        updateShoe,
        getShoes,
        addToCart,
        getCart,
        clearCart,
        end
    }
}