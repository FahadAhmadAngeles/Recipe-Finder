const express = require('express');
const savedListsRoutes = express.Router();
const { getAllLists, getListByUserId, createList, updateList, deleteList } = require('./savedLists-models');
const { createListRules } = require('./middlewares/create-list-rules');
const { updateListRules } = require('./middlewares/update-list-rules');
const { validationResult } = require('express-validator');

savedListsRoutes.get('/', (req, res) => {
    getAllLists()
        .then((lists) => {
            if (!lists || lists.length === 0) {
                return res.status(404).json([]);
            }
            return res.status(200).json(lists);
        })
        .catch((error) => {
            console.error('Error', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

savedListsRoutes.get('/:userId', (req, res) => {
    const customerId = Number(req.params.userId);
    
    getListByUserId(customerId)
        .then((list) => {
            if (!list) {
                return res.status(404).json({ error: "Saved list Not Found" });
            }
            return res.status(200).json(list);
        })
        .catch((error) => {
            console.error('Error', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

savedListsRoutes.post('/', createListRules, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const newList = req.body;
    createList(newList)
        .then((createdList) => {
            res.status(201).json(createdList);
        })
        .catch((error) => {
            console.error('Error', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

savedListsRoutes.put('/:userId', updateListRules, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const customerId = Number(req.params.userId);
    const updatedRecipeIds = req.body.recipeIds;

    updateList(customerId, updatedRecipeIds)
        .then((updatedList) => {
            res.status(200).json(updatedList);
        })
        .catch((error) => {
            if (error.message === "Saved list not found") {
                res.status(404).json({ error: "Saved list not found" });
            } else {
                console.error('Error', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
});

savedListsRoutes.delete('/:userId', (req, res) => {
    const customerId = Number(req.params.userId);

    deleteList(customerId)
        .then((deletedList) => {
            res.status(200).json(deletedList);
        })
        .catch((error) => {
            if (error.message === "Saved list not found") {
                res.status(404).json({ error: "Saved list not found" });
            } else {
                console.error('Error', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
});

module.exports = savedListsRoutes;