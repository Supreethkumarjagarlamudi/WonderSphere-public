const listings = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await listings.find({});
  res.render("listings/listings.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await listings
    .findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createNew = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let listing = req.body.listings;

  let response = await geocodingClient
  .forwardGeocode({
    query: `${listing.location}, ${listing.country}`,
    limit: 1,
  })
  .send();

  const newListing = new listings(listing);
  newListing.geometry = response.body.features[0].geometry;
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

module.exports.showEdit = async (req, res) => {
  let { id } = req.params;
  const list = await listings.findById(id);
  res.render("listings/edit.ejs", { list });
};

module.exports.updateEdit = async (req, res) => {
  let { id } = req.params;
  let updatelist = await listings.findByIdAndUpdate(id, {
    ...req.body.listings,
  });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatelist.image = { url, filename };
    await updatelist.save();
  }
  req.flash("success", "listing edited successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await listings.findByIdAndDelete(id);
  req.flash("danger", "Listing has been successfully deleted!");
  res.redirect("/listings");
};
