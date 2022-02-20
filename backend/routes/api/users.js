const express = require("express");
const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");

const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.')
    .custom(value => {
      return User.findOne({ where: { email: value } })
        .then(user => {
          if (user) {
            return Promise.reject('This email is already being used.')
          }
        })
    }),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.')
    .isLength({ max: 30 })
    .withMessage('Username is too long.')
    .custom(value => {
      return User.findOne({ where: { username: value } })
        .then(user => {
          if (user) {
            return Promise.reject('This username is already being used.')
          }
        })
    }),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage('Please provide your name with at least 2 characters.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.')
    .isLength({ max: 20 })
    .withMessage('Password must not be more than 20 characters long'),
  handleValidationErrors,
];

// Sign up
router.post('', validateSignup, asyncHandler(async (req, res) => {
    const { email, username, name, password } = req.body;

    // create user
    const user = await User.signup({ email, username, name, password });

    await setTokenCookie(res, user);

    return res.json({
      user,
    });
  }),
);

module.exports = router;
