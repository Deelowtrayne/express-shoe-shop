module.exports = function (pool){

    async function findShoeById(shoe) {
        let results = {};
        if (shoe.shoe_id) {
            results = await pool.query('select * from shoes where id=$1', [shoe.shoe_id]);
            return results.rows[0];
        }
    }

    async function addToCart(shoe) {
        // find in shoes
        const found = await findShoeById(shoe);
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

    return {
        addToCart,
        getCart,
        clearCart
    }
}