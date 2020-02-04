const mongoose = require('mongoose');

const RegisterTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, 'Register token must have a token'],
    unique: true
  }
});

module.exports = mongoose.model('RegisterToken', RegisterTokenSchema);
