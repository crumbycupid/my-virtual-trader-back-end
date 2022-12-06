'use strict';
// REQUIRE
require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const verifyUser = require('./auth.js');
const mongoose = require('mongoose');


// // must bring in a schema is we want to interact with that model
const User = require('./models/User.js');

// // add validation to confirm we are wired up to our mongo DB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected');
});

// // // connect Mongoose to our MongoDB
mongoose.connect(process.env.DB_URL);


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
///v2/aggs/ticker/{stocksTicker}/range/{multiplier}/{timespan}/{from}/{to}

app.get('/stocks', getStocks);

async function getStocks(req, res) {

  try {
    let d = new Date();
    let day = d.getDate();
    if (day < 10) {
      day = `0${day}`;
    }
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let formattedTime = `${year}-${month}-${day}`
    
    const { chosenTicker } = req.query;
    let url = `https://api.polygon.io/v2/aggs/ticker/${chosenTicker}/range/1/hour/2022-12-02/${formattedTime}?apiKey=7jGvZZJtouoVO1edP1pCYWSq4nwjZoDD`;
    
    let results = await axios.get(url);
    let chartGroomed = new Chart(results.data, formattedTime);
   
    res.send(results.data);
  } catch (err) {
    res.status(500).send('There is a Server Error, Please Try Again');
  }
}

// app.get('/crypto', getCrypto);

// async function getCrypto(req, res, next) {
//   try {
//     let timeNow = Date.now();
//     const { chosenTicker } = req.query;
//     let url = `https://api.polygon.io/v2/aggs/ticker/${chosenTicker}/range/1/hour/2022-11-30/2022-12-01?apiKey=7jGvZZJtouoVO1edP1pCYWSq4nwjZoDD`;
//     console.log(url);
//     let results = await axios.get(url);
//     res.send(results.data);
//   } catch (err) {
//     next(err);
//   }
// };

app.get('/user', getUser);

async function getUser(req, res, next) {
  verifyUser(req, async (err, user) => {
    if (err) {
      console.log(err);
      res.send('Invalid Token');
    } else {
      try {
        let email = req.query.email;
        let user = await User.find({ "email": email });
        res.status(200).send(user);
      } catch (err) {
        next(err);
      }
    };
  });
}

app.post('/user', postUser);

async function postUser(req, res, next) {
  try {
    let user = await User.create(req.body);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

app.put('/user/:id', updateStock);

//this will be used to add a stock and delete a stock
// the frontend handles whats in the portfolio

async function updateStock(req, res, next) {
  try {
    let id = req.params.id;
    let updatedUserData = req.body;
    let updatedUser = await User.findByIdAndUpdate(id, updatedUserData, { new: true, overwrites: true });
    res.status(200).send(updatedUser);
  } catch (err) {
    next(err);
  }
};



app.delete('/user/:id', deleteUser);

async function deleteUser(req, res, next) {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.send('user deleted');
  } catch (err) {
    next(err);
  }
}



class Chart {
  constructor(chartObject, formattedTime) {
    this.ticker = chartObject.ticker;
    this.resultsCount = chartObject.resultsCount;
    this.closePrice = chartObject.results.map(price => price.c);
    this.formattedTime = formattedTime;
  }
}

app.get('*', (request, response) => {
  response.status(404).send('Not available');
});


// ERROR
app.use((error, req, res, next) => {
  res.status(500).send(error.message);
});

// LISTEN
app.listen(PORT, () => console.log(`listening on Port ${PORT}`));
