const express = require("express");
const Comment = require("../models/comments.model");
const authenticate = require("../middlewares/authenticate.middleware");
const commentsRouter = express.Router();

//open routes

commentsRouter.get("/", (req, res, next) => {
  let { page, limit, sort, order, ...filters } = req.query;
  //   if (q) Object.assign(filters, { $text: { $search: q } });
  Comment.find(filters)
    .populate("userID", "username pfp")
    .limit(limit)
    .skip(page * limit)
    .sort({ [sort]: order == "desc" ? -1 : 1 })
    .then((data) => {
      res.send(data);
    })
    .catch(next);
});

commentsRouter.get("/:id", (req, res, next) => {
  const { id } = req.params;
  Comment.findById(id)
    .then((data) => res.send(data))
    .catch(next);
});

//requires logging in as an user

commentsRouter.use(authenticate);

commentsRouter.post("/", (req, res, next) => {
  const newComment = new Comment(req.body);
  newComment
    .save()
    .then((_) => res.send({ message: "Comment successfully created" }))
    .catch(next);
});

commentsRouter.patch("/:id", (req, res, next) => {
  const { id } = req.params;
  Comment.findByIdAndUpdate(id, req.body)
    .then((_) =>
      res.send({ message: `Comment with ID ${id} is successfully updated` })
    )
    .catch(next);
});

commentsRouter.delete("/:id", (req, res, next) => {
  const { id } = req.params;
  Comment.findByIdAndDelete(id)
    .then((_) =>
      res.send({ message: `Comment with ID ${id} is successfully deleted` })
    )
    .catch(next);
});

module.exports = commentsRouter;
