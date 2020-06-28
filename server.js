// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
var cookieParser = require('cookie-parser');



const app = express();

const bookRouter = require("./routers/book.router");
const userRouter = require("./routers/user.router");
const transactionRouter = require("./routers/transaction.router");
const authRouter = require("./routers/auth.router");
const forgotRouter = require("./routers/forgot.router");

const authMiddleware = require('./middlewares/auth.middleware');

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  
  response.render("index");
});

app.use("/book", authMiddleware.authLogin, bookRouter);
app.use("/user", authMiddleware.authLogin, userRouter);
app.use("/transaction", authMiddleware.authLogin, transactionRouter);
app.use("/auth", authRouter);
app.use("/forgot", forgotRouter);


// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});

