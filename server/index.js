//import packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const dbURL = process.env.DB_URL;

//Database connect
mongoose
    .connect(dbURL)
    .then(() => {
        console.log('Connection successful');
    })
    .catch((e) => {
        console.log(e);
    });

// import all files
const authRouter = require('./routes/auth');

//Init
const PORT = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//middleware
app.use(express.json());
app.use(authRouter);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Connect at port ${PORT}`);
});
