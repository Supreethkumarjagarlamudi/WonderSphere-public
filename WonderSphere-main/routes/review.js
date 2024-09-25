const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const review = require("../models/review.js");
const listings = require("../models/listing.js");
const {
  isLoggedIn,
  isReviewOwner,
  validateReview,
} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

router
  .route("/")
  .post(isLoggedIn, validateReview, wrapAsync(reviewController.saveReview));

router
  .route("/:reviewId")
  .delete(isLoggedIn, isReviewOwner, wrapAsync(reviewController.deleteReview));

module.exports = router;
