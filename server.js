const express = require('express');

const hostname = 'localhost';
const port = 3000;
const server = express();

server.get('/recipes/:id', (req, res) => {
    if (req.params.id == 1) {
    res.send("Pancakes Recipe: \n 1. Mix flour, milk, and eggs. \n 2. Heat a pan and add butter. \n 3. Pour batter into the pan and cook until golden brown on both sides.");
    } else {
      res.status(404).send('Recipe not found');
    } 
})

server.get('/recipes', (req, res) => {
  res.send('Pancakes \n Chicken Wrap \n Salad');
})

server.post('/recipes', (req, res) => {
  res.send('Recipe created successfully');
})

server.delete('/recipes/:id', (req, res) => {
  if (req.params.id == 1) {
    res.send('Recipe deleted successfully');
  } else {
    res.send('Recipe not found');
  }
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

