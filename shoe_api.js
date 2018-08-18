const db_conx = require('./config/dbconnection');
const chalk = require('chalk');
const fs = require('fs');

module.exports = function() {

    const pool = db_conx();

    async function reset_db() {
        try {
            let sql = fs.readFileSync('./config/database_setup.sql').toString();
            await pool.query(sql);
            console.log(
                chalk.bgGreen.white('DB RESET SUCCESSFUL')
            );
            // console.log(
            //     chalk.bgGreen.white(sql)
            // );
        } catch (err) {
            console.log(
                chalk.bgRed.white('RESET ERROR'), err);
        }
    }

    async function addShoe(shoe) {
        if (!shoe) {
            return 'no shoe provided';
        }

        try {
            var found = await pool.query('select id from shoes where brand=$1 and colour=$2 and size=$3',
                [shoe.brand, shoe.colour, shoe.size]
            );

            if (found.rowCount > 0) {
                console.log(chalk.bgOrange.white('shoe already exists'));
                return 'shoe already exists';
            }
            await pool.query('insert into shoes (brand, colour, size, price, qty) values ($1, $2, $3, $4, $5)',
                [shoe.brand, shoe.colour, shoe.size, shoe.price, shoe.qty]        
            );

        } catch (err) {
            console.log(chalk.bgOrange.white(err));
            return 'could not process the request';
        }
    }
    

    return {
        reset_db,
        addShoe
    }
}