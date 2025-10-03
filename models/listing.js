const { required } = require("joi");
const mongoose = require("mongoose");
const review = require("./review.js");
const schema = mongoose.Schema;
const listingschema = new schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    url: String,
    filename : String,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  review : [
    {
    type : schema.Types.ObjectId,
    ref : "Review"
  },
],

owner : {
  type : schema.Types.ObjectId,
  ref : "User"  // ref me model ka nam likhte h 
}

});

listingschema.post("findOneAndDelete", async (data) => {
  console.log("I Am Mongoose Middleware and Data is " + data);
  if (data.review.length) {
    let res = await review.deleteMany({ _id: { $in: data.review } });
    console.log("\n\n I am Final Result     " + res)
  }
});

const Listing = mongoose.model("Listing", listingschema);
module.exports = Listing;
