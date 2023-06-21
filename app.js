const express = require("express");
const userRouter = require("./routes/UserRoute");
const session = require("express-session");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "Secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/", userRouter);

app.listen(3000, () => {
  console.log("listening on port 3000");
});
