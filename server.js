'use strict';
// REQUIRE
require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cors = require('cors');

// // bring in mongoose
// const mongoose = require('mongoose');

// // must bring in a schema is we want to interact with that model
// // const Cat = require('./models/cat.js');

// // add validation to confirm we are wired up to our mongo DB
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//   console.log('Mongoose is connected');
// });

// // connect Mongoose to our MongoDB
// mongoose.connect(process.env.DB_URL);


// USE
// implement express
const app = express();

// middleware
app.use(cors());
// MUST have this to recieve json data from a request:
app.use(express.json());

// define PORT validate env is working
const PORT = process.env.PORT || 3002;

//Routes
//https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2020-06-01/2020-06-17?apiKey=7jGvZZJtouoVO1edP1pCYWSq4nwjZoDD

///v2/aggs/ticker/{stocksTicker}/range/{multiplier}/{timespan}/{from}/{to}

app.get('/stocks', getStocks);

async function getStocks(req, res, next){
  try{
    let timeNow = Date.now();
    const {chosenTicker} = req.query;
    let url = `https://api.polygon.io/v2/aggs/ticker/${chosenTicker}/range/1/hour/2022-11-30/2022-12-01?apiKey=7jGvZZJtouoVO1edP1pCYWSq4nwjZoDD`;
    console.log(url);
    let results = await axios.get(url);
    res.send(results.data);
  }catch(err){
    next(err);
  }
};

app.get('*', (request, response) => {
  response.status(404).send('Not availabe');
});


// ERROR
app.use((error, req, res, next) => {
  res.status(500).send(error.message);
});

// LISTEN
app.listen(PORT, () => console.log(`listening on Port ${PORT}`));
