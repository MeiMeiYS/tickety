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
        .matches(/^[a-z0-9\-_]+$/i)
        .withMessage("Column names must be alphanumeric and can only contain '_' and '-'")
        .custom((value, { req }) => {
            return Column.findOne({ where: { kanban_id: req.body.kanban_id, name: value } })
                .then(column => {
                    if (column && column.id !== req.body.column_id) {
                        return Promise.reject('This column name already been used within this kanban.')
                    }
                })
        })
];

// delete one column by id
router.delete('^/:id(\\d+)', requireAuth, asyncHandler(async (req, res) => {
    const column_id = parseInt(req.params.id, 10);
    const column = await Column.findByPk(column_id);
    const kanban_id = column.kanban_id;

     // check if kanban exist
     if (!column) return res.status(400).json({ errors: ['Kanban does not exist. Please refresh the page.'] });
     // check if user is authorized member/owner
     // if (user.id !== project.owner_id)res.status(401).json({ errors: ['Unauthorized.'] });

    // delete all tasks and then delete column
    await Task.destroy({ where: {column_id} });
    column.destroy();

    return res.json('success');
}));


module.exports = router;
