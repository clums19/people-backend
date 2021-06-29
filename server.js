// ---Dependencies---

// Get .env variables and give a default of 5000
require("dotenv").config();

// this is a form a destructuring
const {PORT = 5000, MONGODB_URL} = process.env;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const { response } = require("express");

// ---Database Connection---
// establish connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
// conection events
mongoose.connection
    .on("open", () => console.log("You are connected to mongoose"))
    .on("close", () => console.log("You are disconnected from mongoose"))
    .on("error", (error) => console.log(error));

// ---Models---
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
})
const People = mongoose.model('People', PeopleSchema);

// ---Middleware---
app.use(cors()); //prevents cors errors, open access to all origins
// you can pass specific domains to cors but () does for all
app.use(morgan('dev')); // logging
app.use(express.json()); // parse json bodies(send json)


// ---Routes---
app.get('/', (req, res) => {
    res.send('Hello World')
})
// People Index
app.get('/people', async(req, res) => {
    try {
        // send all people
        res.json(await People.find({}));
    } catch (error) {
        // send error
        res.status(400).json(error);
    }
});
// People Delete
app.delete('/people/:id', async(req, res) => {
    try {
        res.json(await People.findByIdAndRemove(req.params.id));
    } catch (error) {
        res.status(400).json(error);
    }
});
// People Update
app.put('/people/:id', async (req, res) => {
    try {
        res.json(
            await People.findByIdAndUpdate(req.params.id, req.body, {new:true}));
    } catch (error) {
        res.status(400).json(error);
    }
})
// People Create
app.post('/people', async (req, res) => {
    try {
        res.json(await People.create(req.body));
    } catch (error) {
        res.status(400).json(error);
    }
});

// ---Listener---
app.listen(PORT, () => console.log(`listening on port: ${PORT}`));