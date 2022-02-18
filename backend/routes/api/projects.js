const express = require("express");
const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
// const { User } = require("../../db/models");
const { Project, Kanban, Column, Task, Invite, Member  } = require("../../db/models");

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

// load all my projects
router.get('/mine', requireAuth, asyncHandler(async (req, res) => {
    const { user } = req;
    const projects = await Project.findAll({
        where: {
            owner_id: user.id,
            archive: false
        }, include: {
            model: Kanban,
            include: {
                model: Column,
                include: Task
            }
        }
    });
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

// delete a project
router.delete('^/:id(\\d+)', requireAuth, asyncHandler(async (req, res) => {
    const { user } = req;
    const project_id = parseInt(req.params.id, 10);
    const project = await Project.findByPk(project_id, { include: Kanban });

    // check if project exist
    if (!project) return res.status(400).json({ errors: ['Project does not exist. Please refresh the page.'] });
    // check if user owns the project
    if (user.id !== project.owner_id)res.status(401).json({ errors: ['Unauthorized.'] });

    // delete all members and invites, tasks, columns, and kanbans first
    await Member.destroy({ where: {project_id} });
    await Invite.destroy({ where: {project_id} });
    await Task.destroy({ where: {project_id} });
    await Column.destroy({ where: {project_id} });
    await Kanban.destroy({ where: {project_id} });

    // delete the project
    project.destroy();
    return res.json('success');
}));

module.exports = router;
