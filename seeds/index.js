require('dotenv').config();
const mongoose = require('mongoose');
const CampGround = require('../models/campGround');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect(process.env.ATLAS_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
  console.log('Atlas Database Connected!');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await CampGround.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new CampGround({
      author: '609747d40e91b80e228ab16a',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate reprehenderit voluptas vero possimus corrupti, aliquid repellat laudantium animi tempore! Dignissimos, esse itaque.`,
      price: price,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url:
            'https://res.cloudinary.com/dyayk6qhg/image/upload/v1620663008/samples/landscapes/beach-boat.jpg',
          filename: 'YelpCamp/wziuh5sqd8f3nlrchttv',
        },
        {
          url:
            'https://res.cloudinary.com/dyayk6qhg/image/upload/v1620663012/samples/landscapes/nature-mountains.jpg',
          filename: 'YelpCamp/pdcrffmqplxiycn2zhp0',
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
