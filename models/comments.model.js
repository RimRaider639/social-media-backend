const mg = require("mongoose");

const commentSchema = mg.Schema({
  userID: { type: mg.Schema.Types.ObjectId, required: true, ref: "user" },
  postID: { type: mg.Schema.Types.ObjectId, required: true, ref: "post" },
  content: { type: String, required: true },
});

const Comment = mg.model("comment", commentSchema);

module.exports = Comment;
