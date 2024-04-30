const express = require('express')
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors")
require("dotenv/config");


app.use(cors());
app.options('*', cors())


//middleware 
app.use(bodyParser.json());

//Routes
const categoryRoutes = require('./routes/category')

app.get("/", (req, res) => {
    res.send("wellcom to dhaka")
})
//middleware
app.use(`/api/category`, categoryRoutes)
//Database
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Database Connection Is Ready...');
        //server
        app.listen(process.env.PORT, () => {
            console.log(`server is running http://localhost:${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log((err));
    })
