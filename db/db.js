const mysql = require("mysql2")

const mySqlPool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,      // Set a reasonable connection limit
    queueLimit: 0   
})


module.exports = mySqlPool.promise();