const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require("cookie-parser");
const path = require('path')
require('dotenv').config();

const app = express();

// Middleware

app.use(express.json())
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }))



// Making public file available to the server
app.use(express.static(path.resolve('./public')));


app.use(cors({
    credentials: true,
    origin: [`${process.env.FRONT_URL}`, `${process.env.ADMIN_URL}`, 'http://localhost:3000']
    // origin:'*'
}));


// Handling Errors
app.use((err, req, res, next) => {
    // console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        message: err.message,
    });
});


// Running server
app.listen(process.env.PORT, () => {
    console.log("Server is running on "+process.env.PORT)
})
const authentication = require('./routes/authentication')
app.use(authentication)
