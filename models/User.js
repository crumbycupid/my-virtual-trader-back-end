'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  portfolio: {type: Array, required: true},
});

//Portfolio will have list of objects. In each object there will be a ticker, date, how much of a stock was bought and what price it was bought at.
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
