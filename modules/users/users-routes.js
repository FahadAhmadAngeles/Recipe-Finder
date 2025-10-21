const express = require('express');
const usersRoutes = express.Router();
const { getAllUsers, getUserById, addUser, updateUser, deleteUser } = require('./users-models');
const { createUserRules } = require('./middlewares/create-users-rules');
const { updateUserRules } = require('./middlewares/update-users-rules');
const { validationResult } = require('express-validator');

usersRoutes.get('/', (req, res) => {
    getAllUsers()
        .then((users) => {
            if (!users || users.length === 0) {
                return res.status(404).json([]);
            }
            return res.status(200).json(users);
        })
        .catch((error) => {
            console.error('Error', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

usersRoutes.get('/:id', (req, res) => {
    const userId = Number(req.params.id);
    
    getUserById(userId)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ error: "User Not Found" });
            }
            return res.status(200).json(user);
        })
        .catch((error) => {
            console.error('Error', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

usersRoutes.post('/', createUserRules, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const newUser = req.body;
    addUser(newUser)
        .then((addedUser) => {
            res.status(201).json(addedUser);
        })
        .catch((error) => {
            console.error('Error', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

usersRoutes.put('/:id', updateUserRules, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userId = Number(req.params.id);
    const updatedUserData = req.body;

    updateUser(userId, updatedUserData)
        .then((updatedUser) => {
            res.status(200).json(updatedUser);
        })
        .catch((error) => {
            if (error.message === "User not found") {
                res.status(404).json({ error: "User not found" });
            } else {
                console.error('Error', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
});

usersRoutes.delete('/:id', (req, res) => {
    const userId = Number(req.params.id);

    deleteUser(userId)
        .then((deletedUser) => {
            res.status(200).json(deletedUser);
        })
        .catch((error) => {
            if (error.message === "User not found") {
                res.status(404).json({ error: "User not found" });
            } else {
                console.error('Error', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
});

module.exports = usersRoutes;