const express = require('express');

const {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  addStudentNote,
  updateStudentNote,
  deleteStudentNote
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

router.route('/:id/notes').post(verifyToken, addStudentNote);
router
  .route('/:studentId/notes/:noteId')
  .put(verifyToken, updateStudentNote)
  .delete(verifyToken, deleteStudentNote);

module.exports = router;
