var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // Gives accessibility to flash the message BEFORE redirection to /login
  req.flash("error","You need to be logged in to do that!");
  res.redirect("/login");
};


middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, campground) {
      if (err) {
        req.flash("error","campground not found!");
        res.redirect("back");
      } else {
        if (campground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error","You dont have permession to do that!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error","You need to be logged in to do that!");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, comment) {
      if (err) {
        req.flash("error","comment not found!");
        res.redirect("back");
      } else {
        if (comment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error","You dont have permession to do that!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error","You need to be logged in to do that!");
    res.redirect("back");
  }
};


module.exports = middlewareObj;
