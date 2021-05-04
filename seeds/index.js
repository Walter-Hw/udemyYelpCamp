require('dotenv').config();
const mongoose = require('mongoose');
const CampGround = require('../models/campGround');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

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

const seedDB = async () => {
  await CampGround.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new CampGround(
      {
        location: `${cities[random1000].city}, ${cities[random1000].state}`
      }
    )
    await camp.save();
  }

}

seedDB();