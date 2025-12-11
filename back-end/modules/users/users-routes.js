const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersRoutes = express.Router();
const {
  userModel,
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser
} = require('./users-models');

const { createUserRules } = require('./middlewares/create-users-rules');
const { updateUserRules } = require('./middlewares/update-users-rules');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { recipeModel } = require('../recipes/recipes-models.js'); // added


// GET all users
usersRoutes.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    if (!users || users.length === 0) return res.status(404).json([]);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// LOGIN
usersRoutes.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ error: match });

   const token = jwt.sign(
  { userId: user._id, username: user.username, email: user.email, role: user.role, savedList: user.savedList },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

res.json({
  message: 'Login successful',
  token,
  user: {
    id: user._id,
    username: user.username,
    role: user.role,
    savedList: user.savedList
  }
});} catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET saved list
usersRoutes.get('/:id/savedList', async (req, res) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const savedIds = user.savedList || [];

    let recipes = [];
    if (savedIds.length > 0) {
      recipes = await recipeModel.find({ _id: { $in: savedIds } });
    }

    res.status(200).json({
      recipes,
      page: 1,
      limit: recipes.length,
      totalRecipes: recipes.length,
      totalPages: 1
    });
  } catch (error) {
    console.error('Error fetching saved list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//ADD/REMOVE RECIPE FROM LIST
usersRoutes.post('/:id/savedList', async (req, res) => {
  const userId = req.params.id;
  const { recipeId } = req.body;

  if (!recipeId) return res.status(400).json({ error: 'Recipe ID is required' });

  try {
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const index = user.savedList.indexOf(recipeId);

    if (index > -1) {
      // Recipe exists -> Remove it
      user.savedList.splice(index, 1);
      await user.save();
      return res.status(200).json({ message: 'Recipe removed from saved list', savedList: user.savedList });
    } else {
      // Recipe does not exist -> Add it
      user.savedList.push(recipeId);
      await user.save();
      return res.status(200).json({ message: 'Recipe added to saved list', savedList: user.savedList });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// GET user by ID
usersRoutes.get('/:id', async (req, res) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// CREATE new user
usersRoutes.post('/', createUserRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const newUser = req.body;
    const addedUser = await addUser(newUser);
    res.status(201).json(addedUser);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// UPDATE user
usersRoutes.put('/:id', updateUserRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const updatedUserData = req.body;
    if (updatedUserData.password) {
      updatedUserData.password = bcrypt.hashSync(updatedUserData.password, saltRounds);
    }

    const updatedUser = await updateUser(userId, updatedUserData);
    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.message === 'User not found') {
      res.status(404).json({ error: 'User not found' });
    } else {
      console.error('Error', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

module.exports = usersRoutes;
