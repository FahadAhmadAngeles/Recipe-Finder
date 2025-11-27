const express = require('express');
const hostname = 'localhost';
const port = 3000;
const server = express();
const dot = require('dotenv').config();
const connectDB = require('./shared/middlewares/connect-db.js');
const cors = require('cors');

server.use(cors());
server.use(express.json());
server.use(connectDB);

const recipesRoutes = require("./modules/recipes/recipes-routes.js");
const usersRoutes = require("./modules/users/users-routes.js");
const savedListsRoutes = require("./modules/savedLists/savedLists-routes.js");

server.use('/recipes', recipesRoutes);
server.use('/users', usersRoutes);
server.use('/savedLists', savedListsRoutes);


//Error Handling middleware
server.use((error, req, res, next) => {
  console.error(error.stack)
  res.status(500).send('Something went wrong');
})

// 404 Route not found middleware
server.use((req, res, next) => {
  res.status(404).send(`404! ${req.method} ${req.path} Not Found.`);
});


server.listen(port, hostname, (error) => {
  if (error) console.log(error.message);
  else console.log(`Server running on http://${hostname}:${port}`);
});



