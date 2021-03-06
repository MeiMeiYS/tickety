const express = require("express");
const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const { Project, Kanban, Column, Task, Invite, Member  } = require("../../db/models");

const router = express.Router();

const kanbanValidators = [
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a name for your kanban.')
        .isLength({ min: 3 })
        .withMessage('Kanban name must be at least 3 characters long.')
        .isLength({ max: 100 })
        .withMessage('Kanban name is too long.')
        .matches(/^[a-z0-9\-_]+$/i)
        .withMessage("Kanban names must be alphanumeric and can only contain '_' and '-'")
        .custom((value, { req }) => {
            return Kanban.findOne({ where: { project_id: req.body.project_id, name: value } })
                .then(kanban => {
                    if (kanban && kanban.id !== req.body.kanban_id) {
                        return Promise.reject('This kanban name already been used within this project.')
                    }
                })
        }),
    check('description')
        .isLength({ max: 2200 })
        .withMessage('Description cannot be over 2200 characters.'),
    check('project_id')
        .exists({ checkFalsy: true })
        .withMessage('Invalid request, missing required data.'),
    handleValidationErrors
];

// load one kanban by id
router.get('^/:id(\\d+)', requireAuth, asyncHandler(async (req, res) => {
    const { user } = req;
    const kanban_id = parseInt(req.params.id, 10);

    const kanban = await Kanban.findByPk(kanban_id, {
        where: {
            archive: false
        }, include: {
            model: Column,
            include: Task
        },
        order: [[Column, 'column_index', 'ASC'], [Column, Task, 'task_index','ASC']]
    });

    // check if user is authorized member/owner
    const project = await Project.findByPk(kanban.project_id);
    if (user.id !== project.owner_id) return res.status(401).json({ errors: ['Unauthorized.'] });

    return res.json(kanban);
}));

// create a kanban (will create 3 columns and one task by default)
router.post('/', requireAuth, kanbanValidators, asyncHandler(async (req, res) => {
    const { user } = req;
    const { project_id, name, description } = req.body;

    // create kanban
    const newKanban = await Kanban.create({ project_id, name, description });
    // create 3 columns
    const column1 = await Column.create({ project_id, kanban_id: newKanban.id, name: 'To do', column_index: 0 });
    const column2 = await Column.create({ project_id, kanban_id: newKanban.id, name: 'In progress', column_index: 1 });
    const column3 = await Column.create({ project_id, kanban_id: newKanban.id, name: 'Done', column_index: 2 });
    // create 1 task
    const task = await Task.create({
        project_id,
        kanban_id: newKanban.id,
        column_id: column1.id,
        content: '???? Welcome to Tickety ???? \n We\'re so excited that you\'ve decided to create a new project! You can create, edit, and delete tasks or columns here. You can also drag and drop me to any column you like.',
        task_index: 0,
        creator_id: user.id
    })

    // now find this kanban by id and send as res
    const kanban = await Kanban.findByPk(newKanban.id, {
        where: {
            archive: false
        }, include: {
            model: Column,
            include: Task
        },
        order: [[Column, 'column_index', 'ASC'], [Column, Task, 'task_index','ASC']]
    });

    return res.json(kanban);
}));

// edit a kanban
router.put('^/:id(\\d+)', requireAuth, kanbanValidators, asyncHandler(async (req, res) => {
    const { user } = req;
    const { project_id, kanban_id, name, description } = req.body;
    const kanbanId = parseInt(req.params.id, 10);
    const kanban = await Kanban.findByPk(kanbanId);

    // check if kanban exist
    if (!kanban) return res.status(400).json({ errors: ['Kanban does not exist. Please refresh the page.'] });
    // check if user is authorized member/owner
    const project = await Project.findByPk(kanban.project_id);
    if (user.id !== project.owner_id) return res.status(401).json({ errors: ['Unauthorized.'] });

    // update project details
    await kanban.update({ name, description });
    return res.json(kanban);
}));

// delete one kanban by id
router.delete('^/:id(\\d+)', requireAuth, asyncHandler(async (req, res) => {
    const { user } = req;
    const kanban_id = parseInt(req.params.id, 10);
    const kanban = await Kanban.findByPk(kanban_id);

     // check if kanban exist
     if (!kanban) return res.status(400).json({ errors: ['Kanban does not exist. Please refresh the page.'] });
     // check if user is authorized member/owner
     const project = await Project.findByPk(kanban.project_id);
     if (user.id !== project.owner_id) return res.status(401).json({ errors: ['Unauthorized.'] });

    // delete all tasks, columns, and then delete kanban
    await Task.destroy({ where: {kanban_id} });
    await Column.destroy({ where: {kanban_id} });
    await kanban.destroy();

    return res.json('success');
}));

module.exports = router;
