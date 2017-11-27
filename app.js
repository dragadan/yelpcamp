var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user');
var seedDB = require('./seeds');

// Requiring routes
var campgroundRoutes = require('./routes/campgrounds');
var commmentRoutes = require('./routes/comments');
var indexRoutes = require('./routes/index');

var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var expressSession = require("express-session");

app.set("view engine", "ejs");

// BEFORE passport configuration !
app.use(flash());

// PASSPORT CONFIGURATION
app.use(expressSession({
  secret: "dragadan-yelp",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());



passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// DB
mongoose.connect('mongodb://localhost/yelp_camp', {
  useMongoClient: true
});
mongoose.Promise = global.Promise;

// SEED the database
// seedDB();

// MIDDLEWARES
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride("_method"));



app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//ROUTING
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments/",commmentRoutes);

app.listen(3000, function() {
  console.log("YelpCamp server started on port 3000 ...");
});
