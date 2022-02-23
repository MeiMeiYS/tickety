const express = require("express");
const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const { Project, Kanban, Column, Task, Invite, Member } = require("../../db/models");

const router = express.Router();

const projectValidators = [
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a name for your project.')
        .isLength({ min: 3 })
        .withMessage('Project name must be at least 3 characters long.')
        .isLength({ max: 100 })
        .withMessage('Project name is too long.')
        .matches(/^[a-z0-9\-_]+$/i)
        .withMessage("Project names must be alphanumeric and can only contain '_' and '-'")
        .custom((value, { req }) => {
            return Project.findOne({ where: { name: value } })
                .then(project => {
                    if (project && project.id !== req.body.project_id) {
                        return Promise.reject('This project name already been used by you.')
                    }
                })
        }),
    check('description')
        .isLength({ max: 2200 })
        .withMessage('Description cannot be over 2200 characters.'),
    handleValidationErrors
];

// load all my projects
router.get('/mine', requireAuth, asyncHandler(async (req, res) => {
    const { user } = req;
    const projects = await Project.findAll({
        where: {
            owner_id: user.id,
            archive: false
        },
        include: Kanban,
        order: [[Kanban, 'updatedAt', 'DESC']],
    });
    const data = {};
    projects.forEach(project => {
        data[project.id] = project
        // console.log(project.Kanbans)
    });

    return res.json(data);
}));

// load one project by id
router.get('^/:id(\\d+)', requireAuth, asyncHandler(async (req, res) => {
    const { user } = req;
    const project_id = parseInt(req.params.id, 10)
    const project = await Project.findByPk(project_id, {
        where: {
            owner_id: user.id,
            archive: false
        },
        include: Kanban,
        order: [[Kanban, 'updatedAt', 'DESC']],
    });

    return res.json(project);
}));

// create a project
router.post('/', requireAuth, projectValidators, asyncHandler(async (req, res) => {
    const { owner_id, name, description } = req.body;

    // create project
    const project = await Project.create({ owner_id, name, description })
    return res.json(project);
}));

// edit a project
router.put('^/:id(\\d+)', requireAuth, projectValidators, asyncHandler(async (req, res) => {
    const { user } = req;
    const { name, description } = req.body;
    const project_id = parseInt(req.params.id, 10);
    const project = await Project.findByPk(project_id, {
        where: {
            owner_id: user.id,
            archive: false
        }, include: Kanban
    });

    // check if project exist
    if (!project) return res.status(400).json({ errors: ['Project does not exist. Please refresh the page.'] });
    // check if user owns the project
    if (user.id !== project.owner_id) return res.status(401).json({ errors: ['Unauthorized.'] });

    // update project details
    await project.update({ name, description });
    return res.json(project);
}));

// delete a project
router.delete('^/:id(\\d+)', requireAuth, asyncHandler(async (req, res) => {
    const { user } = req;
    const project_id = parseInt(req.params.id, 10);
    const project = await Project.findByPk(project_id);

    // check if project exist
    if (!project) return res.status(400).json({ errors: ['Project does not exist. Please refresh the page.'] });
    // check if user owns the project
    if (user.id !== project.owner_id) return res.status(401).json({ errors: ['Unauthorized.'] });

    // delete all members and invites, tasks, columns, and kanbans first
    await Member.destroy({ where: {project_id} });
    await Invite.destroy({ where: {project_id} });
    await Task.destroy({ where: {project_id} });
    await Column.destroy({ where: {project_id} });
    await Kanban.destroy({ where: {project_id} });

    // delete the project
    await project.destroy();
    return res.json('success');
}));

module.exports = router;
