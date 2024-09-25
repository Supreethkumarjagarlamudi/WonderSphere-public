const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listings = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(listingController.index)
  .post(isLoggedIn, upload.single("listings[image]"), validateListing, wrapAsync(listingController.createNew));

router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.show))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listings[image]"),
    validateListing,
    wrapAsync(listingController.updateEdit)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete));

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.showEdit)
);

module.exports = router;
