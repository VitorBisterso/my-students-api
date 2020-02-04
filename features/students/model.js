const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student must have a name']
  },
  level: {
    type: String,
    required: [true, 'Student must have a level']
  },
  classDay: {
    type: String,
    required: [true, 'Student must have a class day']
  },
  email: {
    type: String,
    required: [true, 'Student must have an email']
  },
  phone: {
    type: String,
    required: [true, 'Student must have a phone']
  },
  birthday: {
    type: String,
    required: [true, 'Student must have a birthday']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', StudentSchema);
