const express = require("express");
const User = require("../models/users.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authenticate = require("../middlewares/authenticate.middleware");
const saltrounds = 5;

const userRouter = express.Router();

userRouter.post("/register", (req, res, next) => {
  const { email, password } = req.body;
  User.find({ email })
    .then((r) =>
      r.length
        ? res.status(409).send({ message: "Email already has an account" })
        : bcrypt.hash(password, saltrounds, (err, hash) => {
            if (err) next(err);
            User.insertMany([{ ...req.body, password: hash }])
              .then((r) =>
                res.send({ message: "User successfully registered" })
              )
              .catch(next);
          })
    )
    .catch(next);
});

userRouter.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  User.find({ email })
    .then((found) => {
      if (!found.length)
        res.status(409).send({ message: "Email is not registered" });
      bcrypt.compare(password, found[0].password).then((match) => {
        if (match) {
          const token = jwt.sign({ id: found[0]._id }, process.env.KEY);
          res.send({ message: "User successfully logged in", token });
        }
        res
          .status(401)
          .send({ message: "Password does not match the given email" });
      });
    })
    .catch(next);
});

userRouter.get("/all", (req, res, next) => {
  const { sort, order, page, limit } = req.query;
  User.find(req.query)
    .limit(limit)
    .skip(limit * page)
    .sort({ [sort]: order == "desc" ? -1 : 1 })
    .then((r) => res.send(r))
    .catch(next);
});

userRouter.use(authenticate);

userRouter.get("/", (req, res, next) => {
  User.findById(req.body.userID)
    .then((data) => res.send(data))
    .catch(next);
});

module.exports = userRouter;
