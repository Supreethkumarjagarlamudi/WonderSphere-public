const listings = require("./models/listing");
const review = require("./models/review");
const ExpressError = require("./utils/expressError.js");
const { listingSchema } = require("./schema.js");
const {reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("danger", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listingOwner = await listings.findById(id);

    if (!listingOwner.owner._id.equals(res.locals.currUser._id)) {
      req.flash(
        "danger",
        "You don't have the authorisation to make the changes"
      );
      return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewOwner = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let reviewOwner = await review.findById(reviewId);
    console.log(reviewOwner);
    if (!reviewOwner.author.equals(res.locals.currUser._id)) {
      req.flash(
        "danger",
        "You don't have the authorisation to delete the review"
      );
      return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    new ExpressError(400, errMsg);
  } else {
    next();
  }
};