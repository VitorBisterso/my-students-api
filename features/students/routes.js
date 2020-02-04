const express = require('express');

const {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent
} = require('./controller');
const { verifyToken } = require('../utils');

const router = express.Router();

router
  .route('/')
  .get(getStudents)
  .post(verifyToken, addStudent);

router
  .route('/:id')
  .put(verifyToken, updateStudent)
  .delete(verifyToken, deleteStudent);

module.exports = router;
