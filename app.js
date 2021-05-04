require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.connect(process.env.ATLAS_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

app.get('/', (req, res) => {
  res.send(`<h1>Hello From Walter's YelpCamp Project</h1>`);
});

app.listen(port, () => {
  console.log('Start listening on port'.toUpperCase(), port);
});