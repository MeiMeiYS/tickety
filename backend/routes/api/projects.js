const express = require("express");
const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
// const { User } = require("../../db/models");
const { Project } = require("../../db/models");

const router = express.Router();

const projectValidators = [
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a name for your project.')
        .isLength({ min: 3 })
        .withMessage('Project name must be at least 3 characters long.')
        .isLength({ max: 100 })
        .withMessage('Project name is too long.'),
    handleValidationErrors
];

// load all the projects
router.get('/', requireAuth, asyncHandler(async (req, res) => {
    const { user } = req;
    const projects = await Project.findAll({ where: { owner_id: user.id, archive: false } });
    const data = {};
    projects.forEach(project => {
        data[project.id] = project
    });

    return res.json(data);
}));

// create a project
router.post('/', requireAuth, projectValidators, asyncHandler(async (req, res) => {
    const { owner_id, name, description } = req.body;
    console.log('@@@@@@@@@@', req.body)

    const errors = [];
    const checkProjects = await Project.findAll({ where: { name } });
    if (checkProjects.length) errors.push('This project name already exist.')
    if (errors.length) return res.status(400).json({ errors })

    // create project
    const project = await Project.create({ owner_id, name, description })
    return res.json(project);
}));

module.exports = router;
