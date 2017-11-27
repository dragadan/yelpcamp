var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var commentSchema = mongoose.Schema({
  text: String,
  author: {
    id: {
       type: ObjectId,
       ref : 'User'
    },
    username: String,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
