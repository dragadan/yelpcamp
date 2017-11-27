var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var data = [{
    name: "Salmon greek",
    image: "https://images.unsplash.com/photo-1455763916899-e8b50eca9967?auto=format&fit=crop&w=1050&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
    description: "quae malis eram nulla fore aliqua quem multos culpa culpa labore quorum quorum velit nulla irure culpa dolor duis aute"
  },
  {
    name: "Granite Hill",
    image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?auto=format&fit=crop&w=750&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
    description: "magna multos sint ipsum ipsum summis magna illum ipsum quae",
  },
  {
    name: "Mountain Goat",
    image: "https://images.unsplash.com/photo-1496545672447-f699b503d270?auto=format&fit=crop&w=751&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
    description: "tamen minim sunt aliqua quorum culpa culpa quid duis enim labore illum minim sint quis",
  },
];

function seedDB() {
  // Remove all campgrounds
  Campground.remove({}, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Removed campgrounds!");
      data.forEach((seed) => {
        // Add a campground
        Campground.create(seed, function(err, camp) {
          if (err) {
            console.log(err);
          } else {
            console.log("Added a campground");
            // Add a comment
            Comment.create({
              text: "This place is great but i wish there was internet!",
              author: "Homer",
            },function(err, comment) {
              if (err){
                console.log(err);
              }
              else{
                camp.comments.push(comment);
                camp.save();
                console.log("created new comment");
              }
            })
          }
        })
      });

    }
  })




}

module.exports = seedDB;
