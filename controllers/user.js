const user = require("../models/user.js");

module.exports.signupForm = (req, res) => {
  res.render("signup");
};

module.exports.loginForm = (req, res) => {
  res.render("login");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newuser = new user({ username, email });
    let registereduser = await user.register(newuser, password);
    req.login(registereduser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WanderLust");
      res.redirect("/listing");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Wander Lust");
  let redirectUrl = res.locals.redirectUrl || "/listing";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged Out Successfully");
    res.redirect("/listing");
  });
};
