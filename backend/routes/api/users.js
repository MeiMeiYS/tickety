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
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
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
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors,
];

// Sign up
router.post('', asyncHandler(async (req, res) => {
    const { email, username, name, password } = req.body;
    const errors = [];
    // check if email or username exits in database already
    const checkUserEmail = await User.findOne({ where: {email} });
    if (checkUserEmail) errors.push('This email address has already been used.')
    const checkUsername = await User.findOne({ where: {username} });
    if (checkUsername) errors.push('This username has already been taken.')
    if (errors.length) return res.status(400).json({ errors })

    // create user
    const user = await User.signup({ email, username, name, password });

    await setTokenCookie(res, user);

    return res.json({
      user,
    });
  }),
);

module.exports = router;
