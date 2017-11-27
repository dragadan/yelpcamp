  var express = require('express');
  var router = express.Router({mergeParams: true});
  var Campground = require('../models/campground');
  var middleware = require('../middlewares');

  // INDEX - show all campgrounds
  router.get("/", function(req, res) {
    // get all campgrounds from the DB
    Campground.find({}, function(err, allcampgrounds) {
      if (err) {
        throw err
      } else {
        res.render("campgrounds/index", {
          campgrounds: allcampgrounds,
        })
      }
    })
  });

  // CREATE - add new campground to DB
  router.post("/", middleware.isLoggedIn, function(req, res) {
    // get data from the form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
      id: req.user._id,
      username: req.user.username
    };
    var newCampground = {
      name: name,
      image: image,
      description: desc,
      author: author
    }
    // create new campground and save to DB
    Campground.create(newCampground, function(err, campground) {
      if (err) {
        throw err
      } else {
        // redirect back to campgrounds page
        res.redirect("/campgrounds");
      }
    })
  });

  // NEW - display form to create new campground
  router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new")
  });

  // SHOW - shows info about one specific campground
  router.get("/:id", function(req, res) {
    // find campground with the provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
      if (err) {
        throw err
      } else {
        // render show template of the campground found
        res.render("campgrounds/show", {
          campground: foundCampground
        })
      }
    })
  });


  //EDIT
  router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
      if (err) {
        res.redirect("/campgrounds");
      } else {
        res.render("campgrounds/edit", { campground: campground });
      }
    });
  });

  // UPDATE
  router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    //TODO: use middleware instead to sanitize
    // req.body.campground.description = req.sanitize(req.body.campground.description)
    Campground.findByIdAndUpdate(req.params.id, req.body.campground ,function(err, updatedCampground) {
      if (err) {
        res.redirect("/campgrounds");
      } else {
        res.redirect(`/campgrounds/${req.params.id}`);
      }
    })
  });

  // DESTROY
  router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id,function(err) {
      if (err) {
        res.redirect("/campgrounds");
      } else {
        req.flash("success","campground deleted!");
        res.redirect("/campgrounds");
      }
    })
  })

module.exports = router;
