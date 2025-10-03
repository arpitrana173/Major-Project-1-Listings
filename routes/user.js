const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectedUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.get("/signup", userController.signupForm);

router.get("/login", userController.loginForm);

router.post("/signup", wrapasync(userController.signup));

router.post(
  "/login",
  saveRedirectedUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapasync(userController.login)
);

router.get("/logout", userController.logout);

module.exports = router;
