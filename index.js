const mongoose = require("mongoose");
const express = require("express");
const AdminRouter = require("./routers/admin");
const AuthRouter = require("./routers/auth");
const ServiceRouter = require("./routers/service");
const PostRouter = require("./routers/post");

const app = express();

app.use("/admin", AdminRouter);
app.use("/auth", AuthRouter);
app.use("/service", ServiceRouter);
app.use("/post", PostRouter);

mongoose
  .connect("mongodb://127.0.0.1:27017/review-app")
  .then(() => console.log("mongodb connected"))
  .catch((ex) => console.log(ex));

const port = 3001;
app.listen(port, () => console.log(`server listen to port ${port}`));
