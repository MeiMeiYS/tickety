const express = require("express");
const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");

const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

const router = express.Router();

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email.")
    .custom((value) => {
      return User.findOne({ where: { email: value } }).then((user) => {
        if (user) {
          return Promise.reject("This email is already being used.");
        }
      });
    }),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters.")
    .isLength({ max: 30 })
    .withMessage("Username is too long.")
    .matches(/^[a-z0-9\-_]+$/i)
    .withMessage("Kanban names must be alphanumeric and can only contain '_' and '-'")
    .custom((value) => {
      return User.findOne({ where: { username: value } }).then((user) => {
        if (user) {
          return Promise.reject("This username is already being used.");
        }
      });
    }),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage("Please provide your name with at least 2 characters.")
    .isLength({ max: 100 })
    .withMessage("Name is too long."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more.")
    .isLength({ max: 20 })
    .withMessage("Password must not be more than 20 characters long"),
  handleValidationErrors,
];

const validateEditUserInfo = [
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters.")
    .isLength({ max: 30 })
    .withMessage("Username is too long.")
    .matches(/^[a-z0-9\-_]+$/i)
    .withMessage("Kanban names must be alphanumeric and can only contain '_' and '-'")
    .custom((value, { req }) => {
      return User.findOne({ where: { username: value } }).then((user) => {
        if (user && user.id !== req.user.id) {
          return Promise.reject("This username is already being used.");
        }
      });
    }),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage("Please provide your name with at least 2 characters.")
    .isLength({ max: 100 })
    .withMessage("Name is too long."),
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email.")
    .custom((value, { req }) => {
      return User.findOne({ where: { email: value } }).then((user) => {
        if (user && user.id !== req.user.id) {
          return Promise.reject("This email is already being used.");
        }
      });
    }),
  check("title")
    .isLength({ max: 100 })
    .withMessage("Title is too long."),
  handleValidationErrors,
];

const validateChangePassword = [
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more.")
    .isLength({ max: 20 })
    .withMessage("Password must not be more than 20 characters long"),
  handleValidationErrors,
];

// Sign up
router.post("", validateSignup, asyncHandler(async (req, res) => {
    const { email, username, name, password } = req.body;

    // create user
    const user = await User.signup({ email, username, name, password });

    await setTokenCookie(res, user);

    return res.json({
      user,
    });
  })
);

// update user info
router.put('^/:id(\\d+)', requireAuth, validateEditUserInfo, asyncHandler(async (req, res) => {
  const { user } = req;
  const { email, username, name, title } = req.body;
  const user_id = parseInt(req.params.id, 10);
  const currentUser = await User.findByPk(user_id);

  if (user.id !== user_id) return res.status(401).json({ errors: ['Unauthorized.'] });

  // if (user_id === 1) return res.status(401).json({ errors: ['Demo user\'s info cannot be changed.'] });
  await currentUser.update({ email, username, name, title });

  return res.json({ user: currentUser});
}));

// update user password
router.put('^/:id(\\d+)/password', requireAuth, validateChangePassword, asyncHandler(async (req, res) => {
  const { user } = req;
  const { oldPassword, password } = req.body;
  const user_id = parseInt(req.params.id, 10);
  const currentUser = await User.findByPk(user_id);

  if (user.id !== user_id) return res.status(401).json({ errors: ['Unauthorized.'] });

  if (user_id === 1) return res.status(401).json({ errors: ['Demo user\'s password cannot be changed.'] });

  const updatedUser = await User.changePassword({user_id, oldPassword, password});
  if (updatedUser) return res.json({ user: updatedUser});
  else return res.status(401).json({ errors: ['Password incorrect.'] });
}));

module.exports = router;
