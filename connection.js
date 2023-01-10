const mysql = require("mysql2");
require("dotenv").config();

if (process.env.NODE_ENV == "DEV") {
    const db = mysql.createConnection({
    host: "localhost",
        port: 3306,
        user: "root",
        password: "",
        database: "elscript_pos",
        multipleStatements: true,
    });
    module.exports = db;
} else {
    // for server
    const db = mysql.createConnection({
        host: "127.0.0.1",
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        multipleStatements: true,
    });
    module.exports = db;
}
