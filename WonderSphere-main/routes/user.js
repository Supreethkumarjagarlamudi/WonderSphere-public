const express = require("express");
const router = express.Router();
const users = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router
  .route("/registration")
  .get(userController.getRegis)
  .post(userController.postRegis);
router
  .route("/login")
  .get(userController.login)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.authLogin
  );
router.route("/logout").get(userController.logout);


module.exports = router;

