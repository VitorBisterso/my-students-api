const jwt = require('jsonwebtoken');

const Student = require('./model');
const { throwError } = require('../utils');

// @desc Get all students
// @route GET /api/students
// @access Public
exports.getStudents = (req, res) =>
  Student.find()
    .then(students =>
      res.status(200).json({
        success: true,
        data: students
      })
    )
    .catch(error => {
      const errorMessage = 'Error retrieving all students';
      return throwError(res, error, 500, errorMessage);
    });

// @desc Create a student
// @route POST /api/students
// @access Protected
exports.addStudent = (req, res) =>
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, error => {
    if (error) {
      return res.sendStatus(403);
    }
    Student.create(req.body)
      .then(newStudent =>
        res.status(201).json({ success: true, data: newStudent })
      )
      .catch(err => {
        const errorMessage = 'Error creating student';
        return throwError(res, err, 500, errorMessage);
      });
  });

// @desc Update a student
// @route PUT /api/students/:id
// @access Protected
exports.updateStudent = (req, res) =>
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, error => {
    if (error) {
      return res.sendStatus(403);
    }
    const { id } = req.params;
    const filter = { _id: id };
    const update = { ...req.body };
    return Student.findOneAndUpdate(filter, update, { new: true })
      .then(updatedStudent => {
        if (updatedStudent)
          return res.json({ success: true, data: updatedStudent });

        const errorMessage = `The student with the id ${id} does not exist`;
        return throwError(res, errorMessage, 404, errorMessage);
      })
      .catch(err => {
        const errorMessage = 'Error updating student';
        return throwError(res, err, 500, errorMessage);
      });
  });

// @desc Delete a student by its id
// @route DELETE /api/students/:id
// @access Protected
exports.deleteStudent = (req, res) =>
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, error => {
    if (error) {
      return res.sendStatus(403);
    }
    const { id } = req.params;
    const filter = { _id: id };
    return Student.findOneAndDelete(filter)
      .then(deletedStudent => {
        if (deletedStudent)
          return res.json({ success: true, data: deletedStudent });

        const errorMessage = `The student with the id ${id} does not exist`;
        return throwError(res, errorMessage, 404, errorMessage);
      })
      .catch(err => {
        const errorMessage = 'Error updating student';
        return throwError(res, err, 500, errorMessage);
      });
  });

// @desc Add a student note
// @route POST /api/students/:id/notes
// @access Protected
exports.addStudentNote = (req, res) =>
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, error => {
    if (error) {
      return res.sendStatus(403);
    }
    const { id } = req.params;
    return Student.findById(id)
      .then(student => {
        const { date, topic, comments } = req.body;
        const newNote = { date, topic, comments };
        student.notes.push(newNote);
        student
          .save()
          .then(updatedStudent =>
            res.json({ success: true, data: updatedStudent })
          )
          .catch(err => {
            const errorMessage = 'Error adding student note';
            return throwError(res, err, 500, errorMessage);
          });
      })
      .catch(err => {
        const errorMessage = `The student with the id ${id} does not exist`;
        return throwError(res, err, 404, errorMessage);
      });
  });

// @desc Edit a student note
// @route PUT /api/students/:studentId/notes/:noteId
// @access Protected
exports.updateStudentNote = (req, res) =>
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, error => {
    if (error) {
      return res.sendStatus(403);
    }
    const { studentId, noteId } = req.params;
    return Student.findById(studentId)
      .then(student => {
        const { date, topic, comments } = req.body;
        const updatedNote = { date, topic, comments };
        const index = student.notes.findIndex(
          // eslint-disable-next-line no-underscore-dangle
          note => note._id.toString() === noteId
        );
        if (index >= 0) {
          // eslint-disable-next-line no-param-reassign
          student.notes = [
            ...student.notes.slice(0, index),
            updatedNote,
            ...student.notes.slice(index + 1)
          ];
          student
            .save()
            .then(updatedStudent =>
              res.json({ success: true, data: updatedStudent })
            )
            .catch(err => {
              const errorMessage = 'Error updating student note';
              return throwError(res, err, 500, errorMessage);
            });
        } else {
          const errorMessage = `The note with the id ${noteId} does not exist`;
          return throwError(res, errorMessage, 404, errorMessage);
        }
      })
      .catch(err => {
        const errorMessage = `The student with the id ${studentId} does not exist`;
        return throwError(res, err, 404, errorMessage);
      });
  });

// @desc Delete a student note
// @route DELETE /api/students/:studentId/notes/:noteId
// @access Protected
exports.deleteStudentNote = (req, res) =>
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, error => {
    if (error) {
      return res.sendStatus(403);
    }
    const { studentId, noteId } = req.params;
    return Student.findById(studentId)
      .then(student => {
        // eslint-disable-next-line no-param-reassign
        student.notes = student.notes.filter(
          // eslint-disable-next-line no-underscore-dangle
          note => note._id.toString() !== noteId
        );
        student
          .save()
          .then(updatedStudent =>
            res.json({ success: true, data: updatedStudent })
          )
          .catch(err => {
            const errorMessage = 'Error deleting student note';
            return throwError(res, err, 500, errorMessage);
          });
      })
      .catch(err => {
        const errorMessage = `The student with the id ${studentId} does not exist`;
        return throwError(res, err, 404, errorMessage);
      });
  });
