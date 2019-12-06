const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

dotenv.config({ path: './../../config.env' });

const DB = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('successful con.connections');
  });

//Read JSON FILE

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data succesfully loaded');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteDataFromDb = async () => {
  try {
    await Tour.deleteMany();
    console.log('data succesfully deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};
importData();
