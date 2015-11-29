var mysql = require('mysql');
var config = require('../config');

var pool = mysql.createPool({

    host: config.mysql_host,
    port: config.mysql_port,
    database: config.mysql_db,
    user: config.mysql_user,
    password: config.mysql_pw,
    dateStrings: true
});

module.exports = pool;
 


