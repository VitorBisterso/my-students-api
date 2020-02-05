const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./model');
const RegisterToken = require('../registerTokens/model');
const { throwError } = require('../utils');

// @desc Register user
// @route POST /api/users/register
// @access Public
exports.register = async (req, res) => {
  const { email, password, token: registerToken } = req.body;

  const filter = { token: registerToken };
  try {
    const token = await RegisterToken.findOneAndDelete(filter);
    if (!token) {
      const errorMessage = `You cannot register without the admin's permission!`;
      return throwError(res, errorMessage, 400, errorMessage);
    }
  } catch (error) {
    const errorMessage = 'Error creating user';
    return throwError(res, error, 500, errorMessage);
  }

  const newUser = new User({
    email,
    password
  });

  if (newUser.password && newUser.password.length < 5) {
    const errorMessage = 'Password must be at least 5 characters long';
    return throwError(res, errorMessage, 400, errorMessage);
  }
  bcrypt.hash(newUser.password, 10, (error, hash) => {
    newUser.password = hash;
    newUser
      .save()
      .then(user => res.json({ success: true, data: user }))
      .catch(err => {
        let errorMessage = 'Error creating user';
        if (err.code === 11000) {
          errorMessage = `The user with the email "${email}" already exists`;
          return throwError(res, err, 400, errorMessage);
        }
        return throwError(res, err, 500, errorMessage);
      });
  });
};

// @desc Login
// @route POST /api/users/login
// @access Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    const errorMessage = `The user with the email "${email}" was not found`;
    return throwError(res, errorMessage, 404, errorMessage);
  }
  bcrypt.compare(password, user.password, (error, equal) => {
    if (!equal) {
      const errorMessage = 'Wrong password';
      return throwError(res, errorMessage, 400, errorMessage);
    }
    jwt.sign(
      { user },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '30d' },
      (err, token) => res.json({ success: true, token })
    );
  });
};
