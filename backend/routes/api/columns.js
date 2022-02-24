const express = require("express");
const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const { Project, Kanban, Column, Task, Invite, Member  } = require("../../db/models");

const router = express.Router();

const columnValidators = [
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a name for your column.')
        .isLength({ min: 3 })
        .withMessage('Column name must be at least 3 characters long.')
        .isLength({ max: 100 })
        .withMessage('Column name is too long.')
        .custom((value, { req }) => {
            return Column.findOne({ where: { kanban_id: req.body.kanban_id, name: value } })
                .then(column => {
                    if (column && column.id !== req.body.column_id) {
                        return Promise.reject('This column name already been used within this kanban.')
                    }
                })
        }),
    check('kanban_id')
        .exists({ checkFalsy: true })
        .withMessage('Invalid request, missing required data.'),
    handleValidationErrors
];

// create a column
router.post('/', requireAuth, columnValidators, asyncHandler(async (req, res) => {
    const { user } = req;
    const { project_id, kanban_id, name } = req.body;

    const columns = await Column.findAll({ where: {kanban_id}, order: [['column_index', 'ASC']] })
    if (columns.length >= 5) return res.status(400).json({ errors: ['You can have maximum 5 columns in a kanban.'] });
    // check if user is authorized member/owner
    const project = await Project.findByPk(columns.project_id);
    if (user.id !== project.owner_id) return res.status(401).json({ errors: ['Unauthorized.'] });

    // create column
    const newColumn = await Column.create({ project_id, kanban_id, name, column_index: columns.length });
    return res.json('success');
}))

// edit a column
router.put('^/:id(\\d+)', requireAuth, columnValidators, asyncHandler(async (req, res) => {
    const { user } = req;
    const { kanban_id, name } = req.body;
    const column_id = parseInt(req.params.id, 10);
    const column = await Column.findByPk(column_id);

    // check if column exist
    if (!column) return res.status(400).json({ errors: ['Column does not exist. Please refresh the page.'] });
    // check if user is authorized member/owner
    const project = await Project.findByPk(column.project_id);
    if (user.id !== project.owner_id) return res.status(401).json({ errors: ['Unauthorized.'] });

    // update column details
    await column.update({ name });
    return res.json('success');
}));

// delete one column by id
router.delete('^/:id(\\d+)', requireAuth, asyncHandler(async (req, res) => {
    const column_id = parseInt(req.params.id, 10);
    const column = await Column.findByPk(column_id);
    const kanban_id = column.kanban_id;

     // check if kanban exist
     if (!column) return res.status(400).json({ errors: ['Column does not exist. Please refresh the page.'] });
     // check if user is authorized member/owner
     const project = await Project.findByPk(column.project_id);
     if (user.id !== project.owner_id) return res.status(401).json({ errors: ['Unauthorized.'] });

    // delete all tasks and then delete column
    await Task.destroy({ where: {column_id} });
    await column.destroy();

    // reset all column id
    const columns = await Column.findAll({ where: {kanban_id}, order: [['column_index', 'ASC']] })
      arrayOfId = columns.map(column => {
        return column.id;
    })

    async function resetIndex (arrayOfId, i) {
        if (!arrayOfId.length) return;
        const column = await Column.findByPk(arrayOfId[0]);
        await column.update({ column_index: i });
        const newArray = arrayOfId.slice(1)
        return resetIndex(newArray, i+1);
    }
    await resetIndex(arrayOfId, 0);

    return res.json('success');
}));


module.exports = router;
