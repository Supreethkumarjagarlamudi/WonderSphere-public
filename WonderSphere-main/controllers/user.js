const users = require("../models/user.js");
const passport = require("passport");

module.exports.getRegis = (req, res) => {
  res.render("user/registration.ejs");
};

module.exports.postRegis = async (req, res) => {
  let { username, email, password } = req.body;
  let newUser = new users({ email, username });
  let registeredUser = await users.register(newUser, password);
  req.flash("success", "Congragulations! you have successfully registered in.");
  res.redirect("/login");
};

module.exports.login = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.authLogin = async (req, res) => {
  req.flash("success", "Welcome to wonderlust!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
  });
};
