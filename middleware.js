const Listing = require('./models/listing');
const Review = require('./models/reviews');
const ExpressError = require('./utils/ExpressError');
const { listingSchema, reviewSchema } = require('./schema');



module.exports.isLoggedIn =  (req, res, next)=>{
  // Middleware logic here
  if(!req.isAuthenticated()) {
    req.session.redirectTo = req.originalUrl;
    req.flash('error', 'You must be logged in to view this page.');
    return res.redirect('/login');
  }
  // Call the next middleware or route handler
  next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectTo){
    res.locals.redirectTo = req.session.redirectTo;
  }
  next();
}

module.exports.isAuthor = async (req,res,next)=>{
      let{id} = req.params;
      let listing = await Listing.findById(id);
      if(!listing.owner.equals(res.locals.currUser._id)){
          req.flash("error","You do not have permission to edit this listing");
          return res.redirect(`/listings/${id}`)
      }
      next();
}

module.exports.isOwner = async(req,res,next)=>{
  let{id, reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You do not have permission to delete this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
}