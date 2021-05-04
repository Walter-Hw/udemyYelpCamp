require("dotenv").config();
const mongoose = require("mongoose");
const CampGround = require("../models/campGround");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect(process.env.ATLAS_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
  console.log("Atlas Database Connected!");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await CampGround.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new CampGround({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: `https://source.unsplash.com/collection/483251`,
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate reprehenderit voluptas vero possimus corrupti, aliquid repellat laudantium animi tempore! Dignissimos, esse itaque.`,
      price: price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
