require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const CampGround = require('./models/campGround');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.ATLAS_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
  console.log('Atlas Database Connected!');
});

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.get('/', (req, res) => {
  res.render('home');
});

app.get('/makecampground', async (req, res) => {
  const camp = new CampGround({ title: 'My Backyard', description: 'Cheap Camping Place!' });
  await camp.save();
  res.send(camp);
});

app.listen(port, () => {
  console.log('Start listening on port'.toUpperCase(), port);
});

