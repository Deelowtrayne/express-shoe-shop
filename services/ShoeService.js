const chalk = require('chalk');

const connection = process.env.DATABASE_URL || {
    host: '127.0.0.1',
    user: 'coder',
    password: 'coder123',
    database: 'shoe_api'
}
const knex = require('knex')({
    client: 'pg',
    version: '7.2',
    connection
})

module.exports = function(pool) {
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
            let results = await knex.select('*')
                .from('shoes')
                .where(params);
            // THEN CLOSE THE COONECTION
            knex.destroy()
                .then(() => {
                    console.log(chalk.bgGreen.white('DB CONNECTION CLOSED SUCCESSFULLY'));
                });
            
            return {
                status: 'success',
                items: results
            };
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
        results = await pool.query('select * from shoes \
            where brand=$1 and colour=$2 and size=$3',
            [shoe.brand, shoe.colour, shoe.size]
        );
        return results.rows[0];
    }

    return {
        addShoe,
        updateShoe,
        getShoes
    }
}