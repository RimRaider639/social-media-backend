const express = require("express");
const connection = require("./config/db");
const userRouter = require("./routes/users.route");
const postsRouter = require("./routes/posts.route");
const commentsRouter = require("./routes/comments.route");
const cors = require("cors");
const app = express();
app.use(cors(), express.json());

app.use("/user", userRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.listen(8080, async () => {
  console.log("Server is running at 8080");
  await connection;
  console.log("Connected to DB");
});
