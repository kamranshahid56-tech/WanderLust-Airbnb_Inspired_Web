const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const listingSchema = new Schema({
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
    filename: String,
  },
  
  // image: {
  //   type: String,
  //   
  //   set: (v) =>
  //     v === ""
  //       ? "https://media.istockphoto.com/id/472899538/photo/downtown-cleveland-hotel-entrance-and-waiting-taxi-cab.jpg?s=1024x1024&w=is&k=20&c=ryknwrnjVy-mkmHvN-6lG2my5hbpDn2h3AHa76_BX28="
  //       : v,
  // },
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
  review:[
    {
    type: Schema.Types.ObjectId,
    ref: "Review",
  }],
  owner:{
    type: Schema.Types.ObjectId,
    ref: "User",
  }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id: {$in: listing.review}});
  }
})


const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;