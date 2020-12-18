const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb');
const endpoints = require(__dirname + "/endpoints.js");


const app = express();
const port = 3000;
const url = 'mongodb://localhost:27017';
const dbname = 'pwl-mean';
let db;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.get('/', (req, res) => {
    res.send("Listening to promises~")
})

MongoClient.connect(url, (err, client) => {
    if (err) return console.log(`MongoDB error: ${err}`);
    console.log("Successfully connected to server");
    db = client.db(dbname)
    endpoints(app,db)
})

app.use(express.static("image"))
app.use('/image', express.static("image"));
app.listen(port, () => { console.log("Aplikasi berjalan di port", port) });