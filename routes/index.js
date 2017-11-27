var express = require('express');
var router = express.Router({mergeParams: true});
var passport = require('passport');

var User = require('../models/user');

router.get("/", function(req, res) {
  res.render("landing")
});

// show auth form
router.get("/register", function(req, res) {
  res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      req.flash("error", err.message)
      return res.render("register");
    } else {
      passport.authenticate("local")(req, res, function() {
        req.flash("success", `Welcome to YelpCamp ${user.username}`)
        res.redirect("/campgrounds");
      })
    }
  })
});


// show login form
router.get("/login",function(req, res) {
  res.render("login");
});

// handeling login logic
// middleware : sit between the begining (route) and the end (last handler)
// `authenticate` method is comming from here `passport.use(new LocalStrategy(User.authenticate()))`
router.post("/login", passport.authenticate("local",{
    successRedirect : "/campgrounds",
    failureRedirect : "/login"
  }),
  function(req, res) {
 // ...
});

// logout route
router.get("/logout",function(req, res) {
  req.flash("success","Logged you out!");
  req.logout();
  res.redirect("/campgrounds");
})

module.exports = router;
