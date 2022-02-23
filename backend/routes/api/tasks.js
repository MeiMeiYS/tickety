const express = require("express");
const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const { Project, Kanban, Column, Task, Invite, Member  } = require("../../db/models");
const task = require("../../db/models/task");

const router = express.Router();

const taskValidators = [
    check('content')
        .exists({ checkFalsy: true })
        .withMessage('Content is required.')
        .isLength({ max: 2200 })
        .withMessage('Content cannot be over 2200 characters long.'),
    check('column_id')
        .exists({ checkFalsy: true })
        .withMessage('Invalid request, missing required data.'),
    handleValidationErrors
];

// create a task
router.post('/', requireAuth, taskValidators, asyncHandler(async (req, res) => {
    const { user } = req;
    const { column_id, content } = req.body;

    const column = await Column.findByPk(column_id);
    const tasks = await Task.findAll({ where: {column_id}, order: [['task_index', 'ASC']] })
    if (tasks.length >= 30) return res.status(400).json({ errors: ['You can have maximum 30 tasks in one column.'] });

    // create task
    const newTask = await Task.create({
        project_id: column.project_id,
        kanban_id: column.kanban_id,
        column_id,
        content,
        task_index: tasks.length,
        creator_id: user.id
    });
    return res.json('success');
}))

// move a task (update column_id or task_index)
router.put('^/:id(\\d+)', requireAuth, asyncHandler(async (req, res) => {
    const { user } = req;
    const { newColumnId, newIndex } = req.body;
    const task_id = parseInt(req.params.id, 10);
    const task = await Task.findByPk(task_id);
    const oldColumnId = task.column_id;
    const oldIndex = task.task_index;

    // if task is only moving within the same column
    if (parseInt(newColumnId, 10) === oldColumnId) {
        console.log('!!!!!!!!!!!', newColumnId, oldColumnId)
        const tasks = await Task.findAll({ where: {column_id: oldColumnId}, order: [['task_index', 'ASC']] })
        arrayOfId = tasks.map(task => {
            return task.id;
        })
        arrayOfId.splice(oldIndex, 1);
        arrayOfId.splice(newIndex, 0, task_id);
        await resetIndex(arrayOfId, 0);
        return res.json('success');
    }

    // update new column's task from newIndex to end
    const newColumnsTasks = await Task.findAll({ where: {column_id: newColumnId}, order: [['task_index', 'ASC']] })

    arrayOfIdNew = newColumnsTasks.map(task => {
        return task.id;
    })
    resetArrayNew = arrayOfIdNew.slice(newIndex);

    async function resetIndex (array, i) {
        if (!array.length) return;
        const task = await Task.findByPk(array[0]);
        await task.update({ task_index: i });
        const newArray = array.slice(1)
        return resetIndex(newArray, i+1);
    }
    await resetIndex(resetArrayNew, newIndex + 1);

    // update task to new column / new index
    await task.update({ column_id: newColumnId, task_index: newIndex });

    // update old column's task => reset all index
    const oldColumnsTasks = await Task.findAll({ where: {column_id: oldColumnId}, order: [['task_index', 'ASC']] })

    arrayOfIdOld = oldColumnsTasks.map(task => {
        return task.id;
    })
    resetArrayOld = arrayOfIdOld.slice(oldIndex);

    await resetIndex(resetArrayOld, oldIndex);

    return res.json('success');
}));

// // edit a task
// router.put('^/:id(\\d+)', requireAuth, columnValidators, asyncHandler(async (req, res) => {
//     const { user } = req;
//     const { kanban_id, name } = req.body;
//     const column_id = parseInt(req.params.id, 10);
//     const column = await Column.findByPk(column_id);

//     // check if column exist
//     if (!column) return res.status(400).json({ errors: ['Column does not exist. Please refresh the page.'] });
//     // check if user is authorized member/owner
//     // if (user.id !== project.owner_id)res.status(401).json({ errors: ['Unauthorized.'] });

//     // update column details
//     await column.update({ name });
//     return res.json('success');
// }));

// // delete one task by id
// router.delete('^/:id(\\d+)', requireAuth, asyncHandler(async (req, res) => {
//     const column_id = parseInt(req.params.id, 10);
//     const column = await Column.findByPk(column_id);
//     const kanban_id = column.kanban_id;

//      // check if kanban exist
//      if (!column) return res.status(400).json({ errors: ['Kanban does not exist. Please refresh the page.'] });
//      // check if user is authorized member/owner
//      // if (user.id !== project.owner_id)res.status(401).json({ errors: ['Unauthorized.'] });

//     // delete all tasks and then delete column
//     await Task.destroy({ where: {column_id} });
//     await column.destroy();

//     // reset all column id
//     const columns = await Column.findAll({ where: {kanban_id}, order: [['column_index', 'ASC']] })
//       arrayOfId = columns.map(column => {
//         return column.id;
//     })

//     async function resetIndex (arrayOfId, i) {
//         if (!arrayOfId.length) return;
//         const column = await Column.findByPk(arrayOfId[0]);
//         await column.update({ column_index: i });
//         const newArray = arrayOfId.slice(1)
//         return resetIndex(newArray, i+1);
//     }
//     await resetIndex(arrayOfId, 0);

//     return res.json('success');
// }));


module.exports = router;
