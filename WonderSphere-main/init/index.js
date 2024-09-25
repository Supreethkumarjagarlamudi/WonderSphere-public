let mongoose = require("mongoose");
let mongo_url = "mongodb://127.0.0.1:27017/wonderlust";
let listing = require("../models/listing.js");
let data = require("./data.js");
async function main() {
  await mongoose.connect(mongo_url);
}

main()
  .then(() => {
    console.log("Its working");
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log(err);
  });


async function insertdata() {
  await listing.deleteMany({});
  data.data = data.data.map((obj) => ({
    ...obj, owner: '66980baf88c19512adc712b9'
  }))
  await listing.insertMany(data.data);
}

insertdata().then(()=>{
  console.log("Successfully worked");
}).catch((err)=>{
  console.log(err);
})