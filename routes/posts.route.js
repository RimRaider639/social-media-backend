const express = require("express");
const fs = require("fs");
const Post = require("../models/posts.model");
const authenticate = require("../middlewares/authenticate.middleware");
const postsRouter = express.Router();

//open routes

postsRouter.get("/", (req, res, next) => {
  let { page, limit, sort, order, ...filters } = req.query;
  //   if (q) Object.assign(filters, { $text: { $search: q } });
  Post.find(filters)
    .populate("userID", "username pfp")
    .limit(limit)
    .skip(page * limit)
    .sort({ [sort]: order == "desc" ? -1 : 1 })
    .then((data) => {
      res.send(data);
    })
    .catch(next);
});

postsRouter.get("/:id", (req, res, next) => {
  const { id } = req.params;
  Post.findById(id)
    .then((data) => res.send(data))
    .catch(next);
});

//requires logging in as an admin

postsRouter.use(authenticate);

postsRouter.post("/", (req, res, next) => {
  const newPost = new Post(req.body);
  newPost
    .save()
    .then((_) => res.send({ message: "Post successfully created" }))
    .catch(next);
});

postsRouter.patch("/:id", (req, res, next) => {
  const { id } = req.params;
  Post.findByIdAndUpdate(id, req.body)
    .then((_) =>
      res.send({ message: `Post with ID ${id} is successfully updated` })
    )
    .catch(next);
});

postsRouter.delete("/:id", (req, res, next) => {
  const { id } = req.params;
  Post.findByIdAndDelete(id)
    .then((_) =>
      res.send({ message: `Post with ID ${id} is successfully deleted` })
    )
    .catch(next);
});

module.exports = postsRouter;
