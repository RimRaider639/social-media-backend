const mg = require("mongoose");

const postsSchema = mg.Schema({
  userID: { type: mg.Schema.Types.ObjectId, required: true, ref: "user" },
  caption: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
});

const Post = mg.model("post", postsSchema);

module.exports = Post;
