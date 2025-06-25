const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const {isLoggedIn , isAuthor, isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const reviewController = require("../controllers/reviews.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});



const validatelisting = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

const validateReview = (req,res,next)=>{
    console.log(req.body);
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

//New Route
router.get("/new",isLoggedIn, listingController.renderNewForm)

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validatelisting,
    wrapAsync(listingController.createListing)
  );  

router
  .route("/:id")
  .get( wrapAsync(listingController.showListing))
  .put(
    isAuthor,
    upload.single('listing[image]'),
    validatelisting,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isAuthor,
    wrapAsync(listingController.destroyListing)
  );

router.get("/:id/edit", isLoggedIn , isAuthor ,wrapAsync(listingController.renderEditForm));

//POST Route
router.post("/:id/reviews", isLoggedIn , validateReview,wrapAsync(reviewController.createReview)
);

//Delete Review
router.delete("/:id/reviews/:reviewId", isLoggedIn, isOwner ,wrapAsync(reviewController.deleteReview));

module.exports = router;    