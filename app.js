require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const CampGround = require('./models/campGround');
const methodOverride = require('method-override');
const { DH_CHECK_P_NOT_SAFE_PRIME } = require('constants');

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
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await CampGround.find({});
  res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
});

app.post('/campgrounds', async (req, res) => {
  const campground = new CampGround(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground.id}`);
});


app.get('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findById(id)
  res.render('campgrounds/show', { campground });
});

app.get('/campgrounds/:id/edit', async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findById(id)
  res.render('campgrounds/edit', { campground });
});

app.put('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/campgrounds/${campground.id}`);
});

app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  await CampGround.findByIdAndDelete(id);
  res.redirect('/campgrounds');
});

app.listen(port, () => {
  console.log('Start listening on port'.toUpperCase(), port);
});

