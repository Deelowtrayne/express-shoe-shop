const db_conx = require('./config/dbconnection');
const chalk = require('chalk');
const fs = require('fs');

module.exports = function () {

    const pool = db_conx();

   

    return {
        reset_db,
     
        
        end
    }
}