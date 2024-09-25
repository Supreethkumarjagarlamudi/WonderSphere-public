// requirements

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const listings = require("./models/listing.js");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const review = require("./models/review.js");
const listingRoute = require("./routes/listings.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const user = require("./models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const port = 8080;
const db_url = process.env.ATLAS_DB_URL;
// dataBase initialisation
async function main() {
  await mongoose.connect(db_url);
}
main()
  .then(() => {
    console.log("database has been connected");
  })
  .catch((err) => {
    console.log(err);
  });

const store = MongoStore.create({
  mongoUrl: db_url,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24*3600
});


// store.on((error) => {
//   console.log("ERROR: Something happenend in mongo store!");
// });
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.danger = req.flash("danger");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/", userRoute);
app.use("/listings", listingRoute);
app.use("/listings/:id/review", reviewRoute);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found"));
});
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.render("error.ejs", { statusCode, message });
});
// connecting to the network
app.listen(port, () => {
  console.log("Server is listening to port", port);
});
