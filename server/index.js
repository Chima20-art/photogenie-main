//import packages
const express =require ('express');
const mongoose= require('mongoose');
require('dotenv').config();

// import all files
const authRouter= require("./routes/auth");

//Init
const PORT=3000;
const app =express();
const dbURL =process.env.DB_URL;

//middleware 
app.use(express.json());
app.use(authRouter);

//Database connect
mongoose.connect(dbURL).then(()=>{
    console.log('Connection successful');
}).catch(e=>{
    console.log(e);
});

app.listen(PORT,"0.0.0.0", ()=>{
    console.log(`Connect at port ${PORT}`);
});