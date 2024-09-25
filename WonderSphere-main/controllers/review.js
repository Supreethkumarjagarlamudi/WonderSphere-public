const review = require("../models/review.js");
const listings = require("../models/listing.js");

module.exports.saveReview = async (req, res) => {
  const listing = await listings.findById(req.params.id);
  const newReview = new review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);

  await listing.save();
  await newReview.save();
  req.flash("success", "Review added successfully!");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  const editedListing = await listings.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  const deleteReview = await review.findByIdAndDelete(reviewId);

  await editedListing.save();
  req.flash("success", "Review has been successfully deleted!");
  res.redirect(`/listings/${id}`);
};
